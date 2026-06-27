import { createClient } from "@libsql/client"
import { LibsqlStandaloneBookRepository } from "./book_repositories.ts"
import { ensureDatabaseSchema } from "./database.ts"

Deno.test("lista ultimos livros concluindo primeiro e completa com abertos por cadastro", async () => {
    const client = createClient({ url: "file::memory:" })

    try {
        await ensureDatabaseSchema(client)
        await seedRecentBooksScenario(client)

        const books = await new LibsqlStandaloneBookRepository(client).listRecentByUser("user-a", 5)

        assertEquals(books.map((book) => book.id), [
            "book-finished-newest",
            "book-series-finished",
            "book-finished-oldest",
            "book-open-newest",
            "book-series-open"
        ])
        assertEquals(books.map((book) => book.authorName), [
            "Autora Avulsa",
            "Autor da Serie",
            "Autora Avulsa",
            "Autora Avulsa",
            "Autor da Serie"
        ])
    } finally {
        await client.close()
    }
})

Deno.test("nao completa com livros abertos quando concluidos ja atingem o limite", async () => {
    const client = createClient({ url: "file::memory:" })

    try {
        await ensureDatabaseSchema(client)
        await seedRecentBooksScenario(client)

        const books = await new LibsqlStandaloneBookRepository(client).listRecentByUser("user-a", 2)

        assertEquals(books.map((book) => book.id), [
            "book-finished-newest",
            "book-series-finished"
        ])
    } finally {
        await client.close()
    }
})

async function seedRecentBooksScenario(client: ReturnType<typeof createClient>) {
    await client.batch([
        "INSERT INTO users (id, username, password_hash, reset_key_hash, created_at) VALUES ('user-a', 'usera', 'hash', 'reset', '2026-01-01T00:00:00.000Z')",
        "INSERT INTO users (id, username, password_hash, reset_key_hash, created_at) VALUES ('user-b', 'userb', 'hash', 'reset', '2026-01-01T00:00:00.000Z')",
        "INSERT INTO authors (id, user_id, name, normalized_name, created_at) VALUES ('author-standalone', 'user-a', 'Autora Avulsa', 'autora avulsa', '2026-01-01T00:00:00.000Z')",
        "INSERT INTO authors (id, user_id, name, normalized_name, created_at) VALUES ('author-series', 'user-a', 'Autor da Serie', 'autor da serie', '2026-01-01T00:00:00.000Z')",
        "INSERT INTO authors (id, user_id, name, normalized_name, created_at) VALUES ('author-other', 'user-b', 'Outro Autor', 'outro autor', '2026-01-01T00:00:00.000Z')",
        "INSERT INTO series (id, user_id, name, normalized_name, author_id, created_at) VALUES ('series-a', 'user-a', 'Serie A', 'serie a', 'author-series', '2026-01-02T00:00:00.000Z')",
        "INSERT INTO series (id, user_id, name, normalized_name, author_id, created_at) VALUES ('series-b', 'user-b', 'Serie B', 'serie b', 'author-other', '2026-01-02T00:00:00.000Z')",
        {
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
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
            args: [
                "book-finished-newest",
                "user-a",
                "Livro concluido novo",
                "livro concluido novo",
                "author-standalone",
                null,
                null,
                null,
                "2026-06-20",
                "2026-06-01T00:00:00.000Z"
            ]
        },
        {
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
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
            args: [
                "book-series-finished",
                "user-a",
                "Livro de serie concluido",
                "livro de serie concluido",
                null,
                "series-a",
                1,
                null,
                "2026-06-10",
                "2026-06-03T00:00:00.000Z"
            ]
        },
        {
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
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
            args: [
                "book-finished-oldest",
                "user-a",
                "Livro concluido antigo",
                "livro concluido antigo",
                "author-standalone",
                null,
                null,
                null,
                "2026-05-01",
                "2026-06-25T00:00:00.000Z"
            ]
        },
        {
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
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
            args: [
                "book-open-newest",
                "user-a",
                "Livro aberto novo",
                "livro aberto novo",
                "author-standalone",
                null,
                null,
                null,
                null,
                "2026-06-30T00:00:00.000Z"
            ]
        },
        {
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
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
            args: [
                "book-series-open",
                "user-a",
                "Livro de serie aberto",
                "livro de serie aberto",
                null,
                "series-a",
                2,
                null,
                null,
                "2026-06-29T00:00:00.000Z"
            ]
        },
        {
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
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
            args: [
                "book-other-user",
                "user-b",
                "Livro de outro usuario",
                "livro de outro usuario",
                "author-other",
                null,
                null,
                null,
                "2026-12-31",
                "2026-12-31T00:00:00.000Z"
            ]
        }
    ], "write")
}

function assertEquals<T>(actual: T, expected: T) {
    const actualJson = JSON.stringify(actual)
    const expectedJson = JSON.stringify(expected)

    if (actualJson !== expectedJson) {
        throw new Error(`Expected ${expectedJson}, got ${actualJson}`)
    }
}
