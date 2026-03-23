import { IAutorModel } from "./autor-model.ts"
import { ILivroModel } from "./livro-model.ts"

export interface ISerieModel {
    id: number
    nomeSerie: string
    comentarios?: string
    autor?: IAutorModel
    livros?: ILivroModel[]
}