import type { Client, InValue, Row } from "@libsql/client"
import type { AuthorRepository, CreateAuthorInput } from "../aplicacao/autores_service.ts"
import type { Author } from "../dominio/autores.ts"
import { ensureDatabaseSchema } from "./database.ts"

export class LibsqlAuthorRepository implements AuthorRepository {
    constructor(private readonly client: Client) {}

    async listByUser(userId: string): Promise<Author[]> {
        await ensureDatabaseSchema(this.client)

        const result = await this.client.execute({
            sql: `
                SELECT id, user_id, name, normalized_name, created_at
                FROM authors
                WHERE user_id = ?
                ORDER BY name COLLATE NOCASE
            `,
            args: [userId]
        })

        return result.rows.map(mapAuthor)
    }

    async findByUserAndNormalizedName(userId: string, normalizedName: string): Promise<Author | null> {
        await ensureDatabaseSchema(this.client)

        const result = await this.client.execute({
            sql: `
                SELECT id, user_id, name, normalized_name, created_at
                FROM authors
                WHERE user_id = ? AND normalized_name = ?
                LIMIT 1
            `,
            args: [userId, normalizedName]
        })

        return result.rows[0] ? mapAuthor(result.rows[0]) : null
    }

    async create(input: CreateAuthorInput): Promise<Author> {
        await ensureDatabaseSchema(this.client)

        await this.client.execute({
            sql: "INSERT INTO authors (id, user_id, name, normalized_name, created_at) VALUES (?, ?, ?, ?, ?)",
            args: [
                input.id,
                input.userId,
                input.name,
                input.normalizedName,
                input.createdAt.toISOString()
            ]
        })

        return {
            id: input.id,
            userId: input.userId,
            name: input.name,
            normalizedName: input.normalizedName,
            createdAt: input.createdAt
        }
    }
}

export function mapAuthor(row: Row): Author {
    return {
        id: asString(row.id),
        userId: asString(row.user_id),
        name: asString(row.name),
        normalizedName: asString(row.normalized_name),
        createdAt: new Date(asString(row.created_at))
    }
}

export function asString(value: InValue | undefined): string {
    if (typeof value !== "string") {
        throw new Error("Valor inesperado retornado pelo banco.")
    }

    return value
}

export function asNullableString(value: InValue | undefined): string | null {
    if (value === null) {
        return null
    }

    return asString(value)
}
