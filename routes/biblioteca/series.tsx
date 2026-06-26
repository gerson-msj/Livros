import { Head } from "fresh/runtime"
import { getSessionIdFromCookie } from "../../infraestrutura/session_cookie.ts"
import SeriesList, { type ListedSeries } from "../../islands/SeriesList.tsx"
import { define } from "../../utils.ts"

const mockSeries: ListedSeries[] = [
    {
        id: "serie-roda-do-tempo",
        name: "A Roda do Tempo",
        author: "Robert Jordan",
        createdAtLabel: "Cadastrada agora",
        books: [
            { title: "O Olho do Mundo", order: 1, readingStartedOn: "2026-01-04", readingFinishedOn: "2026-02-18" },
            { title: "A Grande Cacada", order: 2, readingStartedOn: "2026-03-02", readingFinishedOn: null },
            { title: "O Dragao Renascido", order: 3, readingStartedOn: null, readingFinishedOn: null }
        ]
    },
    {
        id: "serie-fundacao",
        name: "Fundacao",
        author: "Isaac Asimov",
        createdAtLabel: "Cadastrada ontem",
        books: [
            { title: "Fundacao", order: 1, readingStartedOn: "2025-11-10", readingFinishedOn: "2025-11-22" },
            { title: "Fundacao e Imperio", order: 2, readingStartedOn: "2025-12-01", readingFinishedOn: "2025-12-16" },
            { title: "Segunda Fundacao", order: 3, readingStartedOn: null, readingFinishedOn: null }
        ]
    },
    {
        id: "serie-terra-media",
        name: "O Senhor dos Aneis",
        author: "J. R. R. Tolkien",
        createdAtLabel: "Cadastrada semana passada",
        books: [
            { title: "A Sociedade do Anel", order: 1, readingStartedOn: "2025-09-08", readingFinishedOn: "2025-10-05" },
            { title: "As Duas Torres", order: 2, readingStartedOn: "2025-10-12", readingFinishedOn: "2025-11-09" },
            { title: "O Retorno do Rei", order: 3, readingStartedOn: null, readingFinishedOn: null }
        ]
    }
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
                series: mockSeries
            }
        }
    }
})

export default define.page<typeof handler>(function Series({ data }) {
    return (
        <section class="livros-books-page">
            <Head>
                <title>Series | Biblioteca</title>
            </Head>
            <SeriesList series={data.series} />
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
