import { IAutorModel } from "../../../app/domain/models/autor-model.ts"
import LivroAdd from "../../../islands/livro-add.tsx"
import { define } from "../../../utils.ts"

interface ILivroAddData {
    autores: IAutorModel[]
}

export default define.page<typeof handler>((props) => {
    return (
        <>
            <LivroAdd autores={props.data.autores} />
        </>
    )
})

export const handler = define.handlers({
    GET() {
        const data: ILivroAddData = {
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
