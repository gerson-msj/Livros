import { getSessionIdFromCookie } from "../../infraestrutura/session_cookie.ts"
import { define } from "../../utils.ts"

export default define.middleware(async (ctx) => {
    const sessionId = getSessionIdFromCookie(ctx.req.headers)
    const session = sessionId ? await ctx.state.services.authentication.findActiveSession(sessionId) : null

    if (session === null) {
        return prefersJson(ctx.req.headers) ? jsonSessionExpiredResponse() : redirectToLogin()
    }

    ctx.state.authenticatedSession = session
    return await ctx.next()
})

function prefersJson(headers: Headers): boolean {
    return headers.get("accept")?.includes("application/json") ?? false
}

function jsonSessionExpiredResponse(): Response {
    return new Response(JSON.stringify({ ok: false, messages: ["Sessao expirada. Entre novamente."] }), {
        status: 401,
        headers: {
            "content-type": "application/json; charset=utf-8"
        }
    })
}

function redirectToLogin(): Response {
    const headers = new Headers()
    headers.set("location", "/login")

    return new Response(null, {
        status: 303,
        headers
    })
}
