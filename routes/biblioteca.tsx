import { Head } from "fresh/runtime"
import { clearSessionCookie, getSessionIdFromCookie } from "../infraestrutura/session_cookie.ts"
import PageTitle from "../islands/PageTitle.tsx"
import { define } from "../utils.ts"

export const handler = define.handlers({
    async GET(ctx) {
        const sessionId = getSessionIdFromCookie(ctx.req.headers)

        if (!sessionId || !(await ctx.state.services.authentication.findActiveSession(sessionId))) {
            return redirectToLogin()
        }

        return { data: {} }
    },

    async POST(ctx) {
        const sessionId = getSessionIdFromCookie(ctx.req.headers)
        const headers = new Headers()

        if (sessionId) {
            await ctx.state.services.authentication.endSession(sessionId)
        }

        clearSessionCookie(headers)
        return redirectToLogin(headers)
    }
})

export default define.page<typeof handler>(function Biblioteca() {
    return (
        <section class="section">
            <Head>
                <title>Biblioteca | Livros</title>
            </Head>
            <div class="container">
                <div class="columns is-centered">
                    <div class="column is-full-mobile is-two-thirds-tablet is-half-desktop">
                        <PageTitle title="Biblioteca" showLogout />
                        <form method="post" id="logout-form" class="is-hidden" aria-hidden="true"></form>
                    </div>
                </div>
            </div>
        </section>
    )
})

function redirectToLogin(headers = new Headers()): Response {
    headers.set("location", "/login")

    return new Response(null, {
        status: 303,
        headers
    })
}
