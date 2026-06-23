import { Head } from "fresh/runtime"
import { getSessionIdFromCookie } from "../../infraestrutura/session_cookie.ts"
import BooksList, { type ListedBook } from "../../islands/BooksList.tsx"
import { define } from "../../utils.ts"

export const handler = define.handlers({
    async GET(ctx) {
        const sessionId = getSessionIdFromCookie(ctx.req.headers)
        const session = sessionId ? await ctx.state.services.authentication.findActiveSession(sessionId) : null

        if (session === null) {
            return redirectToLogin()
        }

        const books = await ctx.state.services.books.listStandaloneBooks(session.userId)

        return {
            data: {
                books: books.map((book): ListedBook => ({
                    id: book.id,
                    title: book.title,
                    author: book.author.name,
                    readingStartedOn: book.readingStartedOn,
                    readingFinishedOn: book.readingFinishedOn
                }))
            }
        }
    }
})

export default define.page<typeof handler>(function Livros({ data }) {
    return (
        <section class="livros-books-page">
            <Head>
                <title>Livros | Biblioteca</title>
            </Head>
            <BooksList books={data.books} />
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
