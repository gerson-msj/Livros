import { IAutorModel } from "./autor-model.ts"
import { ISerieModel } from "./serie-model.ts"

export interface ILivroModel {
    id: number
    titulo: string
    ordem?: number
    dataConclusao?: string
    comentarios?: string

    autor?: IAutorModel
    serie?: ISerieModel
}