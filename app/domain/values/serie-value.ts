import { IValueBase } from "@/app/domain/values/value-base.ts"

export interface ISerieValue extends IValueBase {
    nomeSerie: string
    idAutor: number
}
