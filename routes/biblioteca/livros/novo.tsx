import { Head } from "fresh/runtime"
import type { Author } from "../../../dominio/autores.ts"
import { DuplicateStandaloneBookError, StandaloneBookValidationError } from "../../../dominio/livros.ts"
import BookCreateForm from "../../../islands/BookCreateForm.tsx"
import type { SelectableAuthor } from "../../../islands/AuthorPicker.tsx"
import { define } from "../../../utils.ts"

interface NewBookPageData {
    authors: SelectableAuthor[]
}

export const handler = define.handlers({
    async GET(ctx) {
        const session = ctx.state.authenticatedSession!
        const authors = await ctx.state.services.authors.listAuthors(session.userId)

        return {
            data: {
                authors: authors.map(mapAuthor)
            }
        }
    },

    async POST(ctx) {
        const session = ctx.state.authenticatedSession!
        const form = await ctx.req.formData()

        try {
            const book = await ctx.state.services.books.createStandaloneBook({
                userId: session.userId,
                title: form.get("title")?.toString() ?? "",
                authorName: form.get("authorName")?.toString() ?? "",
                readingStartedOn: form.get("readingStartedOn")?.toString() ?? "",
                readingFinishedOn: form.get("readingFinishedOn")?.toString() ?? ""
            })

            return jsonResponse({
                ok: true,
                messages: [`"${book.title}" foi salvo na sua biblioteca.`],
                redirectTo: "/biblioteca/livros"
            })
        } catch (error) {
            if (error instanceof StandaloneBookValidationError) {
                return jsonResponse({
                    ok: false,
                    messages: error.issues.map((issue) => issue.message)
                }, 400)
            }

            if (error instanceof DuplicateStandaloneBookError) {
                return jsonResponse({
                    ok: false,
                    messages: ["Ja existe um livro com este titulo e autor."]
                }, 400)
            }

            throw error
        }
    }
})

export default define.page<typeof handler>(function NovoLivro({ data }: { data: NewBookPageData }) {
    return (
        <section class="livros-book-form-route">
            <Head>
                <title>Novo livro | Biblioteca</title>
            </Head>
            <BookCreateForm authors={data.authors} />
        </section>
    )
})

function mapAuthor(author: Author): SelectableAuthor {
    return {
        id: author.id,
        name: author.name
    }
}

function jsonResponse(body: unknown, status = 200): Response {
    return new Response(JSON.stringify(body), {
        status,
        headers: {
            "content-type": "application/json; charset=utf-8"
        }
    })
}
