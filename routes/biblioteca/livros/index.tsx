import { IAutorModel } from "../../../app/domain/models/autor-model.ts"
import { ILivroModel } from "../../../app/domain/models/livro-model.ts"
import { define } from "../../../utils.ts"

interface ILivroData {
    model: ILivroModel[]
}

export default define.page<typeof handler>((props) => {
    const { model } = props.data
    return (
        <>
            <h1 class="title">Livros</h1>
            <div class="buttons">
                <a href="/biblioteca/livros/add" class="button is-dark is-primary">Adicionar Livro</a>
                <a href="/biblioteca" class="button is-dark">Voltar</a>
            </div>
            <table class="table is-fullwidth is-hoverable">
                <thead>
                    <tr>
                        <th>Título</th>
                        <th>Autor</th>
                        <th>Data de conclusão</th>
                    </tr>
                </thead>
                <tbody>
                    {model.map((m, i) => (
                        <tr key={i} class="is-clickable">
                            <td>{m.titulo}</td>
                            <td>{m.autor?.nomeAutor}</td>
                            <td>{m.dataConclusao}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    )
})

export const handler = define.handlers<ILivroData>({
    GET() {
        const autor0: IAutorModel = { id: 0, nomeAutor: "Autor A" }
        const autor1: IAutorModel = { id: 1, nomeAutor: "Autor B" }
        const livros: ILivroModel[] = [
            { id: 0, titulo: "Livro A", autor: autor0, dataConclusao: "01/01/2026" },
            { id: 1, titulo: "Livro B", autor: autor1, dataConclusao: "01/01/2025" }
        ]
        const data: ILivroData = {
            model: livros
        }
        return { data }
    }
})
