import {
    type CreateStandaloneBookInput,
    DuplicateStandaloneBookError,
    type StandaloneBook,
    type UpdateStandaloneBookDatesInput,
    validateStandaloneBook,
    validateStandaloneBookDates
} from "../dominio/livros.ts"
import type { Clock, IdGenerator } from "./autenticacao_service.ts"
import type { AuthorsService } from "./autores_service.ts"

export interface StandaloneBookRepository {
    listByUser(userId: string): Promise<StandaloneBook[]>
    findByUserAndId(userId: string, bookId: string): Promise<StandaloneBook | null>
    findByUserTitleAndAuthor(userId: string, normalizedTitle: string, authorId: string): Promise<StandaloneBook | null>
    create(input: CreateStandaloneBookRecordInput): Promise<StandaloneBook>
    updateDates(input: UpdateStandaloneBookDatesRecordInput): Promise<StandaloneBook | null>
    deleteByUserAndId(userId: string, bookId: string): Promise<boolean>
}

export interface CreateStandaloneBookRecordInput {
    id: string
    userId: string
    title: string
    normalizedTitle: string
    authorId: string
    readingStartedOn: string | null
    readingFinishedOn: string | null
    createdAt: Date
}

export interface UpdateStandaloneBookDatesRecordInput {
    userId: string
    bookId: string
    readingStartedOn: string | null
    readingFinishedOn: string | null
}

export class BooksService {
    constructor(
        private readonly authors: AuthorsService,
        private readonly books: StandaloneBookRepository,
        private readonly ids: IdGenerator,
        private readonly clock: Clock
    ) {}

    listStandaloneBooks(userId: string): Promise<StandaloneBook[]> {
        return this.books.listByUser(userId)
    }

    findStandaloneBook(userId: string, bookId: string): Promise<StandaloneBook | null> {
        return this.books.findByUserAndId(userId, bookId)
    }

    async createStandaloneBook(input: CreateStandaloneBookInput): Promise<StandaloneBook> {
        const normalized = validateStandaloneBook(input)
        const now = this.clock.now()
        const author = await this.authors.findOrCreateAuthor(normalized.userId, normalized.authorName, now)
        const duplicate = await this.books.findByUserTitleAndAuthor(normalized.userId, normalized.normalizedTitle, author.id)

        if (duplicate !== null) {
            throw new DuplicateStandaloneBookError()
        }

        return await this.books.create({
            id: this.ids.newId(),
            userId: normalized.userId,
            title: normalized.title,
            normalizedTitle: normalized.normalizedTitle,
            authorId: author.id,
            readingStartedOn: normalized.readingStartedOn,
            readingFinishedOn: normalized.readingFinishedOn,
            createdAt: now
        })
    }

    async updateStandaloneBookDates(input: UpdateStandaloneBookDatesInput): Promise<StandaloneBook | null> {
        const dates = validateStandaloneBookDates(input)

        return await this.books.updateDates({
            userId: input.userId,
            bookId: input.bookId,
            readingStartedOn: dates.readingStartedOn,
            readingFinishedOn: dates.readingFinishedOn
        })
    }

    deleteStandaloneBook(userId: string, bookId: string): Promise<boolean> {
        return this.books.deleteByUserAndId(userId, bookId)
    }
}
