import { IValueBase } from "./value-base.ts"

export interface IUsuarioValue extends IValueBase {
    usuario: string
    senha: string
    chave: string
}
