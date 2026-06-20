import { assert, assertEquals, assertStringIncludes } from "jsr:@std/assert@1"
import {
    AuthenticationService,
    type Clock,
    type CreateSessionInput,
    type CreateUserInput,
    type SessionRepository,
    type UpdateUserSecretsInput,
    type UserRepository
} from "../aplicacao/autenticacao_service.ts"
import type { Session, User } from "../dominio/autenticacao.ts"
import { WebCryptoSecretHasher } from "../infraestrutura/crypto.ts"
import { SESSION_COOKIE_NAME } from "../infraestrutura/session_cookie.ts"
import { handler } from "./login.tsx"

Deno.test("GET /login redireciona usuario com sessao ativa para biblioteca", async () => {
    const service = createAuthenticationService()
    const registration = await service.registerUser({ username: "gerson", password: "senhaboa" })
    const request = createRequestWithSession("GET", registration.session.id)

    const response = await handler.GET!(createContext(request, service))

    assert(response instanceof Response)
    assertEquals(response.status, 303)
    assertEquals(response.headers.get("location"), "/biblioteca")
})

Deno.test("POST /login com credenciais validas cria sessao e redireciona para biblioteca", async () => {
    const service = createAuthenticationService()
    await service.registerUser({ username: "gerson", password: "senhaboa" })
    const request = createPostRequest({ username: " GERSON ", password: " senhaboa " })

    const response = await handler.POST!(createContext(request, service))

    assert(response instanceof Response)
    assertEquals(response.status, 303)
    assertEquals(response.headers.get("location"), "/biblioteca")

    const setCookie = response.headers.get("set-cookie")
    assert(setCookie)
    assertStringIncludes(setCookie, `${SESSION_COOKIE_NAME}=00000000-0000-4000-8000-000000000003`)
    assertStringIncludes(setCookie, "HttpOnly")
})

Deno.test("POST /login com credenciais invalidas retorna mensagem generica", async () => {
    const service = createAuthenticationService()
    await service.registerUser({ username: "gerson", password: "senhaboa" })
    const request = createPostRequest({ username: "gerson", password: "senha-ruim" })

    const response = await handler.POST!(createContext(request, service))

    assertPageResponse(response)
    assertEquals(response.data.username, "gerson")
    assertEquals(response.data.password, "senha-ruim")
    assertEquals(response.data.error, "Nao foi possivel entrar. Confira nome de usuario e senha.")
})

type LoginContext = Parameters<NonNullable<typeof handler.GET>>[0]
type LoginResponse = Awaited<ReturnType<NonNullable<typeof handler.POST>>>
type LoginPageResponse = Exclude<LoginResponse, Response>

function createContext(request: Request, authentication: AuthenticationService): LoginContext {
    return {
        req: request,
        state: {
            services: {
                authentication
            }
        }
    } as LoginContext
}

function createPostRequest(input: { username: string; password: string }): Request {
    return new Request("http://localhost/login", {
        method: "POST",
        headers: {
            "content-type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams(input)
    })
}

function createRequestWithSession(method: "GET" | "POST", sessionId: string): Request {
    return new Request("http://localhost/login", {
        method,
        headers: {
            cookie: `${SESSION_COOKIE_NAME}=${sessionId}`
        }
    })
}

function assertPageResponse(response: LoginResponse): asserts response is LoginPageResponse {
    assert(!(response instanceof Response))
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
