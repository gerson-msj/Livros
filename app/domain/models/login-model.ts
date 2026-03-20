import { IModelValidation, IValidationResult, validateField } from "../validation/model-validation.ts"

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

export const validateLoginModel = <k extends keyof ILoginModel>(
  model: ILoginModel,
  key?: k
): IValidationResult<ILoginModel>[] => {
  const results: IValidationResult<ILoginModel>[] = []

  if (validateField("usuario", key)) {
    const success = model.usuario.trim().length >= 3
    if (!success) {
      results.push({
        key: "usuario",
        message: "Usuário inválido"
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
