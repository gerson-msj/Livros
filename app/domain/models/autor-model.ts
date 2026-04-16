import { IModelValidation, IValidationResult } from "../validation/model-validation.ts"
import { ILivroModel } from "./livro-model.ts"
import ValidatorService from "@/app/services/validator-service.ts"

export interface IAutorModel extends IModelValidation<IAutorModel> {
    id: number
    nomeAutor: string

    livros?: ILivroModel[]
}

export const createAutor = (id?: number, nomeAutor?: string): IAutorModel => {
    return {
        id: id ?? 0,
        nomeAutor: nomeAutor ?? "",
        validationResults: []
    }
}

export const autorModelValidator = <k extends keyof IAutorModel>(
    model: IAutorModel,
    key?: k
): IValidationResult<IAutorModel>[] => {
    const results: IValidationResult<IAutorModel>[] = []

    if (ValidatorService.validateField("nomeAutor", key)) {
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
