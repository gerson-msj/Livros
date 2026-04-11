import { IErrorData } from "../../../app/domain/data/error-data.ts"
import { IAutorModel } from "../../../app/domain/models/autor-model.ts"
import SerieAdd from "../../../islands/series/serie-add.tsx"
import { define } from "../../../utils.ts"

interface ISerieAddData extends IErrorData {
    autores?: IAutorModel[]
}

export default define.page<typeof handler>((props) => <SerieAdd autores={props.data.autores} />)

export const handler = define.handlers({
    GET() {
        const data: ISerieAddData = {
            autores: [
                { id: 1, nomeAutor: "Ana" },
                { id: 2, nomeAutor: "Beto" },
                { id: 3, nomeAutor: "Carla" },
                { id: 4, nomeAutor: "Denis" },
                { id: 5, nomeAutor: "Edna" }
            ]
        }

        return { data }
    }
})
