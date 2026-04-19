import { IErrorData } from "../../../app/domain/data/error-data.ts"
import { IAutorModel } from "../../../app/domain/models/autor-model.ts"
import { ILivroModel, livroModelValidator } from "../../../app/domain/models/livro-model.ts"
import PageService from "@/app/services/page-service.ts"
import Livro from "../../../islands/livros/livro.tsx"
import { define } from "../../../utils.ts"

export interface ILivroData extends IErrorData {
    livro?: ILivroModel
    autores?: IAutorModel[]
}

export default define.page<typeof handler>((props) => <Livro data={props.data} />)

export const handler = define.handlers({
    async GET(ctx) {
        const id = PageService.getId(ctx.params.livro)

        await ctx.state.sp.get("dbContext").openDb()
        const livroService = ctx.state.sp.get("livroService")
        const autorRepository = ctx.state.sp.get("autorRepository")

        const data: ILivroData = {}

        try {
            data.livro = await livroService.obterLivroPorId(id)
            data.autores = id === 0 ? await autorRepository.obterAutores() : []
        } catch (error) {
            data.errors = PageService.handleError(error)
        }

        return { data }
    },
    async POST(ctx) {
        const id = PageService.getId(ctx.params.livro)

        const data: ILivroData = {}
        let status: number = 200

        const model: ILivroModel = await ctx.req.json()
        model.ordem = undefined
        model.validationResults = livroModelValidator(model)
        if (model.validationResults.length > 0 || model.id !== id) {
            data.errors = ["Dados inválidos"]
            status = 400
        }

        // realiza a gravação e retorna possíveis erros.

        return Response.json(data, { status })
    },
    DELETE(ctx) {
        const id = PageService.getId(ctx.params.id)
        console.log(id)

        // Realiza a exclusõe e retorna erros
        const data: ILivroData = {}

        return { data }
    }
})
