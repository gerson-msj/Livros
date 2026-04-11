import { IAutorModel } from "../../../app/domain/models/autor-model.ts"
import { ISerieModel } from "../../../app/domain/models/serie-model.ts"
import Series from "../../../islands/series/series.tsx"
import { define } from "../../../utils.ts"

interface ISerieData {
    model?: ISerieModel[]
}

export default define.page<typeof handler>((props) => <Series model={props.data.model} />)

export const handler = define.handlers<ISerieData>({
    GET() {
        const autorA: IAutorModel = { id: 1, nomeAutor: "Autor A" }
        const autorB: IAutorModel = { id: 2, nomeAutor: "Autor B" }
        const series: ISerieModel[] = [
            {
                id: 1,
                nomeSerie: "Serie A",
                autor: autorA,
                livros: [
                    { id: 1, titulo: "Livro A", dataConclusao: "2026-01-01" },
                    { id: 2, titulo: "Livro B", dataConclusao: "2026-02-01" }
                ]
            },
            {
                id: 2,
                nomeSerie: "Serie B",
                autor: autorB,
                livros: [
                    { id: 3, titulo: "Livro C", dataConclusao: "2026-03-01" },
                    { id: 4, titulo: "Livro D", dataConclusao: "2026-04-01" }
                ]
            }
        ]

        const data: ISerieData = { model: series }
        return { data }
    }
})
