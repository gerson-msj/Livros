import { Head } from "fresh/runtime"
import { type BookSeries, BookSeriesValidationError } from "../../../dominio/series.ts"
import SeriesEditForm, { type EditableSeries } from "../../../islands/SeriesEditForm.tsx"
import { define } from "../../../utils.ts"

export const handler = define.handlers({
    async GET(ctx) {
        const session = ctx.state.authenticatedSession!
        const series = await ctx.state.services.series.findBookSeries(session.userId, ctx.params.id)

        if (series === null) {
            return redirectToSeries()
        }

        return {
            data: {
                series: mapEditableSeries(series)
            }
        }
    },

    async POST(ctx) {
        const session = ctx.state.authenticatedSession!
        const form = await ctx.req.formData()

        try {
            const series = await ctx.state.services.series.updateBookSeriesDates({
                userId: session.userId,
                seriesId: ctx.params.id,
                books: form.getAll("bookId").map((bookId, index) => ({
                    bookId: bookId.toString(),
                    readingStartedOn: form.getAll("bookReadingStartedOn")[index]?.toString() ?? "",
                    readingFinishedOn: form.getAll("bookReadingFinishedOn")[index]?.toString() ?? ""
                }))
            })

            if (series === null) {
                return jsonResponse({ ok: false, messages: ["Serie nao encontrada na sua biblioteca."] }, 404)
            }

            return jsonResponse({
                ok: true,
                messages: [`As datas de "${series.name}" foram salvas.`],
                redirectTo: "/biblioteca/series"
            })
        } catch (error) {
            if (error instanceof BookSeriesValidationError) {
                return jsonResponse({
                    ok: false,
                    messages: error.issues.map((issue) => issue.message)
                }, 400)
            }

            throw error
        }
    },

    async DELETE(ctx) {
        const session = ctx.state.authenticatedSession!
        const series = await ctx.state.services.series.findBookSeries(session.userId, ctx.params.id)

        if (series === null) {
            return jsonResponse({ ok: false, messages: ["Serie nao encontrada na sua biblioteca."] }, 404)
        }

        const deleted = await ctx.state.services.series.deleteBookSeries(session.userId, ctx.params.id)

        if (!deleted) {
            return jsonResponse({ ok: false, messages: ["Serie nao encontrada na sua biblioteca."] }, 404)
        }

        return jsonResponse({
            ok: true,
            messages: [`"${series.name}" foi excluida da sua biblioteca.`],
            redirectTo: "/biblioteca/series"
        })
    }
})

export default define.page<typeof handler>(function EditarSerie({ data }) {
    return (
        <section class="livros-book-form-route">
            <Head>
                <title>Editar serie | Biblioteca</title>
            </Head>
            <SeriesEditForm series={data.series} />
        </section>
    )
})

function mapEditableSeries(series: BookSeries): EditableSeries {
    return {
        id: series.id,
        name: series.name,
        author: series.author.name,
        books: series.books.map((book) => ({
            id: book.id,
            title: book.title,
            readingStartedOn: book.readingStartedOn,
            readingFinishedOn: book.readingFinishedOn
        }))
    }
}

function redirectToSeries(): Response {
    const headers = new Headers()
    headers.set("location", "/biblioteca/series")

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
