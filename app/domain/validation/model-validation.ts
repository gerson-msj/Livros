export interface IValidationResult<TModel> {
    key: keyof TModel
    message: string
    index?: number
}

export interface IModelValidation<TModel> {
    validationResults?: IValidationResult<TModel>[]
}
