import { IErrorData } from "../../../app/domain/data/error-data.ts"
import { createAutor, IAutorModel } from "../../../app/domain/models/autor-model.ts"
import { ILivroModel, livroModelValidator } from "../../../app/domain/models/livro-model.ts"
import ControllerService from "../../../app/services/controller-service.ts"
import Livro from "../../../islands/livros/livro.tsx"
import { define } from "../../../utils.ts"

export interface ILivroData extends IErrorData {
    livro?: ILivroModel
    autores?: IAutorModel[]
}

export default define.page<typeof handler>((props) => <Livro livro={props.data.livro!} autores={props.data.autores ?? []} />)

export const handler = define.handlers({
    GET(ctx) {
        const id = ControllerService.getId(ctx.params.livro)

        // Obter livro novo ou existente
        const livro: ILivroModel = {
            id,
            titulo: "Título",
            autor: id === 0 ? undefined : { id: 1, nomeAutor: "Ana" }
        }

        // Obter autores somente para novos livros
        const autores: IAutorModel[] | undefined = id === 0
            ? [
                createAutor(1, "Ana"),
                createAutor(2, "Beto"),
                createAutor(3, "Carla"),
                createAutor(4, "Denis"),
                createAutor(5, "Edna")
            ]
            : undefined

        const data: ILivroData = { livro, autores }

        return { data }
    },
    async POST(ctx) {
        const id = ControllerService.getId(ctx.params.livro)

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
        const id = ControllerService.getId(ctx.params.id)
        console.log(id)

        // Realiza a exclusõe e retorna erros
        const data: ILivroData = {}

        return { data }
    }
})
