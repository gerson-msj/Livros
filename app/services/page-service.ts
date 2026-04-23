import { IErrorData } from "../domain/data/error-data.ts"
import { ServiceMap, ServiceProvider } from "@/app/services/service-provider.ts"

export default class PageService {
    public static getId = (parameter: string) => !isNaN(parseInt(parameter)) && isFinite(parseInt(parameter)) ? parseInt(parameter) : 0

    // public static requestPost = <TModel, TData>(
    //     model: TModel,
    //     handleSuccess: (data?: TData) => void | Promise<void>,
    //     handleError: (errors: string[]) => void
    // ) => {
    //     const request: RequestInit = {
    //         method: "POST",
    //         headers: { "Content-Type": "application/json" },
    //         body: JSON.stringify(model)
    //     }

    //     return this.requestServer<TData>(
    //         request,
    //         async (data) => await handleSuccess(data),
    //         (errors) => handleError(errors)
    //     )
    // }

    // public static requestServer = async <TData>(
    //     request: RequestInit,
    //     handleSuccess: (data?: TData) => void | Promise<void>,
    //     handleError: (errors: string[]) => void
    // ) => {
    //     try {
    //         const response = await fetch("", request)
    //         if (response.ok) {
    //             if (response.status === 200) {
    //                 const data = await response.json()
    //                 await handleSuccess(data)
    //             } else {
    //                 await handleSuccess()
    //             }
    //         } else {
    //             const errorData: IErrorData = await response.json()
    //             handleError(errorData.errors ?? [`Status: ${response.status}.`])
    //         }
    //     } catch (error) {
    //         const errMsg = "Falha de comunicação com o servidor"
    //         console.error(errMsg, error)
    //         handleError([errMsg])
    //     }
    // }

    public static requestServerPost = <TData>(
        model: unknown
    ): Promise<TData | undefined> => {
        const request: RequestInit = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(model)
        }

        return this.requestServer<TData>(request)
    }

    public static requestServer = async <TData>(
        request: RequestInit
    ): Promise<TData | undefined> => {
        try {
            const response = await fetch("", request)
            if (response.ok) {
                if (response.status === 200) {
                    const data = await response.json()
                    return data
                } else {
                    return undefined
                }
            } else {
                const errorData: IErrorData = await response.json()
                throw new Error("RequestSeverError", { cause: errorData.errors })
            }
        } catch (error) {
            const err = error instanceof Error ? error as Error : undefined

            if (err !== undefined) {
                if (err.message !== "RequestSeverError") {
                    console.error("RequestServerError", error)
                    throw new Error("Falha de comunicação com o servidor")
                }
            }

            throw error
        }
    }

    public static handleError(error: unknown): string[] {
        const err = error instanceof Error ? error as Error : undefined
        const errors = this.isStringArray(err?.cause) ? err.cause : [err?.message ?? "Erro inesperado!"]
        return errors
    }

    private static isStringArray(value: unknown): value is string[] {
        return Array.isArray(value) && value.every((item) => typeof item === "string")
    }

    /**
     * ### Realiza a abertura do banco de dados antes de retornar um serviço.
     * @param sp Service Provider
     * @param key Chave do serviço
     * @returns Serviço obtido no service provider
     */
    public static async getService<k extends keyof ServiceMap>(sp: ServiceProvider, key: k): Promise<ServiceMap[k]> {
        await sp.get("dbContext").openDb()
        return sp.get(key)
    }
}
