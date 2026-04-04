import { IModelValidation, isValidISODate, IValidationResult, validateField } from "../validation/model-validation.ts"
import { IAutorModel, validateAutorModel } from "./autor-model.ts"
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

export const createLivro = (): ILivroModel => {
    return {
        id: 0,
        titulo: "",
        validationResults: []
    }
}

export const validateLivroModel = <k extends keyof ILivroModel>(
    model: ILivroModel,
    validateAs: "livro" | "serie",
    key?: k
): IValidationResult<ILivroModel>[] => {
    const results: IValidationResult<ILivroModel>[] = []

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

    if (validateField("autor", key) && validateAs == "livro") {
        if (!model.autor) {
            results.push({ key: "autor", message: "Autor não informado" })
        } else {
            const autorResults = validateAutorModel(model.autor)
            const mappedResults = autorResults.map<IValidationResult<ILivroModel>>((ar) => {
                return { key: "autor", message: ar.message }
            })
            results.push(...mappedResults)
        }
    }

    return results
}
