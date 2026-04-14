import { IErrorData } from "../domain/data/error-data.ts"

export default class ControllerService {
    public static getId = (parameter: string) => !isNaN(parseInt(parameter)) && isFinite(parseInt(parameter)) ? parseInt(parameter) : 0

    public static requestServer = async <TData extends IErrorData>(
        request: RequestInit,
        handleSuccess: (data: TData) => void,
        handleError: (errors: string[]) => void
    ) => {
        try {
            const response = await fetch("", request)
            if (response.ok) {
                const data: TData = await response.json()
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
}
