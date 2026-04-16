import { IErrorData } from "@/app/domain/data/error-data.ts"
import { IRedefinirSenhaModel } from "@/app/domain/models/redefinir-senha-model.ts"

export interface IRedefinirSenhaData extends IErrorData {
    model?: IRedefinirSenhaModel
    chave?: string
}
