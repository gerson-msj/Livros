export interface IValidationResult<TModel> {
    key: keyof TModel
    message: string
    index?: number
}

export interface IModelValidation<TModel> {
    validationResults?: IValidationResult<TModel>[]
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
    model.validationResults = key ? [...model.validationResults?.filter((r) => r.key !== key) ?? []] : []
}

// export const getValidationErrorMessages = (...validationResults: IValidationResult<unknown>[]) => {
//     return validationResults.flat().map((v) => {
//         const line = v.index !== undefined ? ` na linha ${v.index + 1}` : ""
//         return `${v.message}${line}`
//     })
// }

export function isValidISODate(dateStr: string): boolean {
    // 1. valida formato
    const regex = /^\d{4}-\d{2}-\d{2}$/
    if (!regex.test(dateStr)) return false

    // 2. quebra a data
    const [year, month, day] = dateStr.split("-").map(Number)

    // 3. cria data UTC (evita problemas de timezone)
    const date = new Date(Date.UTC(year, month - 1, day))

    // 4. valida se bate exatamente
    return (
        date.getUTCFullYear() === year &&
        date.getUTCMonth() === month - 1 &&
        date.getUTCDate() === day
    )
}

export const getModelValidated = <TModel extends IModelValidation<TModel>>(
    validator: (model: TModel, key?: keyof TModel) => IValidationResult<TModel>[],
    model: TModel,
    key?: keyof TModel
): TModel => {
    const newValidations = validator(model, key)
    const validationResults = [...model.validationResults?.filter((r) => r.key !== key) ?? [], ...newValidations]
    return { ...model, validationResults }
}

export const getValidationClass = <TModel extends IModelValidation<TModel>>(
    model: TModel,
    key: keyof TModel
) => {
    return model.validationResults?.some((v) => v.key === key) ? "is-danger" : ""
}

export const getErrMsgs = <TModel extends IModelValidation<TModel>>(
    model: TModel
): string[] => {
    return model.validationResults?.map((v) => {
        const line = v.index !== undefined ? ` na linha ${v.index + 1}` : ""
        return `${v.message}${line}`
    }) ?? []
}
