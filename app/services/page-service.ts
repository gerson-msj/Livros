import { IErrorData } from "../domain/data/error-data.ts"

export default class PageService {
    public static getId = (parameter: string) => !isNaN(parseInt(parameter)) && isFinite(parseInt(parameter)) ? parseInt(parameter) : 0

    public static requestPost = <TModel, TData>(
        model: TModel,
        handleSuccess: (data?: TData) => void,
        handleError: (errors: string[]) => void
    ) => {
        const request: RequestInit = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(model)
        }

        return this.requestServer(request, handleSuccess, handleError)
    }

    public static requestServer = async <TData>(
        request: RequestInit,
        handleSuccess: (data?: TData) => void,
        handleError: (errors: string[]) => void
    ) => {
        try {
            const response = await fetch("", request)
            if (response.ok) {
                const text = await response.text()
                const data: TData | undefined = text ? JSON.parse(text) : undefined
                handleSuccess(data)
            } else {
                const errorData: IErrorData = await response.json()
                handleError(errorData.errors ?? [`Status: ${response.status}.`])
            }
        } catch (error) {
            const errMsg = "Falha de comunicação com o servidor"
            console.error(errMsg, error)
            handleError([errMsg])
        }
    }

    public static handleError(error: unknown): string[] {
        console.error(error)
        const errMsg = error instanceof Error ? error.message : "Erro inesperado!"
        return [errMsg]
    }
}
