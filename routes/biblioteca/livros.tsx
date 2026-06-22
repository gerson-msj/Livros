import { Head } from "fresh/runtime"
import { getSessionIdFromCookie } from "../../infraestrutura/session_cookie.ts"
import MockBooksList from "../../islands/MockBooksList.tsx"
import { define } from "../../utils.ts"

export const handler = define.handlers({
    async GET(ctx) {
        const sessionId = getSessionIdFromCookie(ctx.req.headers)

        if (!sessionId || !(await ctx.state.services.authentication.findActiveSession(sessionId))) {
            return redirectToLogin()
        }

        return { data: {} }
    }
})

export default define.page<typeof handler>(function LivrosMockados() {
    return (
        <section class="livros-books-page">
            <Head>
                <title>Livros | Biblioteca</title>
            </Head>
            <MockBooksList />
        </section>
    )
})

function redirectToLogin(): Response {
    const headers = new Headers()
    headers.set("location", "/login")

    return new Response(null, {
        status: 303,
        headers
    })
}
