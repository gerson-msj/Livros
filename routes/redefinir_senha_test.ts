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
import { InvalidPasswordResetError, type Session, type User } from "../dominio/autenticacao.ts"
import { WebCryptoSecretHasher } from "../infraestrutura/crypto.ts"
import { SESSION_COOKIE_NAME } from "../infraestrutura/session_cookie.ts"
import { handler } from "./redefinir-senha.tsx"

Deno.test("GET /redefinir-senha redireciona usuario com sessao ativa para biblioteca", async () => {
    const service = createAuthenticationService()
    const registration = await service.registerUser({ username: "gerson", password: "senhaboa" })
    const request = createRequestWithSession("GET", registration.session.id)

    const response = await handler.GET!(createContext(request, service))

    assert(response instanceof Response)
    assertEquals(response.status, 303)
    assertEquals(response.headers.get("location"), "/biblioteca")
})

Deno.test("POST /redefinir-senha invalido retorna mensagem generica", async () => {
    const service = createAuthenticationService()
    await service.registerUser({ username: "gerson", password: "senhaboa" })
    const request = createPostRequest({ username: "gerson", resetKey: "chave-errada", newPassword: "nova-senha" })

    const response = await handler.POST!(createContext(request, service))

    assertPageResponse(response)
    assertEquals(response.data.username, "gerson")
    assertEquals(response.data.resetKey, "chave-errada")
    assertEquals(response.data.newPassword, "nova-senha")
    assertEquals(response.data.error, "Nao foi possivel redefinir a senha. Confira os dados e tente novamente.")
})

Deno.test("POST /redefinir-senha valido cria sessao, apresenta nova chave e invalida chave antiga", async () => {
    const service = createAuthenticationService()
    const registration = await service.registerUser({ username: "gerson", password: "senhaboa" })
    const request = createPostRequest({
        username: " GERSON ",
        resetKey: ` ${registration.resetKey} `,
        newPassword: " nova-senha "
    })

    const response = await handler.POST!(createContext(request, service))

    assertPageResponse(response)
    assertEquals(response.data.username, "gerson")
    assertEquals(response.data.resetKey, "")
    assertEquals(response.data.newPassword, "")
    assertMatch(response.data.newResetKey ?? "", /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/)

    const setCookie = new Headers(response.headers).get("set-cookie")
    assert(setCookie)
    assertStringIncludes(setCookie, `${SESSION_COOKIE_NAME}=00000000-0000-4000-8000-000000000003`)

    await assertRejectsInvalidReset(service, {
        username: "gerson",
        resetKey: registration.resetKey,
        newPassword: "outra-senha"
    })
    await service.authenticateUser({ username: "gerson", password: "nova-senha" })
})

type ResetPasswordContext = Parameters<NonNullable<typeof handler.GET>>[0]
type ResetPasswordResponse = Awaited<ReturnType<NonNullable<typeof handler.POST>>>
type ResetPasswordPageResponse = Exclude<ResetPasswordResponse, Response>

function createContext(request: Request, authentication: AuthenticationService): ResetPasswordContext {
    return {
        req: request,
        state: {
            services: {
                authentication
            }
        }
    } as ResetPasswordContext
}

function createPostRequest(input: { username: string; resetKey: string; newPassword: string }): Request {
    return new Request("http://localhost/redefinir-senha", {
        method: "POST",
        headers: {
            "content-type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams(input)
    })
}

function createRequestWithSession(method: "GET" | "POST", sessionId: string): Request {
    return new Request("http://localhost/redefinir-senha", {
        method,
        headers: {
            cookie: `${SESSION_COOKIE_NAME}=${sessionId}`
        }
    })
}

function assertPageResponse(response: ResetPasswordResponse): asserts response is ResetPasswordPageResponse {
    assert(!(response instanceof Response))
}

async function assertRejectsInvalidReset(
    service: AuthenticationService,
    input: { username: string; resetKey: string; newPassword: string }
): Promise<void> {
    try {
        await service.resetPassword(input)
    } catch (error) {
        assert(error instanceof InvalidPasswordResetError)
        return
    }

    throw new Error("A redefinicao deveria falhar.")
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

    end(id: string, _endedAt: Date): Promise<void> {
        const session = this.sessions.get(id)

        if (session) {
            this.sessions.delete(id)
        }

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
