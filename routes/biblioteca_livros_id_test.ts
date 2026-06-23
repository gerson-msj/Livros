import { assert, assertEquals } from "jsr:@std/assert@1"
import type { Session } from "../dominio/autenticacao.ts"
import type { StandaloneBook, UpdateStandaloneBookDatesInput } from "../dominio/livros.ts"
import { StandaloneBookValidationError } from "../dominio/livros.ts"
import { SESSION_COOKIE_NAME } from "../infraestrutura/session_cookie.ts"
import { handler } from "./biblioteca/livros/[id].tsx"

Deno.test("GET /biblioteca/livros/:id redireciona visitante sem sessao para login", async () => {
    const response = await handler.GET!(
        createContext(new Request("http://localhost/biblioteca/livros/book-a"), null, new FakeBooksService())
    )

    assert(response instanceof Response)
    assertEquals(response.status, 303)
    assertEquals(response.headers.get("location"), "/login")
})

Deno.test("GET /biblioteca/livros/:id carrega livro proprio para edicao", async () => {
    const books = new FakeBooksService()
    books.items.set("book-a", createBook({ id: "book-a", userId: "user-a", title: "Duna" }))
    books.items.set("book-b", createBook({ id: "book-b", userId: "user-b", title: "Livro alheio" }))

    const response = await handler.GET!(
        createContext(createRequestWithSession("session-a", "book-a"), createSession("session-a", "user-a"), books)
    )

    assert(!(response instanceof Response))
    assertEquals(response.data.book, {
        id: "book-a",
        title: "Duna",
        author: "Autor Teste",
        readingStartedOn: null,
        readingFinishedOn: null
    })
})

Deno.test("GET /biblioteca/livros/:id redireciona livro de outro usuario para lista", async () => {
    const books = new FakeBooksService()
    books.items.set("book-a", createBook({ id: "book-a", userId: "user-b", title: "Livro alheio" }))

    const response = await handler.GET!(
        createContext(createRequestWithSession("session-a", "book-a"), createSession("session-a", "user-a"), books)
    )

    assert(response instanceof Response)
    assertEquals(response.status, 303)
    assertEquals(response.headers.get("location"), "/biblioteca/livros")
})

Deno.test("POST /biblioteca/livros/:id salva datas reais do livro proprio", async () => {
    const books = new FakeBooksService()
    books.items.set("book-a", createBook({ id: "book-a", userId: "user-a", title: "Duna" }))

    const response = await handler.POST!(
        createContext(
            createRequestWithSession("session-a", "book-a", {
                readingStartedOn: "2026-06-01",
                readingFinishedOn: "2026-06-20"
            }),
            createSession("session-a", "user-a"),
            books
        )
    )

    assert(response instanceof Response)
    assertEquals(response.status, 200)
    assertEquals(books.updated, [
        {
            userId: "user-a",
            bookId: "book-a",
            readingStartedOn: "2026-06-01",
            readingFinishedOn: "2026-06-20"
        }
    ])
    assertEquals(await response.json(), {
        ok: true,
        messages: ['As datas de "Duna" foram salvas.'],
        redirectTo: "/biblioteca/livros"
    })
})

Deno.test("POST /biblioteca/livros/:id recusa datas invalidas sem salvar", async () => {
    const books = new FakeBooksService()
    books.error = new StandaloneBookValidationError([
        { field: "readingStartedOn", message: "A data de inicio nao pode ser posterior a data de conclusao." }
    ])

    const response = await handler.POST!(
        createContext(
            createRequestWithSession("session-a", "book-a", {
                readingStartedOn: "2026-07-01",
                readingFinishedOn: "2026-06-20"
            }),
            createSession("session-a", "user-a"),
            books
        )
    )

    assert(response instanceof Response)
    assertEquals(response.status, 400)
    assertEquals(books.updated.length, 0)
    assertEquals(await response.json(), {
        ok: false,
        messages: ["A data de inicio nao pode ser posterior a data de conclusao."]
    })
})

Deno.test("POST /biblioteca/livros/:id bloqueia livro de outro usuario", async () => {
    const books = new FakeBooksService()
    books.items.set("book-a", createBook({ id: "book-a", userId: "user-b", title: "Livro alheio" }))

    const response = await handler.POST!(
        createContext(
            createRequestWithSession("session-a", "book-a", { readingStartedOn: "2026-06-01" }),
            createSession("session-a", "user-a"),
            books
        )
    )

    assert(response instanceof Response)
    assertEquals(response.status, 404)
    assertEquals(await response.json(), {
        ok: false,
        messages: ["Livro nao encontrado na sua biblioteca."]
    })
})

Deno.test("DELETE /biblioteca/livros/:id exclui livro proprio", async () => {
    const books = new FakeBooksService()
    books.items.set("book-a", createBook({ id: "book-a", userId: "user-a", title: "Duna" }))

    const response = await handler.DELETE!(
        createContext(createRequestWithSession("session-a", "book-a", undefined, "DELETE"), createSession("session-a", "user-a"), books)
    )

    assert(response instanceof Response)
    assertEquals(response.status, 200)
    assertEquals(books.deleted, [{ userId: "user-a", bookId: "book-a" }])
    assertEquals(await response.json(), {
        ok: true,
        messages: ['"Duna" foi excluido da sua biblioteca.'],
        redirectTo: "/biblioteca/livros"
    })
})

Deno.test("DELETE /biblioteca/livros/:id bloqueia livro de outro usuario", async () => {
    const books = new FakeBooksService()
    books.items.set("book-a", createBook({ id: "book-a", userId: "user-b", title: "Livro alheio" }))

    const response = await handler.DELETE!(
        createContext(createRequestWithSession("session-a", "book-a", undefined, "DELETE"), createSession("session-a", "user-a"), books)
    )

    assert(response instanceof Response)
    assertEquals(response.status, 404)
    assertEquals(books.deleted.length, 0)
    assertEquals(await response.json(), {
        ok: false,
        messages: ["Livro nao encontrado na sua biblioteca."]
    })
})

type EditarLivroContext = Parameters<NonNullable<typeof handler.GET>>[0]

function createContext(request: Request, session: Session | null, books: FakeBooksService): EditarLivroContext {
    return {
        req: request,
        params: {
            id: new URL(request.url).pathname.split("/").at(-1)
        },
        state: {
            services: {
                authentication: {
                    findActiveSession: () => Promise.resolve(session)
                },
                books
            }
        }
    } as unknown as EditarLivroContext
}

function createRequestWithSession(
    sessionId: string,
    bookId: string,
    form?: Record<string, string>,
    method = form ? "POST" : "GET"
): Request {
    return new Request(`http://localhost/biblioteca/livros/${bookId}`, {
        method,
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

function createBook(input: {
    id: string
    userId: string
    title: string
    readingStartedOn?: string | null
    readingFinishedOn?: string | null
}): StandaloneBook {
    return {
        id: input.id,
        userId: input.userId,
        title: input.title,
        normalizedTitle: input.title.toLowerCase(),
        author: {
            id: `author-${input.id}`,
            userId: input.userId,
            name: "Autor Teste",
            normalizedName: "autor teste",
            createdAt: new Date("2026-06-22T12:00:00.000Z")
        },
        readingStartedOn: input.readingStartedOn ?? null,
        readingFinishedOn: input.readingFinishedOn ?? null,
        createdAt: new Date("2026-06-22T12:00:00.000Z")
    }
}

class FakeBooksService {
    readonly items = new Map<string, StandaloneBook>()
    readonly updated: UpdateStandaloneBookDatesInput[] = []
    readonly deleted: Array<{ userId: string; bookId: string }> = []
    error: Error | null = null

    findStandaloneBook(userId: string, bookId: string): Promise<StandaloneBook | null> {
        const book = this.items.get(bookId)

        if (!book || book.userId !== userId) {
            return Promise.resolve(null)
        }

        return Promise.resolve(book)
    }

    updateStandaloneBookDates(input: UpdateStandaloneBookDatesInput): Promise<StandaloneBook | null> {
        if (this.error) {
            return Promise.reject(this.error)
        }

        const book = this.items.get(input.bookId)

        if (!book || book.userId !== input.userId) {
            return Promise.resolve(null)
        }

        this.updated.push(input)
        const updatedBook = {
            ...book,
            readingStartedOn: input.readingStartedOn?.trim() || null,
            readingFinishedOn: input.readingFinishedOn?.trim() || null
        }
        this.items.set(updatedBook.id, updatedBook)

        return Promise.resolve(updatedBook)
    }

    deleteStandaloneBook(userId: string, bookId: string): Promise<boolean> {
        const book = this.items.get(bookId)

        if (!book || book.userId !== userId) {
            return Promise.resolve(false)
        }

        this.deleted.push({ userId, bookId })
        this.items.delete(bookId)

        return Promise.resolve(true)
    }
}
