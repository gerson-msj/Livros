import { assert, assertEquals, assertNotEquals, assertRejects } from "jsr:@std/assert@1"
import {
    AuthenticationService,
    type Clock,
    type CreateSessionInput,
    type CreateUserInput,
    type SessionRepository,
    type UserRepository
} from "./autenticacao_service.ts"
import {
    RegistrationValidationError,
    type Session,
    SESSION_DURATION_MS,
    type User,
    UsernameAlreadyExistsError
} from "../dominio/autenticacao.ts"
import { WebCryptoSecretHasher } from "../infraestrutura/crypto.ts"

Deno.test("cadastra usuario normalizado, protege segredos e cria sessao de uma semana", async () => {
    const users = new InMemoryUserRepository()
    const sessions = new InMemorySessionRepository()
    const now = new Date("2026-06-16T12:00:00.000Z")
    const service = new AuthenticationService(users, sessions, new WebCryptoSecretHasher(), new FixedIds(), new FixedClock(now))

    const result = await service.registerUser({
        username: "  Gerson  ",
        password: "  senha-secreta  "
    })

    assertEquals(result.user.username, "gerson")
    assertEquals(result.session.userId, result.user.id)
    assertEquals(result.session.expiresAt.toISOString(), new Date(now.getTime() + SESSION_DURATION_MS).toISOString())
    assert(result.resetKey.match(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/))
    assertNotEquals(result.user.passwordHash, "senha-secreta")
    assertNotEquals(result.user.resetKeyHash, result.resetKey)
    assert(await new WebCryptoSecretHasher().verify("senha-secreta", result.user.passwordHash))
    assert(await new WebCryptoSecretHasher().verify(result.resetKey, result.user.resetKeyHash))
})

Deno.test("recusa nome de usuario e senha com menos de 5 caracteres apos trim", async () => {
    const service = new AuthenticationService(
        new InMemoryUserRepository(),
        new InMemorySessionRepository(),
        new WebCryptoSecretHasher(),
        new FixedIds(),
        new FixedClock(new Date())
    )

    const error = await assertRejects(
        () => service.registerUser({ username: " abcd ", password: " 1234 " }),
        RegistrationValidationError
    )

    assertEquals(error.issues.map((issue) => issue.field), ["username", "password"])
})

Deno.test("recusa nome de usuario ja cadastrado", async () => {
    const service = new AuthenticationService(
        new InMemoryUserRepository(),
        new InMemorySessionRepository(),
        new WebCryptoSecretHasher(),
        new FixedIds(),
        new FixedClock(new Date("2026-06-16T12:00:00.000Z"))
    )

    await service.registerUser({ username: "gerson", password: "senhaboa" })
    await assertRejects(
        () => service.registerUser({ username: " GERSON ", password: "outrasenha" }),
        UsernameAlreadyExistsError
    )
})

Deno.test("encerra sessao e impede consulta ativa posterior", async () => {
    const sessions = new InMemorySessionRepository()
    const service = new AuthenticationService(
        new InMemoryUserRepository(),
        sessions,
        new WebCryptoSecretHasher(),
        new FixedIds(),
        new FixedClock(new Date("2026-06-16T12:00:00.000Z"))
    )

    const result = await service.registerUser({ username: "gerson", password: "senhaboa" })

    assertEquals(await service.findActiveSession(result.session.id), result.session)

    await service.endSession(result.session.id)

    assertEquals(await service.findActiveSession(result.session.id), null)
})

class InMemoryUserRepository implements UserRepository {
    readonly users = new Map<string, User>()

    findByUsername(username: string): Promise<User | null> {
        return Promise.resolve([...this.users.values()].find((user) => user.username === username) ?? null)
    }

    create(input: CreateUserInput): Promise<User> {
        const user = {
            ...input
        }

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
