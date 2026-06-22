import { Head } from "fresh/runtime"
import { getSessionIdFromCookie } from "../../../infraestrutura/session_cookie.ts"
import MockBookCreateForm from "../../../islands/MockBookCreateForm.tsx"
import { define } from "../../../utils.ts"

export const handler = define.handlers({
    async GET(ctx) {
        const sessionId = getSessionIdFromCookie(ctx.req.headers)

        if (!sessionId || !(await ctx.state.services.authentication.findActiveSession(sessionId))) {
            return redirectToLogin()
        }

        return { data: {} }
    }
})

export default define.page<typeof handler>(function NovoLivroMockado() {
    return (
        <section class="livros-book-form-route">
            <Head>
                <title>Novo livro | Biblioteca</title>
            </Head>
            <MockBookCreateForm />
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
