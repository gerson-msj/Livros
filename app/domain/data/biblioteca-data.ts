import { IErrorData } from "@/app/domain/data/error-data.ts"
import { ILivroModel } from "@/app/domain/models/livro-model.ts"

export interface IBibliotecaData extends IErrorData {
    model: ILivroModel[]
    livrosCadastrados: number
    livrosLidos: number
}
