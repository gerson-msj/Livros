import { Head } from "fresh/runtime"
import { getSessionIdFromCookie } from "../../infraestrutura/session_cookie.ts"
import PageTitle from "../../islands/PageTitle.tsx"
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
        <section class="section">
            <Head>
                <title>Livros | Biblioteca</title>
            </Head>
            <div class="container">
                <div class="columns is-centered">
                    <div class="column is-full-mobile is-two-thirds-tablet is-half-desktop">
                        <PageTitle title="Livros" leftMode="back" backHref="/biblioteca" />
                        <div class="notification is-link is-light livros-books-mock-notice">
                            <p class="has-text-weight-semibold">Entrada de livros criada para validacao UX.</p>
                            <p>A lista mockada com topo fixo e rolagem sera montada na proxima fase.</p>
                        </div>
                    </div>
                </div>
            </div>
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
