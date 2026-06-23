import { createClient } from "@libsql/client"
import { assertEquals, assertRejects } from "jsr:@std/assert@1"
import { BooksService } from "./livros_service.ts"
import type { Clock, IdGenerator } from "./autenticacao_service.ts"
import { DuplicateStandaloneBookError, StandaloneBookValidationError } from "../dominio/livros.ts"
import { LibsqlAuthorRepository, LibsqlStandaloneBookRepository } from "../infraestrutura/book_repositories.ts"
import { ensureDatabaseSchema } from "../infraestrutura/database.ts"

Deno.test("gerencia livros avulsos e autores privados por usuario em libSQL", async () => {
    const dbPath = await Deno.makeTempFile({ suffix: ".db" })
    const client = createClient({ url: `file:${dbPath.replaceAll("\\", "/")}` })
    const service = new BooksService(
        new LibsqlAuthorRepository(client),
        new LibsqlStandaloneBookRepository(client),
        new FixedIds(),
        new IncrementingClock(new Date("2026-06-22T12:00:00.000Z"))
    )

    try {
        await ensureDatabaseSchema(client)
        await client.batch([
            {
                sql: "INSERT INTO users (id, username, password_hash, reset_key_hash, created_at) VALUES (?, ?, ?, ?, ?)",
                args: ["user-a", "user-a", "hash", "reset", "2026-06-22T11:00:00.000Z"]
            },
            {
                sql: "INSERT INTO users (id, username, password_hash, reset_key_hash, created_at) VALUES (?, ?, ?, ?, ?)",
                args: ["user-b", "user-b", "hash", "reset", "2026-06-22T11:00:00.000Z"]
            }
        ], "write")

        const firstBook = await service.createStandaloneBook({
            userId: "user-a",
            title: "  Duna  ",
            authorName: "  Frank Herbert  ",
            readingStartedOn: "",
            readingFinishedOn: null
        })

        assertEquals(firstBook.userId, "user-a")
        assertEquals(firstBook.title, "Duna")
        assertEquals(firstBook.author.name, "Frank Herbert")
        assertEquals(firstBook.readingStartedOn, null)
        assertEquals(firstBook.readingFinishedOn, null)

        await assertRejects(
            () =>
                service.createStandaloneBook({
                    userId: "user-a",
                    title: "duna",
                    authorName: "frank herbert"
                }),
            DuplicateStandaloneBookError
        )

        const sameTitleDifferentAuthor = await service.createStandaloneBook({
            userId: "user-a",
            title: "Duna",
            authorName: "Outra pessoa",
            readingStartedOn: "2026-06-01",
            readingFinishedOn: "2026-06-10"
        })
        const otherUserBook = await service.createStandaloneBook({
            userId: "user-b",
            title: "Duna",
            authorName: "Frank Herbert"
        })

        const books = await service.listStandaloneBooks("user-a")
        assertEquals(books.map((book) => book.id), [sameTitleDifferentAuthor.id, firstBook.id])
        assertEquals((await service.listAuthors("user-a")).map((author) => author.name), ["Frank Herbert", "Outra pessoa"])
        assertEquals((await service.listAuthors("user-b")).map((author) => author.name), ["Frank Herbert"])
        assertEquals(await service.findStandaloneBook("user-b", firstBook.id), null)
        assertEquals(
            await service.updateStandaloneBookDates({ userId: "user-b", bookId: firstBook.id, readingStartedOn: "2026-06-02" }),
            null
        )
        assertEquals(await service.deleteStandaloneBook("user-b", firstBook.id), false)
        assertEquals(await service.findStandaloneBook("user-a", otherUserBook.id), null)

        await assertRejects(
            () =>
                service.updateStandaloneBookDates({
                    userId: "user-a",
                    bookId: firstBook.id,
                    readingStartedOn: "2026-07-01",
                    readingFinishedOn: "2026-06-30"
                }),
            StandaloneBookValidationError
        )

        const updatedBook = await service.updateStandaloneBookDates({
            userId: "user-a",
            bookId: firstBook.id,
            readingStartedOn: "2026-06-02",
            readingFinishedOn: "2026-06-30"
        })
        assertEquals(updatedBook?.readingStartedOn, "2026-06-02")
        assertEquals(updatedBook?.readingFinishedOn, "2026-06-30")

        assertEquals(await service.deleteStandaloneBook("user-a", firstBook.id), true)
        assertEquals(await service.findStandaloneBook("user-a", firstBook.id), null)

        const columns = await client.execute("PRAGMA table_info(standalone_books)")
        const authorIdColumn = columns.rows.find((row) => row.name === "author_id")
        assertEquals(authorIdColumn?.notnull, 0)
    } finally {
        client.close()
        await Deno.remove(dbPath).catch(() => {})
    }
})

class FixedIds implements IdGenerator {
    private index = 0

    newId(): string {
        this.index++
        return `00000000-0000-4000-8000-${this.index.toString().padStart(12, "0")}`
    }
}

class IncrementingClock implements Clock {
    private index = 0

    constructor(private readonly start: Date) {}

    now(): Date {
        const value = new Date(this.start.getTime() + this.index)
        this.index++

        return value
    }
}
