import { Head } from "fresh/runtime"
import { clearSessionCookie, getSessionIdFromCookie } from "../../infraestrutura/session_cookie.ts"
import PageTitle from "../../islands/PageTitle.tsx"
import { define } from "../../utils.ts"

export const handler = define.handlers({
    GET() {
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
                        <div class="livros-library-actions" aria-label="Areas da biblioteca">
                            <a class="card livros-library-card livros-library-card-primary" href="/biblioteca/livros">
                                <div class="card-content livros-library-card-content">
                                    <span class="icon livros-library-card-icon" aria-hidden="true">
                                        <i class="fas fa-book"></i>
                                    </span>
                                    <span class="livros-library-card-text">
                                        <strong>Livros</strong>
                                        <span>Gerencie livros avulsos em leitura ou ja lidos.</span>
                                    </span>
                                    <span class="icon livros-library-card-arrow" aria-hidden="true">
                                        <i class="fas fa-chevron-right"></i>
                                    </span>
                                </div>
                            </a>
                            <a class="card livros-library-card livros-library-card-primary" href="/biblioteca/series">
                                <div class="card-content livros-library-card-content">
                                    <span class="icon livros-library-card-icon" aria-hidden="true">
                                        <i class="fas fa-layer-group"></i>
                                    </span>
                                    <span class="livros-library-card-text">
                                        <strong>Series</strong>
                                        <span>Organize colecoes e acompanhe a leitura em ordem.</span>
                                    </span>
                                    <span class="icon livros-library-card-arrow" aria-hidden="true">
                                        <i class="fas fa-chevron-right"></i>
                                    </span>
                                </div>
                            </a>
                        </div>
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
