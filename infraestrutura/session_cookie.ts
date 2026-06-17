export const SESSION_COOKIE_NAME = "livros_session"

export function getSessionIdFromCookie(headers: Headers): string | null {
    const cookie = headers.get("cookie")

    if (!cookie) {
        return null
    }

    for (const part of cookie.split(";")) {
        const [name, ...valueParts] = part.trim().split("=")

        if (name === SESSION_COOKIE_NAME) {
            const value = valueParts.join("=")
            return value ? decodeURIComponent(value) : null
        }
    }

    return null
}

export function setSessionCookie(headers: Headers, sessionId: string, expiresAt: Date): void {
    headers.append(
        "set-cookie",
        [
            `${SESSION_COOKIE_NAME}=${encodeURIComponent(sessionId)}`,
            "Path=/",
            "HttpOnly",
            "SameSite=Lax",
            `Expires=${expiresAt.toUTCString()}`
        ].join("; ")
    )
}
