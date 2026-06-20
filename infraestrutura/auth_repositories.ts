import type { Client, InValue, Row } from "@libsql/client"
import type {
    CreateSessionInput,
    CreateUserInput,
    SessionRepository,
    UpdateUserSecretsInput,
    UserRepository
} from "../aplicacao/autenticacao_service.ts"
import type { Session, User } from "../dominio/autenticacao.ts"
import { ensureDatabaseSchema } from "./database.ts"

export class LibsqlUserRepository implements UserRepository {
    constructor(private readonly client: Client) {}

    async findByUsername(username: string): Promise<User | null> {
        await ensureDatabaseSchema(this.client)

        const result = await this.client.execute({
            sql: "SELECT id, username, password_hash, reset_key_hash, created_at FROM users WHERE username = ? LIMIT 1",
            args: [username]
        })

        return result.rows[0] ? mapUser(result.rows[0]) : null
    }

    async create(input: CreateUserInput): Promise<User> {
        await ensureDatabaseSchema(this.client)

        await this.client.execute({
            sql: "INSERT INTO users (id, username, password_hash, reset_key_hash, created_at) VALUES (?, ?, ?, ?, ?)",
            args: [
                input.id,
                input.username,
                input.passwordHash,
                input.resetKeyHash,
                input.createdAt.toISOString()
            ]
        })

        return {
            id: input.id,
            username: input.username,
            passwordHash: input.passwordHash,
            resetKeyHash: input.resetKeyHash,
            createdAt: input.createdAt
        }
    }

    async updateSecrets(input: UpdateUserSecretsInput): Promise<User> {
        await ensureDatabaseSchema(this.client)

        const result = await this.client.execute({
            sql: `
                UPDATE users
                SET password_hash = ?, reset_key_hash = ?
                WHERE id = ?
                RETURNING id, username, password_hash, reset_key_hash, created_at
            `,
            args: [
                input.passwordHash,
                input.resetKeyHash,
                input.id
            ]
        })

        if (!result.rows[0]) {
            throw new Error("Usuario nao encontrado para atualizar segredos.")
        }

        return mapUser(result.rows[0])
    }
}

export class LibsqlSessionRepository implements SessionRepository {
    constructor(private readonly client: Client) {}

    async create(input: CreateSessionInput): Promise<Session> {
        await ensureDatabaseSchema(this.client)

        await this.client.execute({
            sql: "INSERT INTO sessions (id, user_id, expires_at, created_at, ended_at) VALUES (?, ?, ?, ?, NULL)",
            args: [
                input.id,
                input.userId,
                input.expiresAt.toISOString(),
                input.createdAt.toISOString()
            ]
        })

        return {
            id: input.id,
            userId: input.userId,
            expiresAt: input.expiresAt,
            createdAt: input.createdAt,
            endedAt: null
        }
    }

    async findActiveById(id: string, now: Date): Promise<Session | null> {
        await ensureDatabaseSchema(this.client)

        const result = await this.client.execute({
            sql: `
                SELECT id, user_id, expires_at, created_at, ended_at
                FROM sessions
                WHERE id = ?
                  AND ended_at IS NULL
                  AND expires_at > ?
                LIMIT 1
            `,
            args: [id, now.toISOString()]
        })

        return result.rows[0] ? mapSession(result.rows[0]) : null
    }

    async end(id: string, _endedAt: Date): Promise<void> {
        await ensureDatabaseSchema(this.client)

        await this.client.execute({
            sql: "DELETE FROM sessions WHERE id = ?",
            args: [id]
        })
    }

    async endActiveByUserId(userId: string, _endedAt: Date): Promise<void> {
        await ensureDatabaseSchema(this.client)

        await this.client.execute({
            sql: "DELETE FROM sessions WHERE user_id = ?",
            args: [userId]
        })
    }
}

function mapUser(row: Row): User {
    return {
        id: asString(row.id),
        username: asString(row.username),
        passwordHash: asString(row.password_hash),
        resetKeyHash: asString(row.reset_key_hash),
        createdAt: new Date(asString(row.created_at))
    }
}

function mapSession(row: Row): Session {
    return {
        id: asString(row.id),
        userId: asString(row.user_id),
        expiresAt: new Date(asString(row.expires_at)),
        createdAt: new Date(asString(row.created_at)),
        endedAt: row.ended_at === null ? null : new Date(asString(row.ended_at))
    }
}

function asString(value: InValue | undefined): string {
    if (typeof value !== "string") {
        throw new Error("Valor inesperado retornado pelo banco.")
    }

    return value
}
