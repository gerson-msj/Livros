import {
    calculateSessionExpiration,
    InvalidCredentialsError,
    InvalidPasswordResetError,
    type LoginInput,
    normalizeLogin,
    type PasswordResetInput,
    type RegistrationInput,
    type Session,
    type User,
    UsernameAlreadyExistsError,
    validatePasswordReset,
    validateRegistration
} from "../dominio/autenticacao.ts"

export interface UserRepository {
    findByUsername(username: string): Promise<User | null>
    create(input: CreateUserInput): Promise<User>
    updateSecrets(input: UpdateUserSecretsInput): Promise<User>
}

export interface SessionRepository {
    create(input: CreateSessionInput): Promise<Session>
    findActiveById(id: string, now: Date): Promise<Session | null>
    end(id: string, endedAt: Date): Promise<void>
    endActiveByUserId(userId: string, endedAt: Date): Promise<void>
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

export interface UpdateUserSecretsInput {
    id: string
    passwordHash: string
    resetKeyHash: string
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

export interface AuthenticatedUserResult {
    user: User
    session: Session
}

export interface ResetPasswordResult extends AuthenticatedUserResult {
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

        return {
            user,
            session: await this.createSession(user.id),
            resetKey
        }
    }

    async authenticateUser(input: LoginInput): Promise<AuthenticatedUserResult> {
        const login = normalizeLogin(input)
        const user = await this.users.findByUsername(login.username)

        if (user === null || !await this.hasher.verify(login.password, user.passwordHash)) {
            throw new InvalidCredentialsError()
        }

        return {
            user,
            session: await this.createSession(user.id)
        }
    }

    async resetPassword(input: PasswordResetInput): Promise<ResetPasswordResult> {
        const passwordReset = validatePasswordReset(input)
        const user = await this.users.findByUsername(passwordReset.username)

        if (user === null || !await this.hasher.verify(passwordReset.resetKey, user.resetKeyHash)) {
            throw new InvalidPasswordResetError()
        }

        const resetKey = crypto.randomUUID()
        const updatedUser = await this.users.updateSecrets({
            id: user.id,
            passwordHash: await this.hasher.hash(passwordReset.newPassword),
            resetKeyHash: await this.hasher.hash(resetKey)
        })

        return {
            user: updatedUser,
            session: await this.createSession(updatedUser.id),
            resetKey
        }
    }

    findActiveSession(sessionId: string): Promise<Session | null> {
        return this.sessions.findActiveById(sessionId, this.clock.now())
    }

    async endSession(sessionId: string): Promise<void> {
        await this.sessions.end(sessionId, this.clock.now())
    }

    private async createSession(userId: string): Promise<Session> {
        const now = this.clock.now()

        await this.sessions.endActiveByUserId(userId, now)

        return await this.sessions.create({
            id: this.ids.newId(),
            userId,
            createdAt: now,
            expiresAt: calculateSessionExpiration(now)
        })
    }
}
