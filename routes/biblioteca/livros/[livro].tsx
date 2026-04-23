import { IErrorData } from "../../../app/domain/data/error-data.ts"
import { IAutorModel } from "../../../app/domain/models/autor-model.ts"
import { ILivroModel, livroModelValidator } from "../../../app/domain/models/livro-model.ts"
import PageService from "@/app/services/page-service.ts"
import Livro from "../../../islands/livros/livro.tsx"
import { define } from "../../../utils.ts"
import ValidatorService from "@/app/services/validator-service.ts"

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

        const model: ILivroModel = await ctx.req.json()

        model.ordem = undefined

        const data: ILivroData = {
            errors: model.id !== id ? ["Dados inválidos"] : ValidatorService.getValidationErrors(livroModelValidator, model)
        }

        if (data.errors) {
            return Response.json(data, { status: 400 })
        }

        try {
            const service = await PageService.getService(ctx.state.sp, "livroService")
            if (id === 0) {
                await service.incluirLivro(model)
            } else {
                await service.atualizarDataConclusao(id, model.dataConclusao)
            }
            return Response.json(null, { status: 201 })
        } catch (error) {
            data.errors = PageService.handleError(error)
            return Response.json(data, { status: 400 })
        }
    },
    async DELETE(ctx) {
        const id = PageService.getId(ctx.params.livro)
        const data: ILivroData = {
            errors: id === 0 ? ["Dados inválidos"] : undefined
        }

        if (data.errors) {
            return Response.json(data, { status: 400 })
        }

        try {
            const service = await PageService.getService(ctx.state.sp, "livroService")
            await service.excluirLivro(id)
            return new Response(null, { status: 204 })
        } catch (error) {
            data.errors = PageService.handleError(error)
            return Response.json(data, { status: 400 })
        }
    }
})
