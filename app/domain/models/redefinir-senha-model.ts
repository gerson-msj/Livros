import { IModelValidation, IValidationResult, validateField } from "../validation/model-validation.ts"

export interface IRedefinirSenhaModel extends IModelValidation<IRedefinirSenhaModel> {
    usuario: string
    chave: string
    senha: string
}

export const createRedefinirSenhaModel = (): IRedefinirSenhaModel => {
    return {
        usuario: "",
        chave: "",
        senha: "",
        validationResults: []
    }
}

export const validateRedefinirSenhaModel = <k extends keyof IRedefinirSenhaModel>(
  model: IRedefinirSenhaModel,
  key?: k
): IValidationResult<IRedefinirSenhaModel>[] => {
  const results: IValidationResult<IRedefinirSenhaModel>[] = []

  if (validateField("usuario", key)) {
    const success = model.usuario.trim().length >= 3
    if (!success) {
      results.push({
        key: "usuario",
        message: "Usuário inválido"
      })
    }
  }

   if (validateField("chave", key)) {
    const success = model.chave.trim().length >= 4
    if (!success) {
      results.push({
        key: "chave",
        message: "Chave inválida"
      })
    }
  }

  if (validateField("senha", key)) {
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
