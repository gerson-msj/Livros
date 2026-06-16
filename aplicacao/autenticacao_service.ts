import {
    calculateSessionExpiration,
    type RegistrationInput,
    type Session,
    type User,
    UsernameAlreadyExistsError,
    validateRegistration
} from "../dominio/autenticacao.ts"

export interface UserRepository {
    findByUsername(username: string): Promise<User | null>
    create(input: CreateUserInput): Promise<User>
}

export interface SessionRepository {
    create(input: CreateSessionInput): Promise<Session>
    findActiveById(id: string, now: Date): Promise<Session | null>
    end(id: string, endedAt: Date): Promise<void>
}

export interface CreateUserInput {
    id: string
    username: string
    passwordHash: string
    resetKeyHash: string
    createdAt: Date
}

export interface CreateSessionInput {
    id: string
    userId: string
    expiresAt: Date
    createdAt: Date
}

export interface SecretHasher {
    hash(secret: string): Promise<string>
    verify(secret: string, hash: string): Promise<boolean>
}

export interface IdGenerator {
    newId(): string
}

export interface Clock {
    now(): Date
}

export interface RegisterUserResult {
    user: User
    session: Session
    resetKey: string
}

export class AuthenticationService {
    constructor(
        private readonly users: UserRepository,
        private readonly sessions: SessionRepository,
        private readonly hasher: SecretHasher,
        private readonly ids: IdGenerator,
        private readonly clock: Clock
    ) {}

    async registerUser(input: RegistrationInput): Promise<RegisterUserResult> {
        const registration = validateRegistration(input)
        const existingUser = await this.users.findByUsername(registration.username)

        if (existingUser !== null) {
            throw new UsernameAlreadyExistsError(registration.username)
        }

        const now = this.clock.now()
        const resetKey = crypto.randomUUID()
        const user = await this.users.create({
            id: this.ids.newId(),
            username: registration.username,
            passwordHash: await this.hasher.hash(registration.password),
            resetKeyHash: await this.hasher.hash(resetKey),
            createdAt: now
        })

        const session = await this.sessions.create({
            id: this.ids.newId(),
            userId: user.id,
            createdAt: now,
            expiresAt: calculateSessionExpiration(now)
        })

        return { user, session, resetKey }
    }

    findActiveSession(sessionId: string): Promise<Session | null> {
        return this.sessions.findActiveById(sessionId, this.clock.now())
    }

    async endSession(sessionId: string): Promise<void> {
        await this.sessions.end(sessionId, this.clock.now())
    }
}
