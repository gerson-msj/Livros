import { assert, assertEquals } from "jsr:@std/assert@1"
import {
    type Author,
    type CreateStandaloneBookInput,
    DuplicateStandaloneBookError,
    type StandaloneBook,
    StandaloneBookValidationError
} from "../dominio/livros.ts"
import type { Session } from "../dominio/autenticacao.ts"
import { SESSION_COOKIE_NAME } from "../infraestrutura/session_cookie.ts"
import { handler } from "./biblioteca/livros/novo.tsx"

Deno.test("GET /biblioteca/livros/novo redireciona visitante sem sessao para login", async () => {
    const response = await handler.GET!(createContext(new Request("http://localhost/biblioteca/livros/novo"), null, new FakeBooksService()))

    assert(response instanceof Response)
    assertEquals(response.status, 303)
    assertEquals(response.headers.get("location"), "/login")
})

Deno.test("GET /biblioteca/livros/novo carrega autores do usuario autenticado", async () => {
    const books = new FakeBooksService()
    books.authors.set("user-a", [
        createAuthor({ id: "author-a", userId: "user-a", name: "Marta Lins" }),
        createAuthor({ id: "author-b", userId: "user-a", name: "Helena Duarte" })
    ])
    books.authors.set("user-b", [
        createAuthor({ id: "author-c", userId: "user-b", name: "Autor de outro usuario" })
    ])

    const response = await handler.GET!(createContext(createRequestWithSession("session-a"), createSession("session-a", "user-a"), books))

    assert(!(response instanceof Response))
    assertEquals(response.data.authors, [
        { id: "author-a", name: "Marta Lins" },
        { id: "author-b", name: "Helena Duarte" }
    ])
})

Deno.test("POST /biblioteca/livros/novo cria livro real para o usuario autenticado", async () => {
    const books = new FakeBooksService()
    const response = await handler.POST!(
        createContext(
            createRequestWithSession("session-a", {
                title: "Duna",
                authorName: "Frank Herbert",
                readingStartedOn: "2026-06-01",
                readingFinishedOn: ""
            }),
            createSession("session-a", "user-a"),
            books
        )
    )

    assert(response instanceof Response)
    assertEquals(response.status, 200)
    assertEquals(books.created, [
        {
            userId: "user-a",
            title: "Duna",
            authorName: "Frank Herbert",
            readingStartedOn: "2026-06-01",
            readingFinishedOn: ""
        }
    ])
    assertEquals(await response.json(), {
        ok: true,
        messages: ['"Duna" foi salvo na sua biblioteca.'],
        redirectTo: "/biblioteca/livros"
    })
})

Deno.test("POST /biblioteca/livros/novo retorna erros de validacao sem criar livro", async () => {
    const books = new FakeBooksService()
    books.error = new StandaloneBookValidationError([
        { field: "title", message: "O titulo deve conter no minimo 2 caracteres." },
        { field: "authorName", message: "O autor deve conter no minimo 2 caracteres." }
    ])

    const response = await handler.POST!(
        createContext(
            createRequestWithSession("session-a", { title: "", authorName: "" }),
            createSession("session-a", "user-a"),
            books
        )
    )

    assert(response instanceof Response)
    assertEquals(response.status, 400)
    assertEquals(books.created.length, 0)
    assertEquals(await response.json(), {
        ok: false,
        messages: [
            "O titulo deve conter no minimo 2 caracteres.",
            "O autor deve conter no minimo 2 caracteres."
        ]
    })
})

Deno.test("POST /biblioteca/livros/novo recusa duplicidade informada pelo dominio", async () => {
    const books = new FakeBooksService()
    books.error = new DuplicateStandaloneBookError()

    const response = await handler.POST!(
        createContext(
            createRequestWithSession("session-a", { title: "Duna", authorName: "Frank Herbert" }),
            createSession("session-a", "user-a"),
            books
        )
    )

    assert(response instanceof Response)
    assertEquals(response.status, 400)
    assertEquals(await response.json(), {
        ok: false,
        messages: ["Ja existe um livro com este titulo e autor."]
    })
})

type NovoLivroContext = Parameters<NonNullable<typeof handler.GET>>[0]

function createContext(request: Request, session: Session | null, books: FakeBooksService): NovoLivroContext {
    return {
        req: request,
        state: {
            services: {
                authentication: {
                    findActiveSession: () => Promise.resolve(session)
                },
                books
            }
        }
    } as unknown as NovoLivroContext
}

function createRequestWithSession(sessionId: string, form?: Record<string, string>): Request {
    return new Request("http://localhost/biblioteca/livros/novo", {
        method: form ? "POST" : "GET",
        headers: {
            cookie: `${SESSION_COOKIE_NAME}=${sessionId}`
        },
        body: form ? toFormData(form) : undefined
    })
}

function toFormData(values: Record<string, string>): FormData {
    const form = new FormData()

    for (const [key, value] of Object.entries(values)) {
        form.set(key, value)
    }

    return form
}

function createSession(id: string, userId: string): Session {
    return {
        id,
        userId,
        expiresAt: new Date("2026-06-30T12:00:00.000Z"),
        createdAt: new Date("2026-06-22T12:00:00.000Z"),
        endedAt: null
    }
}

function createAuthor(input: { id: string; userId: string; name: string }): Author {
    return {
        id: input.id,
        userId: input.userId,
        name: input.name,
        normalizedName: input.name.toLowerCase(),
        createdAt: new Date("2026-06-22T12:00:00.000Z")
    }
}

function createBook(input: CreateStandaloneBookInput): StandaloneBook {
    return {
        id: "book-a",
        userId: input.userId,
        title: input.title.trim(),
        normalizedTitle: input.title.trim().toLowerCase(),
        author: createAuthor({ id: "author-a", userId: input.userId, name: input.authorName.trim() }),
        readingStartedOn: input.readingStartedOn?.trim() || null,
        readingFinishedOn: input.readingFinishedOn?.trim() || null,
        createdAt: new Date("2026-06-22T12:00:00.000Z")
    }
}

class FakeBooksService {
    readonly authors = new Map<string, Author[]>()
    readonly created: CreateStandaloneBookInput[] = []
    error: Error | null = null

    listAuthors(userId: string): Promise<Author[]> {
        return Promise.resolve(this.authors.get(userId) ?? [])
    }

    createStandaloneBook(input: CreateStandaloneBookInput): Promise<StandaloneBook> {
        if (this.error) {
            return Promise.reject(this.error)
        }

        this.created.push(input)
        return Promise.resolve(createBook(input))
    }
}
