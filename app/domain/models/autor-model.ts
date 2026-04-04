import { IModelValidation, IValidationResult, validateField } from "../validation/model-validation.ts"
import { ILivroModel } from "./livro-model.ts"

export interface IAutorModel extends IModelValidation<IAutorModel> {
    id: number
    nomeAutor: string

    livros?: ILivroModel[]
}

export const createAutor = (): IAutorModel => {
    return {
        id: 0,
        nomeAutor: "",
        validationResults: []
    }
}

export const validateAutorModel = <k extends keyof IAutorModel>(
    model: IAutorModel,
    key?: k
): IValidationResult<IAutorModel>[] => {
    const results: IValidationResult<IAutorModel>[] = []

    if (validateField("nomeAutor", key)) {
        const success = model.nomeAutor.trim().length >= 3
        if (!success) {
            results.push({
                key: "nomeAutor",
                message: "Autor inválido"
            })
        }
    }

    return results
}
