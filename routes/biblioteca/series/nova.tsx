import { Head } from "fresh/runtime"
import { getSessionIdFromCookie } from "../../../infraestrutura/session_cookie.ts"
import type { SelectableAuthor } from "../../../islands/AuthorPicker.tsx"
import SeriesCreateForm from "../../../islands/SeriesCreateForm.tsx"
import { define } from "../../../utils.ts"

const mockAuthors: SelectableAuthor[] = [
    { id: "author-robert-jordan", name: "Robert Jordan" },
    { id: "author-isaac-asimov", name: "Isaac Asimov" },
    { id: "author-jrr-tolkien", name: "J. R. R. Tolkien" }
]

export const handler = define.handlers({
    async GET(ctx) {
        const sessionId = getSessionIdFromCookie(ctx.req.headers)
        const session = sessionId ? await ctx.state.services.authentication.findActiveSession(sessionId) : null

        if (session === null) {
            return redirectToLogin()
        }

        return {
            data: {
                authors: mockAuthors
            }
        }
    }
})

export default define.page<typeof handler>(function NovaSerie({ data }) {
    return (
        <section class="livros-book-form-route">
            <Head>
                <title>Nova serie | Biblioteca</title>
            </Head>
            <SeriesCreateForm authors={data.authors} />
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
