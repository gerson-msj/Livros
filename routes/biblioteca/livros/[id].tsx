import { Head } from "fresh/runtime"
import { StandaloneBookValidationError } from "../../../dominio/livros.ts"
import { getSessionIdFromCookie } from "../../../infraestrutura/session_cookie.ts"
import BookEditForm, { type EditableBook } from "../../../islands/BookEditForm.tsx"
import { define } from "../../../utils.ts"

interface EditBookPageData {
    book: EditableBook
}

export const handler = define.handlers({
    async GET(ctx) {
        const sessionId = getSessionIdFromCookie(ctx.req.headers)
        const session = sessionId ? await ctx.state.services.authentication.findActiveSession(sessionId) : null

        if (session === null) {
            return redirectToLogin()
        }

        const book = await ctx.state.services.books.findStandaloneBook(session.userId, ctx.params.id)

        if (book === null) {
            return redirectToBooks()
        }

        return {
            data: {
                book: {
                    id: book.id,
                    title: book.title,
                    author: book.author.name,
                    readingStartedOn: book.readingStartedOn,
                    readingFinishedOn: book.readingFinishedOn
                }
            }
        }
    },

    async POST(ctx) {
        const sessionId = getSessionIdFromCookie(ctx.req.headers)
        const session = sessionId ? await ctx.state.services.authentication.findActiveSession(sessionId) : null

        if (session === null) {
            return jsonResponse({ ok: false, messages: ["Sessao expirada. Entre novamente."] }, 401)
        }

        const form = await ctx.req.formData()

        try {
            const book = await ctx.state.services.books.updateStandaloneBookDates({
                userId: session.userId,
                bookId: ctx.params.id,
                readingStartedOn: form.get("readingStartedOn")?.toString() ?? "",
                readingFinishedOn: form.get("readingFinishedOn")?.toString() ?? ""
            })

            if (book === null) {
                return jsonResponse({ ok: false, messages: ["Livro nao encontrado na sua biblioteca."] }, 404)
            }

            return jsonResponse({
                ok: true,
                messages: [`As datas de "${book.title}" foram salvas.`],
                redirectTo: "/biblioteca/livros"
            })
        } catch (error) {
            if (error instanceof StandaloneBookValidationError) {
                return jsonResponse({
                    ok: false,
                    messages: error.issues.map((issue) => issue.message)
                }, 400)
            }

            throw error
        }
    },

    async DELETE(ctx) {
        const sessionId = getSessionIdFromCookie(ctx.req.headers)
        const session = sessionId ? await ctx.state.services.authentication.findActiveSession(sessionId) : null

        if (session === null) {
            return jsonResponse({ ok: false, messages: ["Sessao expirada. Entre novamente."] }, 401)
        }

        const book = await ctx.state.services.books.findStandaloneBook(session.userId, ctx.params.id)

        if (book === null) {
            return jsonResponse({ ok: false, messages: ["Livro nao encontrado na sua biblioteca."] }, 404)
        }

        const deleted = await ctx.state.services.books.deleteStandaloneBook(session.userId, ctx.params.id)

        if (!deleted) {
            return jsonResponse({ ok: false, messages: ["Livro nao encontrado na sua biblioteca."] }, 404)
        }

        return jsonResponse({
            ok: true,
            messages: [`"${book.title}" foi excluido da sua biblioteca.`],
            redirectTo: "/biblioteca/livros"
        })
    }
})

export default define.page<typeof handler>(function EditarLivro({ data }: { data: EditBookPageData }) {
    return (
        <section class="livros-book-form-route">
            <Head>
                <title>Editar livro | Biblioteca</title>
            </Head>
            <BookEditForm book={data.book} />
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

function redirectToBooks(): Response {
    const headers = new Headers()
    headers.set("location", "/biblioteca/livros")

    return new Response(null, {
        status: 303,
        headers
    })
}

function jsonResponse(body: unknown, status = 200): Response {
    return new Response(JSON.stringify(body), {
        status,
        headers: {
            "content-type": "application/json; charset=utf-8"
        }
    })
}
