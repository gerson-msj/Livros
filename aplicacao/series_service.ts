import type { Clock, IdGenerator } from "./autenticacao_service.ts"
import type { AuthorsService } from "./autores_service.ts"
import {
    type BookSeries,
    BookSeriesValidationError,
    type CreateBookSeriesInput,
    DuplicateBookSeriesError,
    type NormalizedCreateBookSeriesBookInput,
    type UpdateBookSeriesDatesInput,
    validateBookSeries,
    validateBookSeriesDates
} from "../dominio/series.ts"

export interface BookSeriesRepository {
    listByUser(userId: string): Promise<BookSeries[]>
    findByUserAndId(userId: string, seriesId: string): Promise<BookSeries | null>
    findByUserNameAndAuthor(userId: string, normalizedName: string, authorId: string): Promise<BookSeries | null>
    create(input: CreateBookSeriesRecordInput): Promise<BookSeries>
    updateDates(input: UpdateBookSeriesDatesRecordInput): Promise<BookSeries | null>
    deleteByUserAndId(userId: string, seriesId: string): Promise<boolean>
}

export interface CreateBookSeriesRecordInput {
    id: string
    userId: string
    name: string
    normalizedName: string
    authorId: string
    books: Array<NormalizedCreateBookSeriesBookInput & { id: string; seriesOrder: number; createdAt: Date }>
    createdAt: Date
}

export interface UpdateBookSeriesDatesRecordInput {
    userId: string
    seriesId: string
    books: Array<{
        bookId: string
        readingStartedOn: string | null
        readingFinishedOn: string | null
    }>
}

export class SeriesService {
    constructor(
        private readonly authors: AuthorsService,
        private readonly series: BookSeriesRepository,
        private readonly ids: IdGenerator,
        private readonly clock: Clock
    ) {}

    listBookSeries(userId: string): Promise<BookSeries[]> {
        return this.series.listByUser(userId)
    }

    findBookSeries(userId: string, seriesId: string): Promise<BookSeries | null> {
        return this.series.findByUserAndId(userId, seriesId)
    }

    async createBookSeries(input: CreateBookSeriesInput): Promise<BookSeries> {
        const normalized = validateBookSeries(input)
        const now = this.clock.now()
        const author = await this.authors.findOrCreateAuthor(normalized.userId, normalized.authorName, now)
        const duplicate = await this.series.findByUserNameAndAuthor(normalized.userId, normalized.normalizedName, author.id)

        if (duplicate !== null) {
            throw new DuplicateBookSeriesError()
        }

        const seriesBooks = normalized.books.map((book, index) => ({
            ...book,
            id: this.ids.newId(),
            seriesOrder: index + 1,
            createdAt: now
        }))

        if (seriesBooks.length === 0) {
            throw new BookSeriesValidationError([{ field: "books", message: "Inclua ao menos um livro com titulo." }])
        }

        return await this.series.create({
            id: this.ids.newId(),
            userId: normalized.userId,
            name: normalized.name,
            normalizedName: normalized.normalizedName,
            authorId: author.id,
            books: seriesBooks,
            createdAt: now
        })
    }

    async updateBookSeriesDates(input: UpdateBookSeriesDatesInput): Promise<BookSeries | null> {
        const normalized = validateBookSeriesDates(input)

        return await this.series.updateDates({
            userId: normalized.userId,
            seriesId: normalized.seriesId,
            books: normalized.books
        })
    }

    deleteBookSeries(userId: string, seriesId: string): Promise<boolean> {
        return this.series.deleteByUserAndId(userId, seriesId)
    }
}
