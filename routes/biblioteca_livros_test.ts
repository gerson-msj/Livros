import { assert, assertEquals } from "jsr:@std/assert@1"
import {
    AuthenticationService,
    type Clock,
    type CreateSessionInput,
    type CreateUserInput,
    type SessionRepository,
    type UpdateUserSecretsInput,
    type UserRepository
} from "../aplicacao/autenticacao_service.ts"
import type { StandaloneBook } from "../dominio/livros.ts"
import type { Session, User } from "../dominio/autenticacao.ts"
import { WebCryptoSecretHasher } from "../infraestrutura/crypto.ts"
import { SESSION_COOKIE_NAME } from "../infraestrutura/session_cookie.ts"
import { handler } from "./biblioteca/livros.tsx"

Deno.test("GET /biblioteca/livros redireciona visitante sem sessao para login", async () => {
    const request = new Request("http://localhost/biblioteca/livros")

    const response = await handler.GET!(createContext(request, createAuthenticationService(), new FakeBooksService()))

    assert(response instanceof Response)
    assertEquals(response.status, 303)
    assertEquals(response.headers.get("location"), "/login")
})

Deno.test("GET /biblioteca/livros lista livros avulsos do usuario autenticado", async () => {
    const authentication = createAuthenticationService()
    const books = new FakeBooksService()
    const firstUser = await authentication.registerUser({ username: "gerson", password: "senhaboa" })
    const secondUser = await authentication.registerUser({ username: "maria", password: "senhaboa" })
    books.items.set(firstUser.user.id, [
        createBook({ id: "mais-recente", userId: firstUser.user.id, title: "Mais recente", createdAt: new Date("2026-06-22T12:00:00Z") }),
        createBook({
            id: "mais-antigo",
            userId: firstUser.user.id,
            title: "Mais antigo",
            readingStartedOn: "2026-06-01",
            readingFinishedOn: "2026-06-10",
            createdAt: new Date("2026-06-20T12:00:00Z")
        })
    ])
    books.items.set(secondUser.user.id, [createBook({ id: "outro-usuario", userId: secondUser.user.id, title: "Outro usuario" })])

    const response = await handler.GET!(createContext(createRequestWithSession(firstUser.session.id), authentication, books))

    assert(!(response instanceof Response))
    assertEquals(response.data.books, [
        {
            id: "mais-recente",
            title: "Mais recente",
            author: "Autor Teste",
            readingStartedOn: null,
            readingFinishedOn: null
        },
        {
            id: "mais-antigo",
            title: "Mais antigo",
            author: "Autor Teste",
            readingStartedOn: "2026-06-01",
            readingFinishedOn: "2026-06-10"
        }
    ])
})

type LivrosContext = Parameters<NonNullable<typeof handler.GET>>[0]

function createContext(request: Request, authentication: AuthenticationService, books: FakeBooksService): LivrosContext {
    return {
        req: request,
        state: {
            services: {
                authentication,
                books
            }
        }
    } as unknown as LivrosContext
}

function createRequestWithSession(sessionId: string): Request {
    return new Request("http://localhost/biblioteca/livros", {
        headers: {
            cookie: `${SESSION_COOKIE_NAME}=${sessionId}`
        }
    })
}

function createAuthenticationService(): AuthenticationService {
    return new AuthenticationService(
        new InMemoryUserRepository(),
        new InMemorySessionRepository(),
        new WebCryptoSecretHasher(),
        new FixedIds(),
        new FixedClock(new Date("2026-06-22T12:00:00.000Z"))
    )
}

function createBook(input: {
    id: string
    userId: string
    title: string
    readingStartedOn?: string | null
    readingFinishedOn?: string | null
    createdAt?: Date
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
            createdAt: input.createdAt ?? new Date("2026-06-22T12:00:00.000Z")
        },
        readingStartedOn: input.readingStartedOn ?? null,
        readingFinishedOn: input.readingFinishedOn ?? null,
        createdAt: input.createdAt ?? new Date("2026-06-22T12:00:00.000Z")
    }
}

class FakeBooksService {
    readonly items = new Map<string, StandaloneBook[]>()

    listStandaloneBooks(userId: string): Promise<StandaloneBook[]> {
        return Promise.resolve(this.items.get(userId) ?? [])
    }
}

class InMemoryUserRepository implements UserRepository {
    readonly users = new Map<string, User>()

    findByUsername(username: string): Promise<User | null> {
        return Promise.resolve([...this.users.values()].find((user) => user.username === username) ?? null)
    }

    create(input: CreateUserInput): Promise<User> {
        const user = { ...input }
        this.users.set(user.id, user)
        return Promise.resolve(user)
    }

    updateSecrets(input: UpdateUserSecretsInput): Promise<User> {
        const user = this.users.get(input.id)

        if (!user) {
            throw new Error("Usuario nao encontrado.")
        }

        const updatedUser = {
            ...user,
            passwordHash: input.passwordHash,
            resetKeyHash: input.resetKeyHash
        }

        this.users.set(updatedUser.id, updatedUser)
        return Promise.resolve(updatedUser)
    }
}

class InMemorySessionRepository implements SessionRepository {
    readonly sessions = new Map<string, Session>()

    create(input: CreateSessionInput): Promise<Session> {
        const session = {
            ...input,
            endedAt: null
        }

        this.sessions.set(session.id, session)
        return Promise.resolve(session)
    }

    findActiveById(id: string, now: Date): Promise<Session | null> {
        const session = this.sessions.get(id)

        if (!session || session.endedAt !== null || session.expiresAt <= now) {
            return Promise.resolve(null)
        }

        return Promise.resolve(session)
    }

    end(id: string, _endedAt: Date): Promise<void> {
        this.sessions.delete(id)
        return Promise.resolve()
    }

    endActiveByUserId(userId: string, _endedAt: Date): Promise<void> {
        for (const session of this.sessions.values()) {
            if (session.userId === userId) {
                this.sessions.delete(session.id)
            }
        }

        return Promise.resolve()
    }
}

class FixedIds {
    private index = 0

    newId(): string {
        this.index++
        return `00000000-0000-4000-8000-${this.index.toString().padStart(12, "0")}`
    }
}

class FixedClock implements Clock {
    constructor(private readonly value: Date) {}

    now(): Date {
        return this.value
    }
}
