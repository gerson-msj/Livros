export interface IValidationResult<TModel> {
  key: keyof TModel
  message: string
}

export interface IModelValidation<TModel> {
  validationResults: IValidationResult<TModel>[]
}

export const validateField = <TModel extends IModelValidation<TModel>>(
  field: keyof TModel,
  key?: keyof TModel
) => {
  return !key || key === field
}

export const clearValidations = <TModel extends IModelValidation<TModel>>(
  model: TModel,
  key?: keyof TModel
) => {
  model.validationResults = key ? [...model.validationResults.filter((r) => r.key !== key)] : []
}

export const getValidationErrorMessages = (...validationResults: IValidationResult<unknown>[]) => {
  return validationResults.flat().map((r) => r.message)
}
