import { ICadastroModel } from "../models/cadastro-model.ts"
import { IErrorData } from "./error-data.ts"

export interface ICadastroData extends IErrorData {
    model?: ICadastroModel
    chave?: string
}
