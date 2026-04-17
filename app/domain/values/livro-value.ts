import { IValueBase } from "@/app/domain/values/value-base.ts"

export interface ILivroValue extends IValueBase {
    titulo: string
    ordem?: number
    dataConclusao?: string

    idAutor?: number
    idSerie?: number
}
