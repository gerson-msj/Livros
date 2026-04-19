import { IAutorModel } from "../../../app/domain/models/autor-model.ts"
import { ILivroModel } from "../../../app/domain/models/livro-model.ts"
import Livros from "../../../islands/livros/livros.tsx"
import { define } from "../../../utils.ts"

interface ILivroData {
    model: ILivroModel[]
}

export default define.page<typeof handler>((props) => <Livros model={props.data.model} />)

export const handler = define.handlers<ILivroData>({
    GET() {
        const autor1: IAutorModel = { id: 1, nomeAutor: "Autor A" }
        const autor2: IAutorModel = { id: 2, nomeAutor: "Autor B" }
        const livros: ILivroModel[] = [
            { id: 1, titulo: "Livro A", autor: autor1, dataConclusao: "01/01/2026" },
            { id: 2, titulo: "Livro B", autor: autor2, dataConclusao: "01/01/2025" }
        ]
        const data: ILivroData = {
            model: livros
        }
        return { data }
    }
})
