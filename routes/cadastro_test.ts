import { assert, assertEquals, assertMatch, assertStringIncludes } from "jsr:@std/assert@1"
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
import { handler } from "./cadastro.tsx"

Deno.test("GET /cadastro redireciona usuario com sessao ativa para biblioteca", async () => {
    const service = createAuthenticationService()
    const registration = await service.registerUser({ username: "gerson", password: "senhaboa" })
    const request = new Request("http://localhost/cadastro", {
        headers: {
            cookie: `${SESSION_COOKIE_NAME}=${registration.session.id}`
        }
    })

    const response = await handler.GET!(createContext(request, service))

    assert(response instanceof Response)
    assertEquals(response.status, 303)
    assertEquals(response.headers.get("location"), "/biblioteca")
})

Deno.test("POST /cadastro retorna campos invalidos com mensagens do dominio", async () => {
    const request = createPostRequest({ username: " abc ", password: " 1234 " })

    const response = await handler.POST!(createContext(request, createAuthenticationService()))

    assertPageResponse(response)
    assertEquals(response.data.username, "abc")
    assertEquals(response.data.password, " 1234 ")
    assertEquals(response.data.errors.username, "O nome de usuario deve conter no minimo 5 caracteres.")
    assertEquals(response.data.errors.password, "A senha deve conter no minimo 5 caracteres.")
})

Deno.test("POST /cadastro cria usuario, sessao, cookie HTTP e apresenta chave", async () => {
    const service = createAuthenticationService()
    const request = createPostRequest({ username: "  Gerson  ", password: " senhaboa " })

    const response = await handler.POST!(createContext(request, service))

    assertPageResponse(response)
    assertEquals(response.data.username, "gerson")
    assertEquals(response.data.password, "")
    assertMatch(response.data.resetKey ?? "", /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/)

    const setCookie = new Headers(response.headers).get("set-cookie")
    assert(setCookie)
    assertStringIncludes(setCookie, `${SESSION_COOKIE_NAME}=00000000-0000-4000-8000-000000000002`)
    assertStringIncludes(setCookie, "HttpOnly")
    assertStringIncludes(setCookie, "SameSite=Lax")

    const session = await service.findActiveSession("00000000-0000-4000-8000-000000000002")
    assert(session)
    assertEquals(session.userId, "00000000-0000-4000-8000-000000000001")
})

type CadastroContext = Parameters<NonNullable<typeof handler.GET>>[0]
type CadastroResponse = Awaited<ReturnType<NonNullable<typeof handler.POST>>>
type CadastroPageResponse = Exclude<CadastroResponse, Response>

function createContext(request: Request, authentication: AuthenticationService): CadastroContext {
    return {
        req: request,
        state: {
            services: {
                authentication
            }
        }
    } as CadastroContext
}

function createPostRequest(input: { username: string; password: string }): Request {
    return new Request("http://localhost/cadastro", {
        method: "POST",
        headers: {
            "content-type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams(input)
    })
}

function assertPageResponse(response: CadastroResponse): asserts response is CadastroPageResponse {
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
