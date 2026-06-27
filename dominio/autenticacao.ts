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

export interface LoginInput {
    username: string
    password: string
}

export interface PasswordResetInput {
    username: string
    resetKey: string
    newPassword: string
}

export interface NormalizedRegistration {
    username: string
    password: string
}

export interface NormalizedLogin {
    username: string
    password: string
}

export interface NormalizedPasswordReset {
    username: string
    resetKey: string
    newPassword: string
}

export type RegistrationField = "username" | "password"
export type PasswordResetField = "username" | "resetKey" | "newPassword"

export interface ValidationIssue {
    field: RegistrationField | PasswordResetField
    message: string
}

export class RegistrationValidationError extends Error {
    constructor(public readonly issues: ValidationIssue[]) {
        super("Dados de cadastro inválidos")
        this.name = "RegistrationValidationError"
    }
}

export class UsernameAlreadyExistsError extends Error {
    constructor(username: string) {
        super(`Nome de usuário indisponível: ${username}`)
        this.name = "UsernameAlreadyExistsError"
    }
}

export class InvalidCredentialsError extends Error {
    constructor() {
        super("Credenciais inválidas")
        this.name = "InvalidCredentialsError"
    }
}

export class InvalidPasswordResetError extends Error {
    constructor() {
        super("Dados de redefinição inválidos")
        this.name = "InvalidPasswordResetError"
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

export function normalizeLogin(input: LoginInput): NormalizedLogin {
    return {
        username: normalizeUsername(input.username),
        password: input.password.trim()
    }
}

export function normalizePasswordReset(input: PasswordResetInput): NormalizedPasswordReset {
    return {
        username: normalizeUsername(input.username),
        resetKey: input.resetKey.trim(),
        newPassword: input.newPassword.trim()
    }
}

export function validateRegistration(input: RegistrationInput): NormalizedRegistration {
    const normalized = normalizeRegistration(input)
    const issues: ValidationIssue[] = []

    if (normalized.username.length < MINIMUM_CREDENTIAL_LENGTH) {
        issues.push({
            field: "username",
            message: "O nome de usuário deve conter no mínimo 5 caracteres."
        })
    }

    if (normalized.password.length < MINIMUM_CREDENTIAL_LENGTH) {
        issues.push({
            field: "password",
            message: "A senha deve conter no mínimo 5 caracteres."
        })
    }

    if (issues.length > 0) {
        throw new RegistrationValidationError(issues)
    }

    return normalized
}

export function validatePasswordReset(input: PasswordResetInput): NormalizedPasswordReset {
    const normalized = normalizePasswordReset(input)
    const issues: ValidationIssue[] = []

    if (normalized.username.length < MINIMUM_CREDENTIAL_LENGTH) {
        issues.push({
            field: "username",
            message: "O nome de usuário deve conter no mínimo 5 caracteres."
        })
    }

    if (normalized.resetKey.length === 0) {
        issues.push({
            field: "resetKey",
            message: "Informe a chave de redefinição."
        })
    }

    if (normalized.newPassword.length < MINIMUM_CREDENTIAL_LENGTH) {
        issues.push({
            field: "newPassword",
            message: "A nova senha deve conter no mínimo 5 caracteres."
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
