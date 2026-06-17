import { Head } from "fresh/runtime"
import { clearSessionCookie, getSessionIdFromCookie } from "../infraestrutura/session_cookie.ts"
import { define } from "../utils.ts"

export const handler = define.handlers({
    async GET(ctx) {
        const sessionId = getSessionIdFromCookie(ctx.req.headers)

        if (!sessionId || !(await ctx.state.services.authentication.findActiveSession(sessionId))) {
            return redirectToCadastro()
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
        return redirectToCadastro(headers)
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
                        <h1 class="title">Biblioteca</h1>
                        <form method="post" class="box">
                            <button class="button is-danger is-fullwidth" type="submit">
                                <span class="icon">
                                    <i class="fas fa-right-from-bracket" aria-hidden="true"></i>
                                </span>
                                <span>Sair</span>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
})

function redirectToCadastro(headers = new Headers()): Response {
    headers.set("location", "/cadastro")

    return new Response(null, {
        status: 303,
        headers
    })
}
