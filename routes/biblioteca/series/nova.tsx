import { Head } from "fresh/runtime"
import type { Author } from "../../../dominio/autores.ts"
import { BookSeriesValidationError, DuplicateBookSeriesError } from "../../../dominio/series.ts"
import type { SelectableAuthor } from "../../../islands/AuthorPicker.tsx"
import SeriesCreateForm from "../../../islands/SeriesCreateForm.tsx"
import { define } from "../../../utils.ts"

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
            const series = await ctx.state.services.series.createBookSeries({
                userId: session.userId,
                name: form.get("name")?.toString() ?? "",
                authorName: form.get("authorName")?.toString() ?? "",
                books: form.getAll("bookTitle").map((title, index) => ({
                    title: title.toString(),
                    readingStartedOn: form.getAll("bookReadingStartedOn")[index]?.toString() ?? "",
                    readingFinishedOn: form.getAll("bookReadingFinishedOn")[index]?.toString() ?? ""
                }))
            })

            return jsonResponse({
                ok: true,
                messages: [`"${series.name}" foi salva com ${series.books.length} livro(s).`],
                redirectTo: "/biblioteca/series"
            })
        } catch (error) {
            if (error instanceof BookSeriesValidationError) {
                return jsonResponse({
                    ok: false,
                    messages: error.issues.map((issue) => issue.message)
                }, 400)
            }

            if (error instanceof DuplicateBookSeriesError) {
                return jsonResponse({
                    ok: false,
                    messages: ["Ja existe uma serie com este nome e autor."]
                }, 400)
            }

            throw error
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
