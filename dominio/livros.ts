import { type Author, MINIMUM_TEXT_LENGTH, normalizeSearchText } from "./autores.ts"

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

export interface RecentLibraryBook {
    id: string
    userId: string
    title: string
    authorName: string
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
        super("Dados do livro inválidos")
        this.name = "StandaloneBookValidationError"
    }
}

export class DuplicateStandaloneBookError extends Error {
    constructor() {
        super("Livro avulso duplicado para o usuário.")
        this.name = "DuplicateStandaloneBookError"
    }
}

export function normalizeBookTitle(value: string): string {
    return value.trim()
}

export function validateStandaloneBook(input: CreateStandaloneBookInput): NormalizedStandaloneBookInput {
    const title = normalizeBookTitle(input.title)
    const authorName = input.authorName.trim()
    const issues: StandaloneBookValidationIssue[] = []

    if (title.length < MINIMUM_TEXT_LENGTH) {
        issues.push({
            field: "title",
            message: "O título deve conter no mínimo 2 caracteres."
        })
    }

    if (authorName.length < MINIMUM_TEXT_LENGTH) {
        issues.push({
            field: "authorName",
            message: "O autor deve conter no mínimo 2 caracteres."
        })
    }

    const dates = validateBookDates(input, issues, "readingStartedOn", "readingFinishedOn")

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
    const dates = validateBookDates(input, issues, "readingStartedOn", "readingFinishedOn")

    if (issues.length > 0) {
        throw new StandaloneBookValidationError(issues)
    }

    return dates
}

export function validateBookDates<TIssue extends { field: string; message: string }>(
    input: BookDatesInput,
    issues: TIssue[],
    startedField: TIssue["field"],
    finishedField: TIssue["field"]
): NormalizedBookDates {
    const readingStartedOn = normalizeOptionalDate(input.readingStartedOn)
    const readingFinishedOn = normalizeOptionalDate(input.readingFinishedOn)

    if (readingStartedOn !== null && !isCompleteIsoDate(readingStartedOn)) {
        issues.push({
            field: startedField,
            message: "Informe uma data de início completa."
        } as TIssue)
    }

    if (readingFinishedOn !== null && !isCompleteIsoDate(readingFinishedOn)) {
        issues.push({
            field: finishedField,
            message: "Informe uma data de conclusão completa."
        } as TIssue)
    }

    if (
        readingStartedOn !== null &&
        readingFinishedOn !== null &&
        isCompleteIsoDate(readingStartedOn) &&
        isCompleteIsoDate(readingFinishedOn) &&
        readingStartedOn > readingFinishedOn
    ) {
        issues.push({
            field: startedField,
            message: "A data de início não pode ser posterior à data de conclusão."
        } as TIssue)
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
