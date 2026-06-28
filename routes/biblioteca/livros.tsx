import { Head } from "fresh/runtime"
import BooksList, { type ListedBook } from "../../islands/BooksList.tsx"
import { define } from "../../utils.ts"

export const handler = define.handlers({
    async GET(ctx) {
        const session = ctx.state.authenticatedSession!
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
