import { define } from "@/utils.ts"
import Biblioteca from "@/islands/biblioteca.tsx"
import { IBibliotecaData } from "@/app/domain/data/biblioteca-data.ts"
import { deleteCookie } from "@std/http/cookie"
import PageService from "@/app/services/page-service.ts"

export default define.page<typeof handler>((props) => <Biblioteca {...props.data} />)

export const handler = define.handlers<IBibliotecaData>({
    async GET(ctx) {
        const data: IBibliotecaData = {
            model: [],
            livrosCadastrados: 0,
            livrosLidos: 0
        }

        try {
            const service = await PageService.getService(ctx.state.sp, "livroService")
            const livros = await service.obterLivros()
            const livrosLidos = livros
                .filter((l) => l.dataConclusao !== undefined)
                .sort((a, b) => b.dataConclusao!.localeCompare(a.dataConclusao!))
            const livrosRecentes = livrosLidos.slice(0, 10)

            data.model = livrosRecentes
            data.livrosCadastrados = livros.length
            data.livrosLidos = livrosLidos.length
        } catch (error) {
            data.errors = PageService.handleError(error)
        }

        return { data }
    },
    POST() {
        const headers = new Headers()
        deleteCookie(headers, "session")
        return new Response(null, { status: 201, headers })
    }
})
