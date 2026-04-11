import { clearValidations, getModelValidated, IModelValidation, IValidationResult, validateField } from "../validation/model-validation.ts"
import { autorModelValidator, IAutorModel } from "./autor-model.ts"
import { ILivroModel, livroModelValidator } from "./livro-model.ts"

export interface ISerieModel extends IModelValidation<ISerieModel> {
    id: number
    nomeSerie: string
    comentarios?: string
    autor?: IAutorModel
    livros?: ILivroModel[]
}

export function createSerieModel(): ISerieModel {
    return {
        id: 0,
        nomeSerie: ""
    }
}

export function serieModelValidator(model: ISerieModel, key?: keyof ISerieModel): IValidationResult<ISerieModel>[] {
    const results: IValidationResult<ISerieModel>[] = []

    if (validateField("nomeSerie", key)) {
        const success = model.nomeSerie.trim().length >= 3
        if (!success) {
            results.push({ key: "nomeSerie", message: "Nome da série inválido" })
        }
    }

    if (validateField("autor", key)) {
        const success = model.autor !== undefined
        if (!success) {
            results.push({ key: "autor", message: "Autor não informado" })
        }
        // else {
        //     model.autor = getModelValidated(autorModelValidator, model.autor!)
        //     const autorResults = model.autor.validationResults?.map<IValidationResult<ISerieModel>>((autorResult) => {
        //         return { key: "autor", message: autorResult.message }
        //     })
        //     results.push(...autorResults ?? [])
        // }
    }

    if (validateField("livros", key)) {
        const livros = model.livros ?? []

        const qtdMinima = livros.length ?? 0 >= 2
        const titulosUnicos = [...new Set(livros.map((l) => l.titulo.trim().toLowerCase()))]
        const livrosUnicos = titulosUnicos.length == livros.length

        const ordensUnicas = [...new Set(livros.map((l) => l.ordem ?? 0))]
        const ordemValida = ordensUnicas.length === livros.length &&
            Math.min(...ordensUnicas) === 1 &&
            Math.max(...ordensUnicas) === livros.length

        if (!qtdMinima) {
            results.push({ key: "livros", message: "A série deve ter no mínimo 2 livros cadastrados" })
        } else if (!livrosUnicos) {
            results.push({ key: "livros", message: "Existem títulos repetidos" })
        } else if (!ordemValida) {
            results.push({ key: "livros", message: "A ordenação dos livros é inválida" })
        }
    }

    return results
}
