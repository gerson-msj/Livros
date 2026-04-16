import ValidatorService from "@/app/services/validator-service.ts"
import { IModelValidation, IValidationResult } from "../validation/model-validation.ts"

export interface IRedefinirSenhaModel extends IModelValidation<IRedefinirSenhaModel> {
    usuario: string
    chave: string
    senha: string
}

export const createRedefinirSenhaModel = (): IRedefinirSenhaModel => {
    return {
        usuario: "",
        chave: "",
        senha: ""
    }
}

export const redefinirSenhaModelValidator = <k extends keyof IRedefinirSenhaModel>(
    model: IRedefinirSenhaModel,
    key?: k
): IValidationResult<IRedefinirSenhaModel>[] => {
    const results: IValidationResult<IRedefinirSenhaModel>[] = []

    if (ValidatorService.validateField("usuario", key)) {
        const success = model.usuario.trim().length >= 3
        if (!success) {
            results.push({
                key: "usuario",
                message: "Usuário inválido"
            })
        }
    }

    if (ValidatorService.validateField("chave", key)) {
        const success = model.chave.trim().length >= 4
        if (!success) {
            results.push({
                key: "chave",
                message: "Chave inválida"
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
