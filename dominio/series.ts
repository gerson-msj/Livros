import { type Author, MINIMUM_TEXT_LENGTH, normalizeSearchText } from "./autores.ts"
import { type BookDatesInput, normalizeBookTitle, type NormalizedBookDates, validateBookDates } from "./livros.ts"

export interface BookInSeries {
    id: string
    userId: string
    seriesId: string
    title: string
    normalizedTitle: string
    seriesOrder: number
    readingStartedOn: string | null
    readingFinishedOn: string | null
    createdAt: Date
}

export interface BookSeries {
    id: string
    userId: string
    name: string
    normalizedName: string
    author: Author
    books: BookInSeries[]
    createdAt: Date
}

export interface CreateBookSeriesBookInput extends BookDatesInput {
    title: string
}

export interface CreateBookSeriesInput {
    userId: string
    name: string
    authorName: string
    books: CreateBookSeriesBookInput[]
}

export interface UpdateBookSeriesDatesBookInput extends BookDatesInput {
    bookId: string
}

export interface UpdateBookSeriesDatesInput {
    userId: string
    seriesId: string
    books: UpdateBookSeriesDatesBookInput[]
}

export type BookSeriesField =
    | "name"
    | "authorName"
    | "books"
    | `books.${number}.title`
    | `books.${number}.readingStartedOn`
    | `books.${number}.readingFinishedOn`

export interface BookSeriesValidationIssue {
    field: BookSeriesField
    message: string
}

export interface NormalizedCreateBookSeriesBookInput {
    title: string
    normalizedTitle: string
    readingStartedOn: string | null
    readingFinishedOn: string | null
}

export interface NormalizedCreateBookSeriesInput {
    userId: string
    name: string
    normalizedName: string
    authorName: string
    normalizedAuthorName: string
    books: NormalizedCreateBookSeriesBookInput[]
}

export interface NormalizedUpdateBookSeriesDatesBookInput extends NormalizedBookDates {
    bookId: string
}

export interface NormalizedUpdateBookSeriesDatesInput {
    userId: string
    seriesId: string
    books: NormalizedUpdateBookSeriesDatesBookInput[]
}

export class BookSeriesValidationError extends Error {
    constructor(public readonly issues: BookSeriesValidationIssue[]) {
        super("Dados da serie invalidos")
        this.name = "BookSeriesValidationError"
    }
}

export class DuplicateBookSeriesError extends Error {
    constructor() {
        super("Serie duplicada para o usuario e autor.")
        this.name = "DuplicateBookSeriesError"
    }
}

export function validateBookSeries(input: CreateBookSeriesInput): NormalizedCreateBookSeriesInput {
    const name = input.name.trim()
    const authorName = input.authorName.trim()
    const issues: BookSeriesValidationIssue[] = []

    if (name.length < MINIMUM_TEXT_LENGTH) {
        issues.push({
            field: "name",
            message: "O nome da serie deve conter no minimo 2 caracteres."
        })
    }

    if (authorName.length < MINIMUM_TEXT_LENGTH) {
        issues.push({
            field: "authorName",
            message: "O autor deve conter no minimo 2 caracteres."
        })
    }

    const books = input.books.map((book, index): NormalizedCreateBookSeriesBookInput => {
        const title = normalizeBookTitle(book.title)
        const bookIssues: BookSeriesValidationIssue[] = []
        const dates = validateBookDates(book, bookIssues, `books.${index}.readingStartedOn`, `books.${index}.readingFinishedOn`)

        issues.push(...bookIssues)

        if (title.length < MINIMUM_TEXT_LENGTH) {
            issues.push({
                field: `books.${index}.title`,
                message: "O titulo do livro deve conter no minimo 2 caracteres."
            })
        }

        return {
            title,
            normalizedTitle: normalizeSearchText(title),
            ...dates
        }
    }).filter((book) => book.title.length > 0)

    if (books.length === 0) {
        issues.push({
            field: "books",
            message: "Inclua ao menos um livro com titulo."
        })
    }

    const duplicatedBookTitle = books.find((book, index) =>
        books.findIndex((candidate) => candidate.normalizedTitle === book.normalizedTitle) !== index
    )

    if (duplicatedBookTitle) {
        issues.push({
            field: "books",
            message: "A mesma serie nao pode ter livros com titulos repetidos."
        })
    }

    if (issues.length > 0) {
        throw new BookSeriesValidationError(issues)
    }

    return {
        userId: input.userId,
        name,
        normalizedName: normalizeSearchText(name),
        authorName,
        normalizedAuthorName: normalizeSearchText(authorName),
        books
    }
}

export function validateBookSeriesDates(input: UpdateBookSeriesDatesInput): NormalizedUpdateBookSeriesDatesInput {
    const issues: BookSeriesValidationIssue[] = []
    const books = input.books.map((book, index): NormalizedUpdateBookSeriesDatesBookInput => {
        const dates = validateBookDates(book, issues, `books.${index}.readingStartedOn`, `books.${index}.readingFinishedOn`)

        return {
            bookId: book.bookId,
            ...dates
        }
    })

    if (books.length === 0) {
        issues.push({
            field: "books",
            message: "Informe ao menos um livro da serie."
        })
    }

    if (issues.length > 0) {
        throw new BookSeriesValidationError(issues)
    }

    return {
        userId: input.userId,
        seriesId: input.seriesId,
        books
    }
}
