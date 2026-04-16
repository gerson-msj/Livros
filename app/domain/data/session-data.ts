export interface ISessionData {
    /** UUID */
    sessionId: string

    /** Id do usuário */
    userId: number

    /** Validade da sessão, UTC milliseconds (absoluto) */
    expiresTime: number

    /** Validade da sessão, milliseconds (relativo) */
    expireIn: number

    /** Validade da sessão, seconds (relativo) */
    maxAge: number
}

export function createSessionData(sessionId: string, userId: number): ISessionData {
    const now = new Date()
    const fatorMinMs = 60 * 1000
    const fatorMinS = 60

    const sessionMaxAgeMinutes = parseInt(Deno.env.get("SESSION_MAX_AGE_MINUTES") ?? "1440")
    const expiresTime = now.getTime() + (sessionMaxAgeMinutes * fatorMinMs)
    const expireIn = sessionMaxAgeMinutes * fatorMinMs
    const maxAge = sessionMaxAgeMinutes * fatorMinS

    return { sessionId, userId, expiresTime, expireIn, maxAge }
}
