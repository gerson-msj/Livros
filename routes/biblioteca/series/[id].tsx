import { Head } from "fresh/runtime"
import { getSessionIdFromCookie } from "../../../infraestrutura/session_cookie.ts"
import SeriesEditForm, { type EditableSeries } from "../../../islands/SeriesEditForm.tsx"
import { define } from "../../../utils.ts"

const mockSeries: EditableSeries = {
    id: "serie-roda-do-tempo",
    name: "A Roda do Tempo",
    author: "Robert Jordan",
    books: [
        { id: "olho-do-mundo", title: "O Olho do Mundo", readingStartedOn: "2026-01-04", readingFinishedOn: "2026-02-18" },
        { id: "grande-cacada", title: "A Grande Cacada", readingStartedOn: "2026-03-02", readingFinishedOn: null },
        { id: "dragao-renascido", title: "O Dragao Renascido", readingStartedOn: null, readingFinishedOn: null }
    ]
}

export const handler = define.handlers({
    async GET(ctx) {
        const sessionId = getSessionIdFromCookie(ctx.req.headers)
        const session = sessionId ? await ctx.state.services.authentication.findActiveSession(sessionId) : null

        if (session === null) {
            return redirectToLogin()
        }

        return {
            data: {
                series: {
                    ...mockSeries,
                    id: ctx.params.id
                }
            }
        }
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

function redirectToLogin(): Response {
    const headers = new Headers()
    headers.set("location", "/login")

    return new Response(null, {
        status: 303,
        headers
    })
}
