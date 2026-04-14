import ValidatorService from "../../services/validator-service.ts"
import { IModelValidation, IValidationResult } from "../validation/model-validation.ts"

export interface ILoginModel extends IModelValidation<ILoginModel> {
    usuario: string
    senha: string
}

export const createLoginModel = (): ILoginModel => {
    return {
        usuario: "",
        senha: "",
        validationResults: []
    }
}

export const loginModelValidator = <k extends keyof ILoginModel>(
    model: ILoginModel,
    key?: k
): IValidationResult<ILoginModel>[] => {
    const results: IValidationResult<ILoginModel>[] = []

    if (ValidatorService.validateField("usuario", key)) {
        const success = model.usuario.trim().length >= 3
        if (!success) {
            results.push({
                key: "usuario",
                message: "Usuário inválido"
            })
        }
    }

    if (ValidatorService.validateField("senha", key)) {
        const success = model.senha.trim().length >= 3
        if (!success) {
            results.push({
                key: "senha",
                message: "Senha inválida"
            })
        }
    }

    return results
}
