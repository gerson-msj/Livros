import { assert, assertEquals, assertNotEquals, assertRejects } from "jsr:@std/assert@1"
import {
    AuthenticationService,
    type Clock,
    type CreateSessionInput,
    type CreateUserInput,
    type SessionRepository,
    type UpdateUserSecretsInput,
    type UserRepository
} from "./autenticacao_service.ts"
import {
    InvalidCredentialsError,
    InvalidPasswordResetError,
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

Deno.test("autentica usuario cadastrado com nome normalizado e senha", async () => {
    const service = new AuthenticationService(
        new InMemoryUserRepository(),
        new InMemorySessionRepository(),
        new WebCryptoSecretHasher(),
        new FixedIds(),
        new FixedClock(new Date("2026-06-16T12:00:00.000Z"))
    )
    await service.registerUser({ username: "gerson", password: "senhaboa" })

    const result = await service.authenticateUser({ username: " GERSON ", password: " senhaboa " })

    assertEquals(result.user.username, "gerson")
    assertEquals(result.session.userId, result.user.id)
})

Deno.test("recusa login com usuario inexistente ou senha incorreta", async () => {
    const service = new AuthenticationService(
        new InMemoryUserRepository(),
        new InMemorySessionRepository(),
        new WebCryptoSecretHasher(),
        new FixedIds(),
        new FixedClock(new Date("2026-06-16T12:00:00.000Z"))
    )
    await service.registerUser({ username: "gerson", password: "senhaboa" })

    await assertRejects(
        () => service.authenticateUser({ username: "gerson", password: "senha-ruim" }),
        InvalidCredentialsError
    )
    await assertRejects(
        () => service.authenticateUser({ username: "maria", password: "senhaboa" }),
        InvalidCredentialsError
    )
})

Deno.test("redefine senha com chave atual, invalida chave antiga, gera nova chave e cria sessao", async () => {
    const users = new InMemoryUserRepository()
    const service = new AuthenticationService(
        users,
        new InMemorySessionRepository(),
        new WebCryptoSecretHasher(),
        new FixedIds(),
        new FixedClock(new Date("2026-06-16T12:00:00.000Z"))
    )
    const registered = await service.registerUser({ username: "gerson", password: "senhaboa" })

    const result = await service.resetPassword({
        username: " GERSON ",
        resetKey: ` ${registered.resetKey} `,
        newPassword: " nova-senha "
    })

    assertEquals(result.user.id, registered.user.id)
    assertEquals(result.session.userId, registered.user.id)
    assertNotEquals(result.resetKey, registered.resetKey)
    assert(await new WebCryptoSecretHasher().verify("nova-senha", users.users.get(registered.user.id)!.passwordHash))
    assert(await new WebCryptoSecretHasher().verify(result.resetKey, users.users.get(registered.user.id)!.resetKeyHash))
    assertEquals(await service.authenticateUser({ username: "gerson", password: "nova-senha" }).then(() => true), true)
    await assertRejects(
        () => service.resetPassword({ username: "gerson", resetKey: registered.resetKey, newPassword: "outra-senha" }),
        InvalidPasswordResetError
    )
})

Deno.test("redefinicao invalida nao altera senha nem chave", async () => {
    const users = new InMemoryUserRepository()
    const service = new AuthenticationService(
        users,
        new InMemorySessionRepository(),
        new WebCryptoSecretHasher(),
        new FixedIds(),
        new FixedClock(new Date("2026-06-16T12:00:00.000Z"))
    )
    const registered = await service.registerUser({ username: "gerson", password: "senhaboa" })
    const before = users.users.get(registered.user.id)!

    await assertRejects(
        () => service.resetPassword({ username: "gerson", resetKey: "chave-errada", newPassword: "nova-senha" }),
        InvalidPasswordResetError
    )

    const after = users.users.get(registered.user.id)!
    assertEquals(after.passwordHash, before.passwordHash)
    assertEquals(after.resetKeyHash, before.resetKeyHash)
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

Deno.test("nova sessao do mesmo usuario remove sessao anterior", async () => {
    const sessions = new InMemorySessionRepository()
    const service = new AuthenticationService(
        new InMemoryUserRepository(),
        sessions,
        new WebCryptoSecretHasher(),
        new FixedIds(),
        new FixedClock(new Date("2026-06-16T12:00:00.000Z"))
    )

    const registered = await service.registerUser({ username: "gerson", password: "senhaboa" })
    const authenticated = await service.authenticateUser({ username: "gerson", password: "senhaboa" })

    assertEquals(await service.findActiveSession(registered.session.id), null)
    assertEquals(await service.findActiveSession(authenticated.session.id), authenticated.session)
    assertEquals(sessions.sessions.has(registered.session.id), false)
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
