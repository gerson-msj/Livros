import type { Client, InValue, Row } from "@libsql/client"
import type {
    AuthorRepository,
    CreateAuthorInput,
    CreateStandaloneBookRecordInput,
    StandaloneBookRepository,
    UpdateStandaloneBookDatesRecordInput
} from "../aplicacao/livros_service.ts"
import type { Author, StandaloneBook } from "../dominio/livros.ts"
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

export class LibsqlStandaloneBookRepository implements StandaloneBookRepository {
    constructor(private readonly client: Client) {}

    async listByUser(userId: string): Promise<StandaloneBook[]> {
        await ensureDatabaseSchema(this.client)

        const result = await this.client.execute({
            sql: `
                SELECT ${bookColumns}
                FROM standalone_books books
                LEFT JOIN authors ON authors.id = books.author_id
                WHERE books.user_id = ?
                ORDER BY books.created_at DESC, books.id DESC
            `,
            args: [userId]
        })

        return result.rows.map(mapStandaloneBook)
    }

    async findByUserAndId(userId: string, bookId: string): Promise<StandaloneBook | null> {
        await ensureDatabaseSchema(this.client)

        const result = await this.client.execute({
            sql: `
                SELECT ${bookColumns}
                FROM standalone_books books
                LEFT JOIN authors ON authors.id = books.author_id
                WHERE books.user_id = ? AND books.id = ?
                LIMIT 1
            `,
            args: [userId, bookId]
        })

        return result.rows[0] ? mapStandaloneBook(result.rows[0]) : null
    }

    async findByUserTitleAndAuthor(userId: string, normalizedTitle: string, authorId: string): Promise<StandaloneBook | null> {
        await ensureDatabaseSchema(this.client)

        const result = await this.client.execute({
            sql: `
                SELECT ${bookColumns}
                FROM standalone_books books
                LEFT JOIN authors ON authors.id = books.author_id
                WHERE books.user_id = ? AND books.normalized_title = ? AND books.author_id = ?
                LIMIT 1
            `,
            args: [userId, normalizedTitle, authorId]
        })

        return result.rows[0] ? mapStandaloneBook(result.rows[0]) : null
    }

    async create(input: CreateStandaloneBookRecordInput): Promise<StandaloneBook> {
        await ensureDatabaseSchema(this.client)

        await this.client.execute({
            sql: `
                INSERT INTO standalone_books (
                    id,
                    user_id,
                    title,
                    normalized_title,
                    author_id,
                    reading_started_on,
                    reading_finished_on,
                    created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `,
            args: [
                input.id,
                input.userId,
                input.title,
                input.normalizedTitle,
                input.authorId,
                input.readingStartedOn,
                input.readingFinishedOn,
                input.createdAt.toISOString()
            ]
        })

        const book = await this.findByUserAndId(input.userId, input.id)

        if (book === null) {
            throw new Error("Livro avulso nao encontrado apos criacao.")
        }

        return book
    }

    async updateDates(input: UpdateStandaloneBookDatesRecordInput): Promise<StandaloneBook | null> {
        await ensureDatabaseSchema(this.client)

        const result = await this.client.execute({
            sql: `
                UPDATE standalone_books
                SET reading_started_on = ?, reading_finished_on = ?
                WHERE user_id = ? AND id = ?
                RETURNING id
            `,
            args: [
                input.readingStartedOn,
                input.readingFinishedOn,
                input.userId,
                input.bookId
            ]
        })

        if (!result.rows[0]) {
            return null
        }

        return await this.findByUserAndId(input.userId, input.bookId)
    }

    async deleteByUserAndId(userId: string, bookId: string): Promise<boolean> {
        await ensureDatabaseSchema(this.client)

        const result = await this.client.execute({
            sql: "DELETE FROM standalone_books WHERE user_id = ? AND id = ?",
            args: [userId, bookId]
        })

        return result.rowsAffected > 0
    }
}

const bookColumns = `
    books.id AS book_id,
    books.user_id AS book_user_id,
    books.title AS book_title,
    books.normalized_title AS book_normalized_title,
    books.reading_started_on,
    books.reading_finished_on,
    books.created_at AS book_created_at,
    authors.id AS author_id,
    authors.user_id AS author_user_id,
    authors.name AS author_name,
    authors.normalized_name AS author_normalized_name,
    authors.created_at AS author_created_at
`

function mapStandaloneBook(row: Row): StandaloneBook {
    return {
        id: asString(row.book_id),
        userId: asString(row.book_user_id),
        title: asString(row.book_title),
        normalizedTitle: asString(row.book_normalized_title),
        author: {
            id: asString(row.author_id),
            userId: asString(row.author_user_id),
            name: asString(row.author_name),
            normalizedName: asString(row.author_normalized_name),
            createdAt: new Date(asString(row.author_created_at))
        },
        readingStartedOn: asNullableString(row.reading_started_on),
        readingFinishedOn: asNullableString(row.reading_finished_on),
        createdAt: new Date(asString(row.book_created_at))
    }
}

function mapAuthor(row: Row): Author {
    return {
        id: asString(row.id),
        userId: asString(row.user_id),
        name: asString(row.name),
        normalizedName: asString(row.normalized_name),
        createdAt: new Date(asString(row.created_at))
    }
}

function asString(value: InValue | undefined): string {
    if (typeof value !== "string") {
        throw new Error("Valor inesperado retornado pelo banco.")
    }

    return value
}

function asNullableString(value: InValue | undefined): string | null {
    if (value === null) {
        return null
    }

    return asString(value)
}
