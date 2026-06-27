export const MINIMUM_TEXT_LENGTH = 2

export interface Author {
    id: string
    userId: string
    name: string
    normalizedName: string
    createdAt: Date
}

export function normalizeSearchText(value: string): string {
    return value.trim().toLowerCase()
}

export function normalizeRequiredText(value: string): string {
    return value.trim()
}
