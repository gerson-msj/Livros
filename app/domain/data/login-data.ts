import { ILoginModel } from "../models/login-model.ts"
import { IErrorData } from "./error-data.ts"

export default interface ILoginData extends IErrorData {
    model?: ILoginModel
    chave?: string
}
