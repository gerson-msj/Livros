import { Head } from "fresh/runtime"
import { clearSessionCookie, getSessionIdFromCookie } from "../../infraestrutura/session_cookie.ts"
import PageTitle from "../../islands/PageTitle.tsx"
import { define } from "../../utils.ts"

interface RecentLibraryBook {
    id: string
    title: string
    author: string
    finishedOn: string | null
}

export const handler = define.handlers({
    async GET(ctx) {
        const session = ctx.state.authenticatedSession!
        const recentBooks = await ctx.state.services.books.listRecentLibraryBooks(session.userId)

        return {
            data: {
                recentBooks: recentBooks.map((book): RecentLibraryBook => ({
                    id: book.id,
                    title: book.title,
                    author: book.authorName,
                    finishedOn: book.readingFinishedOn
                }))
            }
        }
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

export default define.page<typeof handler>(function Biblioteca({ data }) {
    return (
        <section class="section">
            <Head>
                <title>Biblioteca | Livros</title>
            </Head>
            <div class="container">
                <div class="columns is-centered">
                    <div class="column is-full-mobile is-two-thirds-tablet is-half-desktop">
                        <PageTitle title="Biblioteca" showLogout />
                        <nav class="livros-library-shortcuts" aria-label="Areas da biblioteca">
                            <a class="button livros-library-shortcut" href="/biblioteca/livros">
                                <span class="icon" aria-hidden="true">
                                    <i class="fas fa-book"></i>
                                </span>
                                <span>Livros</span>
                            </a>
                            <a class="button livros-library-shortcut" href="/biblioteca/series">
                                <span class="icon" aria-hidden="true">
                                    <i class="fas fa-layer-group"></i>
                                </span>
                                <span>Series</span>
                            </a>
                        </nav>
                        {data.recentBooks.length === 0 ? <EmptyRecentBooks /> : <RecentBooks books={data.recentBooks} />}
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

function RecentBooks({ books }: { books: RecentLibraryBook[] }) {
    return (
        <section class="livros-library-recent" aria-labelledby="livros-library-recent-title">
            <header class="livros-library-recent-header">
                <div>
                    <h2 id="livros-library-recent-title" class="title is-5">Ultimos livros</h2>
                </div>
            </header>
            <ol class="livros-library-recent-list" aria-label="Ultimos 10 livros">
                {books.map((book) => <RecentBookItem key={book.id} book={book} />)}
            </ol>
        </section>
    )
}

function EmptyRecentBooks() {
    return (
        <div class="livros-library-empty">
            <span class="icon livros-library-empty-icon" aria-hidden="true">
                <i class="fas fa-book-open"></i>
            </span>
            <p>Ainda nao existem livros ou series.</p>
        </div>
    )
}

function RecentBookItem({ book }: { book: RecentLibraryBook }) {
    return (
        <li class="livros-library-recent-item">
            <span class="livros-library-recent-main">
                <span class="livros-library-recent-title">{book.title}</span>
                <span class="livros-library-recent-author">{book.author}</span>
            </span>
            <span class="livros-library-recent-date">{formatDate(book.finishedOn) ?? "Em aberto"}</span>
        </li>
    )
}

function formatDate(value: string | null): string | null {
    if (value === null) {
        return null
    }

    const [year, month, day] = value.split("-")

    return `${day}/${month}/${year}`
}
