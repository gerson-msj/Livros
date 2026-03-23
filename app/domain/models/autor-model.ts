import { ILivroModel } from "./livro-model.ts"

export interface IAutorModel {
    id: number
    nomeAutor: string

    livros?: ILivroModel[]
}