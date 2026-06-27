import type { Client, Row } from "@libsql/client"
import type { BookSeriesRepository, CreateBookSeriesRecordInput, UpdateBookSeriesDatesRecordInput } from "../aplicacao/series_service.ts"
import type { BookInSeries, BookSeries } from "../dominio/series.ts"
import { asNullableString, asString } from "./author_repositories.ts"
import { ensureDatabaseSchema } from "./database.ts"

export class LibsqlBookSeriesRepository implements BookSeriesRepository {
    constructor(private readonly client: Client) {}

    async listByUser(userId: string): Promise<BookSeries[]> {
        await ensureDatabaseSchema(this.client)

        const result = await this.client.execute({
            sql: `
                SELECT ${seriesColumns}
                FROM series
                INNER JOIN authors ON authors.id = series.author_id
                INNER JOIN books ON books.series_id = series.id
                WHERE series.user_id = ?
                  AND books.user_id = series.user_id
                  AND books.author_id IS NULL
                  AND books.series_order IS NOT NULL
                ORDER BY series.created_at DESC, series.id DESC, books.series_order ASC
            `,
            args: [userId]
        })

        return mapBookSeriesRows(result.rows)
    }

    async findByUserAndId(userId: string, seriesId: string): Promise<BookSeries | null> {
        await ensureDatabaseSchema(this.client)

        const result = await this.client.execute({
            sql: `
                SELECT ${seriesColumns}
                FROM series
                INNER JOIN authors ON authors.id = series.author_id
                INNER JOIN books ON books.series_id = series.id
                WHERE series.user_id = ? AND series.id = ?
                  AND books.user_id = series.user_id
                  AND books.author_id IS NULL
                  AND books.series_order IS NOT NULL
                ORDER BY books.series_order ASC
            `,
            args: [userId, seriesId]
        })

        return mapBookSeriesRows(result.rows)[0] ?? null
    }

    async findByUserNameAndAuthor(userId: string, normalizedName: string, authorId: string): Promise<BookSeries | null> {
        await ensureDatabaseSchema(this.client)

        const result = await this.client.execute({
            sql: `
                SELECT ${seriesColumns}
                FROM series
                INNER JOIN authors ON authors.id = series.author_id
                LEFT JOIN books ON books.series_id = series.id
                WHERE series.user_id = ? AND series.normalized_name = ? AND series.author_id = ?
                ORDER BY books.series_order ASC
            `,
            args: [userId, normalizedName, authorId]
        })

        return mapBookSeriesRows(result.rows)[0] ?? null
    }

    async create(input: CreateBookSeriesRecordInput): Promise<BookSeries> {
        await ensureDatabaseSchema(this.client)

        await this.client.batch([
            {
                sql: "INSERT INTO series (id, user_id, name, normalized_name, author_id, created_at) VALUES (?, ?, ?, ?, ?, ?)",
                args: [
                    input.id,
                    input.userId,
                    input.name,
                    input.normalizedName,
                    input.authorId,
                    input.createdAt.toISOString()
                ]
            },
            ...input.books.map((book) => ({
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
                    ) VALUES (?, ?, ?, ?, NULL, ?, ?, ?, ?, ?)
                `,
                args: [
                    book.id,
                    input.userId,
                    book.title,
                    book.normalizedTitle,
                    input.id,
                    book.seriesOrder,
                    book.readingStartedOn,
                    book.readingFinishedOn,
                    book.createdAt.toISOString()
                ]
            }))
        ], "write")

        const series = await this.findByUserAndId(input.userId, input.id)

        if (series === null) {
            throw new Error("Série não encontrada após criação.")
        }

        return series
    }

    async updateDates(input: UpdateBookSeriesDatesRecordInput): Promise<BookSeries | null> {
        await ensureDatabaseSchema(this.client)

        const series = await this.findByUserAndId(input.userId, input.seriesId)

        if (series === null) {
            return null
        }

        const seriesBookIds = new Set(series.books.map((book) => book.id))

        if (input.books.some((book) => !seriesBookIds.has(book.bookId))) {
            return null
        }

        await this.client.batch(
            input.books.map((book) => ({
                sql: `
                UPDATE books
                SET reading_started_on = ?, reading_finished_on = ?
                WHERE user_id = ? AND series_id = ? AND id = ?
                  AND author_id IS NULL
                  AND series_order IS NOT NULL
            `,
                args: [
                    book.readingStartedOn,
                    book.readingFinishedOn,
                    input.userId,
                    input.seriesId,
                    book.bookId
                ]
            })),
            "write"
        )

        return await this.findByUserAndId(input.userId, input.seriesId)
    }

    async deleteByUserAndId(userId: string, seriesId: string): Promise<boolean> {
        await ensureDatabaseSchema(this.client)

        const series = await this.findByUserAndId(userId, seriesId)

        if (series === null) {
            return false
        }

        await this.client.batch([
            {
                sql: "DELETE FROM books WHERE user_id = ? AND series_id = ? AND author_id IS NULL",
                args: [userId, seriesId]
            },
            {
                sql: "DELETE FROM series WHERE user_id = ? AND id = ?",
                args: [userId, seriesId]
            }
        ], "write")

        return true
    }
}

const seriesColumns = `
    series.id AS series_id,
    series.user_id AS series_user_id,
    series.name AS series_name,
    series.normalized_name AS series_normalized_name,
    series.created_at AS series_created_at,
    authors.id AS author_id,
    authors.user_id AS author_user_id,
    authors.name AS author_name,
    authors.normalized_name AS author_normalized_name,
    authors.created_at AS author_created_at,
    books.id AS book_id,
    books.user_id AS book_user_id,
    books.title AS book_title,
    books.normalized_title AS book_normalized_title,
    books.series_order,
    books.reading_started_on,
    books.reading_finished_on,
    books.created_at AS book_created_at
`

function mapBookSeriesRows(rows: Row[]): BookSeries[] {
    const seriesById = new Map<string, BookSeries>()

    for (const row of rows) {
        const seriesId = asString(row.series_id)
        let series = seriesById.get(seriesId)

        if (!series) {
            series = {
                id: seriesId,
                userId: asString(row.series_user_id),
                name: asString(row.series_name),
                normalizedName: asString(row.series_normalized_name),
                author: {
                    id: asString(row.author_id),
                    userId: asString(row.author_user_id),
                    name: asString(row.author_name),
                    normalizedName: asString(row.author_normalized_name),
                    createdAt: new Date(asString(row.author_created_at))
                },
                books: [],
                createdAt: new Date(asString(row.series_created_at))
            }
            seriesById.set(seriesId, series)
        }

        if (row.book_id !== null) {
            series.books.push(mapBookInSeries(row, seriesId))
        }
    }

    return [...seriesById.values()]
}

function mapBookInSeries(row: Row, seriesId: string): BookInSeries {
    const seriesOrder = row.series_order

    if (typeof seriesOrder !== "number") {
        throw new Error("Ordem de livro de série inesperada.")
    }

    return {
        id: asString(row.book_id),
        userId: asString(row.book_user_id),
        seriesId,
        title: asString(row.book_title),
        normalizedTitle: asString(row.book_normalized_title),
        seriesOrder,
        readingStartedOn: asNullableString(row.reading_started_on),
        readingFinishedOn: asNullableString(row.reading_finished_on),
        createdAt: new Date(asString(row.book_created_at))
    }
}
