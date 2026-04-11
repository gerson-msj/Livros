import { IModelValidation, isValidISODate, IValidationResult, validateField } from "../validation/model-validation.ts"
import { autorModelValidator, IAutorModel } from "./autor-model.ts"
import { ISerieModel } from "./serie-model.ts"

export interface ILivroModel extends IModelValidation<ILivroModel> {
    id: number
    titulo: string
    ordem?: number
    dataConclusao?: string
    comentarios?: string

    autor?: IAutorModel
    serie?: ISerieModel
}

export const createLivro = (id?: number, titulo?: string): ILivroModel => {
    return {
        id: id ?? 0,
        titulo: titulo ?? "",
        validationResults: []
    }
}

export const livroModelValidator = (
    model: ILivroModel,
    key?: keyof ILivroModel
): IValidationResult<ILivroModel>[] => {
    const results: IValidationResult<ILivroModel>[] = []
    const validateAsSerie = model.ordem !== undefined

    if (validateField("titulo", key)) {
        const success = model.titulo.trim().length >= 3
        if (!success) {
            results.push({
                key: "titulo",
                message: "Título inválido"
            })
        }
    }

    if (validateField("dataConclusao", key)) {
        const success = model.dataConclusao == undefined || isValidISODate(model.dataConclusao)
        if (!success) {
            results.push({
                key: "dataConclusao",
                message: "Data de conclusão inválida"
            })
        }
    }

    if (validateField("autor", key) && !validateAsSerie) {
        if (!model.autor) {
            results.push({ key: "autor", message: "Autor não informado" })
        } else {
            const autorResults = autorModelValidator(model.autor)
            const mappedResults = autorResults.map<IValidationResult<ILivroModel>>((ar) => {
                return { key: "autor", message: ar.message }
            })
            results.push(...mappedResults)
        }
    }

    return results
}
