import { Head } from "fresh/runtime"
import SeriesList, { type ListedSeries } from "../../islands/SeriesList.tsx"
import { define } from "../../utils.ts"

export const handler = define.handlers({
    async GET(ctx) {
        const session = ctx.state.authenticatedSession!
        const series = await ctx.state.services.series.listBookSeries(session.userId)

        return {
            data: {
                series: series.map((item): ListedSeries => ({
                    id: item.id,
                    name: item.name,
                    author: item.author.name,
                    createdAtLabel: formatCreatedAtLabel(item.createdAt),
                    books: item.books.map((book) => ({
                        title: book.title,
                        order: book.seriesOrder,
                        readingStartedOn: book.readingStartedOn,
                        readingFinishedOn: book.readingFinishedOn
                    }))
                }))
            }
        }
    }
})

export default define.page<typeof handler>(function Series({ data }) {
    return (
        <section class="livros-books-page">
            <Head>
                <title>Séries | Biblioteca</title>
            </Head>
            <SeriesList series={data.series} />
        </section>
    )
})

function formatCreatedAtLabel(value: Date): string {
    return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short" }).format(value)
}
