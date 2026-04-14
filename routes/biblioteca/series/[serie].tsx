import { IErrorData } from "../../../app/domain/data/error-data.ts"
import { createAutor, IAutorModel } from "../../../app/domain/models/autor-model.ts"
import { ISerieModel, serieModelValidatorFull } from "../../../app/domain/models/serie-model.ts"
import ControllerService from "../../../app/services/controller-service.ts"
import Serie from "../../../islands/series/serie.tsx"
import { define } from "../../../utils.ts"

interface ISerieData extends IErrorData {
    serie?: ISerieModel
    autores?: IAutorModel[]
}

export default define.page<typeof handler>((props) => <Serie serie={props.data.serie!} autores={props.data.autores} />)

export const handler = define.handlers({
    GET(ctx) {
        const id = ControllerService.getId(ctx.params.serie)

        // Obter serie nova ou existente
        const serie: ISerieModel = {
            id,
            nomeSerie: "Série",
            autor: id === 0 ? undefined : { id: 1, nomeAutor: "Autor" },
            livros: id === 0 ? undefined : [
                { id: 1, ordem: 1, titulo: "Livro 1", dataConclusao: "2026-01-01" },
                { id: 2, ordem: 2, titulo: "Livro 2" }
            ]
        }

        // Obter autores somente para nova serie
        const autores: IAutorModel[] | undefined = id === 0
            ? [
                createAutor(1, "Ana"),
                createAutor(2, "Beto"),
                createAutor(3, "Carla"),
                createAutor(4, "Denis"),
                createAutor(5, "Edna")
            ]
            : undefined

        const data: ISerieData = { serie, autores }

        return { data }
    },
    async POST(ctx) {
        const id = ControllerService.getId(ctx.params.serie)

        const model: ISerieModel = await ctx.req.json()

        const data: ISerieData = {
            errors: model.id !== id ? ["Dados inválidos"] : serieModelValidatorFull(model)
        }

        if (data.errors === undefined) {
            // Realiza a gravação e retorna erros
        }

        const status = data.errors === undefined ? 200 : 400
        return Response.json(data, { status })
    },
    DELETE(ctx) {
        const id = ControllerService.getId(ctx.params.serie)
        console.log(id)

        // Realiza a exclusõe e retorna erros
        const data: ISerieData = {}

        return { data }
    }
})
