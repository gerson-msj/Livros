import { IErrorData } from "@/app/domain/data/error-data.ts"
import { ISerieModel } from "@/app/domain/models/serie-model.ts"
import { IAutorModel } from "@/app/domain/models/autor-model.ts"

export interface ISerieData extends IErrorData {
    serie?: ISerieModel
    autores?: IAutorModel[]
}
