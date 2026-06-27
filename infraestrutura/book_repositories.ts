import type { Client, Row } from "@libsql/client"
import type {
    CreateStandaloneBookRecordInput,
    StandaloneBookRepository,
    UpdateStandaloneBookDatesRecordInput
} from "../aplicacao/livros_service.ts"
import type { StandaloneBook } from "../dominio/livros.ts"
import { asNullableString, asString } from "./author_repositories.ts"
import { ensureDatabaseSchema } from "./database.ts"

export class LibsqlStandaloneBookRepository implements StandaloneBookRepository {
    constructor(private readonly client: Client) {}

    async listByUser(userId: string): Promise<StandaloneBook[]> {
        await ensureDatabaseSchema(this.client)

        const result = await this.client.execute({
            sql: `
                SELECT ${bookColumns}
                FROM books
                LEFT JOIN authors ON authors.id = books.author_id
                WHERE books.user_id = ?
                  AND books.author_id IS NOT NULL
                  AND books.series_id IS NULL
                  AND books.series_order IS NULL
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
                FROM books
                LEFT JOIN authors ON authors.id = books.author_id
                WHERE books.user_id = ? AND books.id = ?
                  AND books.author_id IS NOT NULL
                  AND books.series_id IS NULL
                  AND books.series_order IS NULL
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
                FROM books
                LEFT JOIN authors ON authors.id = books.author_id
                WHERE books.user_id = ? AND books.normalized_title = ? AND books.author_id = ?
                  AND books.series_id IS NULL
                  AND books.series_order IS NULL
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
                INSERT INTO books (
                    id,
                    user_id,
                    title,
                    normalized_title,
                    author_id,
                    series_id,
                    series_order,
                    reading_started_on,
                    reading_finished_on,
                    created_at
                ) VALUES (?, ?, ?, ?, ?, NULL, NULL, ?, ?, ?)
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
                UPDATE books
                SET reading_started_on = ?, reading_finished_on = ?
                WHERE user_id = ? AND id = ?
                  AND author_id IS NOT NULL
                  AND series_id IS NULL
                  AND series_order IS NULL
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
            sql: `
                DELETE FROM books
                WHERE user_id = ? AND id = ?
                  AND author_id IS NOT NULL
                  AND series_id IS NULL
                  AND series_order IS NULL
            `,
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
