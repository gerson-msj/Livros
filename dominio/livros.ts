export const MINIMUM_BOOK_TEXT_LENGTH = 2

export interface Author {
    id: string
    userId: string
    name: string
    normalizedName: string
    createdAt: Date
}

export interface StandaloneBook {
    id: string
    userId: string
    title: string
    normalizedTitle: string
    author: Author
    readingStartedOn: string | null
    readingFinishedOn: string | null
    createdAt: Date
}

export interface BookDatesInput {
    readingStartedOn?: string | null
    readingFinishedOn?: string | null
}

export interface CreateStandaloneBookInput extends BookDatesInput {
    userId: string
    title: string
    authorName: string
}

export interface UpdateStandaloneBookDatesInput extends BookDatesInput {
    userId: string
    bookId: string
}

export type StandaloneBookField = "title" | "authorName" | "readingStartedOn" | "readingFinishedOn"

export interface StandaloneBookValidationIssue {
    field: StandaloneBookField
    message: string
}

export interface NormalizedStandaloneBookInput {
    userId: string
    title: string
    normalizedTitle: string
    authorName: string
    normalizedAuthorName: string
    readingStartedOn: string | null
    readingFinishedOn: string | null
}

export interface NormalizedBookDates {
    readingStartedOn: string | null
    readingFinishedOn: string | null
}

export class StandaloneBookValidationError extends Error {
    constructor(public readonly issues: StandaloneBookValidationIssue[]) {
        super("Dados do livro invalidos")
        this.name = "StandaloneBookValidationError"
    }
}

export class DuplicateStandaloneBookError extends Error {
    constructor() {
        super("Livro avulso duplicado para o usuario.")
        this.name = "DuplicateStandaloneBookError"
    }
}

export function normalizeSearchText(value: string): string {
    return value.trim().toLowerCase()
}

export function validateStandaloneBook(input: CreateStandaloneBookInput): NormalizedStandaloneBookInput {
    const title = input.title.trim()
    const authorName = input.authorName.trim()
    const issues: StandaloneBookValidationIssue[] = []

    if (title.length < MINIMUM_BOOK_TEXT_LENGTH) {
        issues.push({
            field: "title",
            message: "O titulo deve conter no minimo 2 caracteres."
        })
    }

    if (authorName.length < MINIMUM_BOOK_TEXT_LENGTH) {
        issues.push({
            field: "authorName",
            message: "O autor deve conter no minimo 2 caracteres."
        })
    }

    const dates = validateBookDates(input, issues)

    if (issues.length > 0) {
        throw new StandaloneBookValidationError(issues)
    }

    return {
        userId: input.userId,
        title,
        normalizedTitle: normalizeSearchText(title),
        authorName,
        normalizedAuthorName: normalizeSearchText(authorName),
        ...dates
    }
}

export function validateStandaloneBookDates(input: BookDatesInput): NormalizedBookDates {
    const issues: StandaloneBookValidationIssue[] = []
    const dates = validateBookDates(input, issues)

    if (issues.length > 0) {
        throw new StandaloneBookValidationError(issues)
    }

    return dates
}

function validateBookDates(input: BookDatesInput, issues: StandaloneBookValidationIssue[]): NormalizedBookDates {
    const readingStartedOn = normalizeOptionalDate(input.readingStartedOn)
    const readingFinishedOn = normalizeOptionalDate(input.readingFinishedOn)

    if (readingStartedOn !== null && !isCompleteIsoDate(readingStartedOn)) {
        issues.push({
            field: "readingStartedOn",
            message: "Informe uma data de inicio completa."
        })
    }

    if (readingFinishedOn !== null && !isCompleteIsoDate(readingFinishedOn)) {
        issues.push({
            field: "readingFinishedOn",
            message: "Informe uma data de conclusao completa."
        })
    }

    if (
        readingStartedOn !== null &&
        readingFinishedOn !== null &&
        isCompleteIsoDate(readingStartedOn) &&
        isCompleteIsoDate(readingFinishedOn) &&
        readingStartedOn > readingFinishedOn
    ) {
        issues.push({
            field: "readingStartedOn",
            message: "A data de inicio nao pode ser posterior a data de conclusao."
        })
    }

    return {
        readingStartedOn,
        readingFinishedOn
    }
}

function normalizeOptionalDate(value: string | null | undefined): string | null {
    const normalized = value?.trim() ?? ""

    return normalized.length === 0 ? null : normalized
}

function isCompleteIsoDate(value: string): boolean {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return false
    }

    const date = new Date(`${value}T00:00:00.000Z`)

    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
}
