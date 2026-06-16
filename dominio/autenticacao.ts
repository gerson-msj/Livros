export const MINIMUM_CREDENTIAL_LENGTH = 5
export const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000

export interface User {
    id: string
    username: string
    passwordHash: string
    resetKeyHash: string
    createdAt: Date
}

export interface Session {
    id: string
    userId: string
    expiresAt: Date
    createdAt: Date
    endedAt: Date | null
}

export interface RegistrationInput {
    username: string
    password: string
}

export interface NormalizedRegistration {
    username: string
    password: string
}

export type RegistrationField = "username" | "password"

export interface ValidationIssue {
    field: RegistrationField
    message: string
}

export class RegistrationValidationError extends Error {
    constructor(public readonly issues: ValidationIssue[]) {
        super("Dados de cadastro invalidos")
        this.name = "RegistrationValidationError"
    }
}

export class UsernameAlreadyExistsError extends Error {
    constructor(username: string) {
        super(`Nome de usuario indisponivel: ${username}`)
        this.name = "UsernameAlreadyExistsError"
    }
}

export function normalizeUsername(username: string): string {
    return username.trim().toLowerCase()
}

export function normalizeRegistration(input: RegistrationInput): NormalizedRegistration {
    return {
        username: normalizeUsername(input.username),
        password: input.password.trim()
    }
}

export function validateRegistration(input: RegistrationInput): NormalizedRegistration {
    const normalized = normalizeRegistration(input)
    const issues: ValidationIssue[] = []

    if (normalized.username.length < MINIMUM_CREDENTIAL_LENGTH) {
        issues.push({
            field: "username",
            message: "O nome de usuario deve conter no minimo 5 caracteres."
        })
    }

    if (normalized.password.length < MINIMUM_CREDENTIAL_LENGTH) {
        issues.push({
            field: "password",
            message: "A senha deve conter no minimo 5 caracteres."
        })
    }

    if (issues.length > 0) {
        throw new RegistrationValidationError(issues)
    }

    return normalized
}

export function calculateSessionExpiration(now: Date): Date {
    return new Date(now.getTime() + SESSION_DURATION_MS)
}
