import { IModelValidation, IValidationResult } from "../domain/validation/model-validation.ts"

export default class ValidatorService<TModel extends IModelValidation<TModel>> {
    private _validator: (model: TModel, key?: keyof TModel) => IValidationResult<TModel>[]

    constructor(
        validator: (model: TModel, key?: keyof TModel) => IValidationResult<TModel>[]
    ) {
        this._validator = validator
    }

    public validateModel(model: TModel, key?: keyof TModel): TModel {
        const newValidations = this._validator(model, key)
        const results = [...model.validationResults?.filter((r) => r.key !== key) ?? [], ...newValidations]
        return { ...model, validationResults: results.length === 0 ? undefined : results }
    }

    public getValidationClass(model: TModel, key: keyof TModel) {
        return model.validationResults?.some((v) => v.key === key) ? "is-danger" : ""
    }

    /**
     * ### Verifica se um campo deve ou não ser validado.
     * @param field Chave do modelo
     * @param key Chave de validação
     * @returns Indicador para validação do campo
     */
    static validateField = <TModel extends IModelValidation<TModel>>(
        field: keyof TModel,
        key?: keyof TModel
    ) => {
        return !key || key === field
    }

    static clearValidations = <TModel extends IModelValidation<TModel>>(
        model: TModel,
        key?: keyof TModel
    ) => {
        model.validationResults = key ? [...model.validationResults?.filter((r) => r.key !== key) ?? []] : []
    }

    static isValidISODate(dateStr: string): boolean {
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

    static getModelValidated = <TModel extends IModelValidation<TModel>>(
        validator: (model: TModel, key?: keyof TModel) => IValidationResult<TModel>[],
        model: TModel,
        key?: keyof TModel
    ): TModel => {
        const newValidations = validator(model, key)
        const validationResults = [...model.validationResults?.filter((r) => r.key !== key) ?? [], ...newValidations]
        return { ...model, validationResults }
    }

    static getValidationClass = <TModel extends IModelValidation<TModel>>(
        model: TModel,
        key: keyof TModel
    ) => {
        return model.validationResults?.some((v) => v.key === key) ? "is-danger" : ""
    }

    /**
     * ### Realiza a validação do modelo
     * @param validator Validador a ser utilizado
     * @param model modelo ou lista de modelos para validação
     * @returns Lista em texto dos erros
     */
    static getValidationErrors = <TModel extends IModelValidation<TModel>>(
        validator: (model: TModel, key?: keyof TModel) => IValidationResult<TModel>[],
        model: TModel | TModel[]
    ): string[] | undefined => {
        let results: IValidationResult<TModel>[] = []
        if (Array.isArray(model)) {
            model.forEach((m, i) => {
                results = validator(m)
                results.forEach((r) => r.index = i)
            })
        } else {
            results = validator(model)
        }

        return results.length > 0 ? this.validationsToErrors(results) : undefined
    }

    static validationsToErrors = <TModel extends IModelValidation<TModel>>(
        validationResults: IValidationResult<TModel>[]
    ): string[] => {
        return validationResults.map((v) => {
            const line = v.index !== undefined ? ` na linha ${v.index + 1}` : ""
            return `${v.message}${line}`
        })
    }

    static modelToErrors = <TModel extends IModelValidation<TModel>>(
        model: TModel
    ): string[] => {
        return this.validationsToErrors(model.validationResults ?? [])
    }
}
