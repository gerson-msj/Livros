import { assert, assertEquals, assertStringIncludes } from "jsr:@std/assert@1"
import {
    AuthenticationService,
    type Clock,
    type CreateSessionInput,
    type CreateUserInput,
    type SessionRepository,
    type UserRepository
} from "../aplicacao/autenticacao_service.ts"
import type { Session, User } from "../dominio/autenticacao.ts"
import { WebCryptoSecretHasher } from "../infraestrutura/crypto.ts"
import { SESSION_COOKIE_NAME } from "../infraestrutura/session_cookie.ts"
import { handler } from "./biblioteca.tsx"

Deno.test("GET /biblioteca redireciona visitante sem sessao para cadastro", async () => {
    const request = new Request("http://localhost/biblioteca")

    const response = await handler.GET!(createContext(request, createAuthenticationService()))

    assert(response instanceof Response)
    assertEquals(response.status, 303)
    assertEquals(response.headers.get("location"), "/cadastro")
})

Deno.test("GET /biblioteca renderiza biblioteca minima para sessao ativa", async () => {
    const service = createAuthenticationService()
    const registration = await service.registerUser({ username: "gerson", password: "senhaboa" })
    const request = createRequestWithSession("GET", registration.session.id)

    const response = await handler.GET!(createContext(request, service))

    assert(!(response instanceof Response))
    assertEquals(response.data, {})
})

Deno.test("POST /biblioteca encerra sessao, limpa cookie e redireciona para cadastro", async () => {
    const service = createAuthenticationService()
    const registration = await service.registerUser({ username: "gerson", password: "senhaboa" })
    const request = createRequestWithSession("POST", registration.session.id)

    const response = await handler.POST!(createContext(request, service))

    assert(response instanceof Response)
    assertEquals(response.status, 303)
    assertEquals(response.headers.get("location"), "/cadastro")

    const setCookie = response.headers.get("set-cookie")
    assert(setCookie)
    assertStringIncludes(setCookie, `${SESSION_COOKIE_NAME}=`)
    assertStringIncludes(setCookie, "Max-Age=0")

    const secondRequest = createRequestWithSession("GET", registration.session.id)
    const secondResponse = await handler.GET!(createContext(secondRequest, service))

    assert(secondResponse instanceof Response)
    assertEquals(secondResponse.status, 303)
    assertEquals(secondResponse.headers.get("location"), "/cadastro")
})

type BibliotecaContext = Parameters<NonNullable<typeof handler.GET>>[0]

function createContext(request: Request, authentication: AuthenticationService): BibliotecaContext {
    return {
        req: request,
        state: {
            services: {
                authentication
            }
        }
    } as BibliotecaContext
}

function createRequestWithSession(method: "GET" | "POST", sessionId: string): Request {
    return new Request("http://localhost/biblioteca", {
        method,
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
        new FixedClock(new Date("2026-06-16T12:00:00.000Z"))
    )
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

    end(id: string, endedAt: Date): Promise<void> {
        const session = this.sessions.get(id)

        if (session) {
            this.sessions.set(id, { ...session, endedAt })
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
