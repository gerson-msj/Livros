import ValidatorService from "../../services/validator-service.ts"
import { IModelValidation, IValidationResult } from "../validation/model-validation.ts"

export interface ICadastroModel extends IModelValidation<ICadastroModel> {
    usuario: string
    senha: string
}

export const createCadastroModel = (): ICadastroModel => {
    return {
        usuario: "",
        senha: "",
        validationResults: []
    }
}

export const cadastroModelValidator = <k extends keyof ICadastroModel>(
    model: ICadastroModel,
    key?: k
): IValidationResult<ICadastroModel>[] => {
    const results: IValidationResult<ICadastroModel>[] = []

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
