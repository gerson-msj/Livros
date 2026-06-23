import { createClient } from "@libsql/client"
import { assert, assertEquals, assertStringIncludes } from "jsr:@std/assert@1"
import { AuthenticationService, type Clock, type IdGenerator } from "../aplicacao/autenticacao_service.ts"
import { BooksService } from "../aplicacao/livros_service.ts"
import { LibsqlSessionRepository, LibsqlUserRepository } from "../infraestrutura/auth_repositories.ts"
import { LibsqlAuthorRepository, LibsqlStandaloneBookRepository } from "../infraestrutura/book_repositories.ts"
import { WebCryptoSecretHasher } from "../infraestrutura/crypto.ts"
import { ensureDatabaseSchema } from "../infraestrutura/database.ts"
import type { RequestServices } from "../infraestrutura/provider.ts"
import { SESSION_COOKIE_NAME } from "../infraestrutura/session_cookie.ts"
import { handler as bibliotecaHandler } from "./biblioteca.tsx"
import { handler as livrosHandler } from "./biblioteca/livros.tsx"
import { handler as editarLivroHandler } from "./biblioteca/livros/[id].tsx"
import { handler as novoLivroHandler } from "./biblioteca/livros/novo.tsx"
import { handler as cadastroHandler } from "./cadastro.tsx"

Deno.test("fluxo integrado gerencia livros avulsos com persistencia real e isolamento por usuario", async () => {
    const dbPath = await Deno.makeTempFile({ suffix: ".db" })
    const client = createClient({ url: `file:${dbPath.replaceAll("\\", "/")}` })
    const ids = new FixedIds()
    const clock = new IncrementingClock(new Date("2026-06-23T12:00:00.000Z"))
    const services: RequestServices = {
        authentication: new AuthenticationService(
            new LibsqlUserRepository(client),
            new LibsqlSessionRepository(client),
            new WebCryptoSecretHasher(),
            ids,
            clock
        ),
        books: new BooksService(
            new LibsqlAuthorRepository(client),
            new LibsqlStandaloneBookRepository(client),
            ids,
            clock
        )
    }

    try {
        await ensureDatabaseSchema(client)

        const firstUserRegistration = await cadastroHandler.POST!(createContext(
            createFormRequest("/cadastro", {
                username: "gerson",
                password: "senha-secreta"
            }),
            services
        ))
        const firstUserCookie = getSessionCookie(firstUserRegistration)

        const biblioteca = await bibliotecaHandler.GET!(createContext(createRequest("GET", "/biblioteca", firstUserCookie), services))
        assert(!(biblioteca instanceof Response))

        const emptyList = await livrosHandler.GET!(createContext(createRequest("GET", "/biblioteca/livros", firstUserCookie), services))
        assert(!(emptyList instanceof Response))
        assertEquals(emptyList.data.books, [])

        const createBook = await novoLivroHandler.POST!(createContext(
            createFormRequest("/biblioteca/livros/novo", {
                title: "Duna",
                authorName: "Frank Herbert",
                readingStartedOn: "2026-06-01",
                readingFinishedOn: ""
            }, firstUserCookie),
            services
        ))
        assertJsonResponse(createBook)
        assertEquals(createBook.status, 200)
        assertEquals(await createBook.json(), {
            ok: true,
            messages: ['"Duna" foi salvo na sua biblioteca.'],
            redirectTo: "/biblioteca/livros"
        })

        const duplicateBook = await novoLivroHandler.POST!(createContext(
            createFormRequest("/biblioteca/livros/novo", {
                title: "duna",
                authorName: "frank herbert"
            }, firstUserCookie),
            services
        ))
        assertJsonResponse(duplicateBook)
        assertEquals(duplicateBook.status, 400)
        assertEquals(await duplicateBook.json(), {
            ok: false,
            messages: ["Ja existe um livro com este titulo e autor."]
        })

        const sameTitleDifferentAuthor = await novoLivroHandler.POST!(createContext(
            createFormRequest("/biblioteca/livros/novo", {
                title: "Duna",
                authorName: "Outra Pessoa"
            }, firstUserCookie),
            services
        ))
        assertJsonResponse(sameTitleDifferentAuthor)
        assertEquals(sameTitleDifferentAuthor.status, 200)

        const listAfterCreate = await livrosHandler.GET!(
            createContext(createRequest("GET", "/biblioteca/livros", firstUserCookie), services)
        )
        assert(!(listAfterCreate instanceof Response))
        assertEquals(listAfterCreate.data.books.map((book) => ({ title: book.title, author: book.author })), [
            { title: "Duna", author: "Outra Pessoa" },
            { title: "Duna", author: "Frank Herbert" }
        ])
        const frankHerbertBookId = listAfterCreate.data.books[1].id

        const authorsForNextBook = await novoLivroHandler.GET!(
            createContext(createRequest("GET", "/biblioteca/livros/novo", firstUserCookie), services)
        )
        assert(!(authorsForNextBook instanceof Response))
        assertEquals(authorsForNextBook.data.authors.map((author) => author.name), ["Frank Herbert", "Outra Pessoa"])

        const editPage = await editarLivroHandler.GET!(
            createContext(createRequest("GET", `/biblioteca/livros/${frankHerbertBookId}`, firstUserCookie), services, {
                id: frankHerbertBookId
            })
        )
        assert(!(editPage instanceof Response))
        assertEquals(editPage.data.book.title, "Duna")
        assertEquals(editPage.data.book.author, "Frank Herbert")

        const updateBook = await editarLivroHandler.POST!(
            createContext(
                createFormRequest(`/biblioteca/livros/${frankHerbertBookId}`, {
                    readingStartedOn: "2026-06-02",
                    readingFinishedOn: "2026-06-20"
                }, firstUserCookie),
                services,
                { id: frankHerbertBookId }
            )
        )
        assertJsonResponse(updateBook)
        assertEquals(updateBook.status, 200)
        assertEquals(await updateBook.json(), {
            ok: true,
            messages: ['As datas de "Duna" foram salvas.'],
            redirectTo: "/biblioteca/livros"
        })

        const invalidDates = await editarLivroHandler.POST!(
            createContext(
                createFormRequest(`/biblioteca/livros/${frankHerbertBookId}`, {
                    readingStartedOn: "2026-07-01",
                    readingFinishedOn: "2026-06-20"
                }, firstUserCookie),
                services,
                { id: frankHerbertBookId }
            )
        )
        assertJsonResponse(invalidDates)
        assertEquals(invalidDates.status, 400)
        assertEquals(await invalidDates.json(), {
            ok: false,
            messages: ["A data de inicio nao pode ser posterior a data de conclusao."]
        })

        const secondUserRegistration = await cadastroHandler.POST!(createContext(
            createFormRequest("/cadastro", {
                username: "maria",
                password: "senha-secreta"
            }),
            services
        ))
        const secondUserCookie = getSessionCookie(secondUserRegistration)

        const secondUserList = await livrosHandler.GET!(
            createContext(createRequest("GET", "/biblioteca/livros", secondUserCookie), services)
        )
        assert(!(secondUserList instanceof Response))
        assertEquals(secondUserList.data.books, [])

        const secondUserEdit = await editarLivroHandler.GET!(
            createContext(createRequest("GET", `/biblioteca/livros/${frankHerbertBookId}`, secondUserCookie), services, {
                id: frankHerbertBookId
            })
        )
        assert(secondUserEdit instanceof Response)
        assertEquals(secondUserEdit.status, 303)
        assertEquals(secondUserEdit.headers.get("location"), "/biblioteca/livros")

        const secondUserDelete = await editarLivroHandler.DELETE!(
            createContext(createRequest("DELETE", `/biblioteca/livros/${frankHerbertBookId}`, secondUserCookie), services, {
                id: frankHerbertBookId
            })
        )
        assertJsonResponse(secondUserDelete)
        assertEquals(secondUserDelete.status, 404)

        const deleteBook = await editarLivroHandler.DELETE!(
            createContext(createRequest("DELETE", `/biblioteca/livros/${frankHerbertBookId}`, firstUserCookie), services, {
                id: frankHerbertBookId
            })
        )
        assertJsonResponse(deleteBook)
        assertEquals(deleteBook.status, 200)
        assertEquals(await deleteBook.json(), {
            ok: true,
            messages: ['"Duna" foi excluido da sua biblioteca.'],
            redirectTo: "/biblioteca/livros"
        })

        const listAfterDelete = await livrosHandler.GET!(
            createContext(createRequest("GET", "/biblioteca/livros", firstUserCookie), services)
        )
        assert(!(listAfterDelete instanceof Response))
        assertEquals(listAfterDelete.data.books.map((book) => ({ title: book.title, author: book.author })), [
            { title: "Duna", author: "Outra Pessoa" }
        ])
    } finally {
        client.close()
        await Deno.remove(dbPath).catch(() => {})
    }
})

type RouteContext = Parameters<NonNullable<typeof cadastroHandler.GET>>[0]
type CadastroResponse = Awaited<ReturnType<NonNullable<typeof cadastroHandler.POST>>>

function createContext(request: Request, services: RequestServices, params: Record<string, string> = {}): RouteContext {
    return {
        req: request,
        params,
        state: {
            services
        }
    } as unknown as RouteContext
}

function createRequest(method: "GET" | "POST" | "DELETE", path: string, cookie?: string): Request {
    return new Request(`http://localhost${path}`, {
        method,
        headers: cookie
            ? {
                cookie
            }
            : undefined
    })
}

function createFormRequest(path: string, values: Record<string, string>, cookie?: string): Request {
    const headers: HeadersInit = {
        "content-type": "application/x-www-form-urlencoded"
    }

    if (cookie) {
        headers.cookie = cookie
    }

    return new Request(`http://localhost${path}`, {
        method: "POST",
        headers,
        body: new URLSearchParams(values)
    })
}

function getSessionCookie(response: CadastroResponse): string {
    if (response instanceof Response) {
        throw new Error("Cadastro deveria retornar pagina com cookie.")
    }

    const setCookie = new Headers(response.headers).get("set-cookie")
    assert(setCookie)
    assertStringIncludes(setCookie, `${SESSION_COOKIE_NAME}=`)

    return setCookie.split(";")[0]
}

function assertJsonResponse(response: unknown): asserts response is Response {
    assert(response instanceof Response)
    assertStringIncludes(response.headers.get("content-type") ?? "", "application/json")
}

class FixedIds implements IdGenerator {
    private index = 0

    newId(): string {
        this.index++
        return `00000000-0000-4000-8000-${this.index.toString().padStart(12, "0")}`
    }
}

class IncrementingClock implements Clock {
    private index = 0

    constructor(private readonly start: Date) {}

    now(): Date {
        const value = new Date(this.start.getTime() + this.index)
        this.index++

        return value
    }
}
