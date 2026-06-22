import { Head } from "fresh/runtime"
import { getSessionIdFromCookie } from "../../../infraestrutura/session_cookie.ts"
import MockBookEditForm from "../../../islands/MockBookEditForm.tsx"
import { define } from "../../../utils.ts"

export const handler = define.handlers({
    async GET(ctx) {
        const sessionId = getSessionIdFromCookie(ctx.req.headers)

        if (!sessionId || !(await ctx.state.services.authentication.findActiveSession(sessionId))) {
            return redirectToLogin()
        }

        return { data: { bookId: ctx.params.id } }
    }
})

export default define.page<typeof handler>(function EditarLivroMockado({ data }) {
    return (
        <section class="livros-book-form-route">
            <Head>
                <title>Editar livro | Biblioteca</title>
            </Head>
            <MockBookEditForm bookId={data.bookId} />
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
