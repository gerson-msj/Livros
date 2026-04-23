import { ILivroModel } from "../../app/domain/models/livro-model.ts"

export default function Livros(props: { model: ILivroModel[] }) {
    return (
        <>
            <h1 class="title">Livros</h1>
            <div class="buttons">
                <a href="/biblioteca/livros/novo" class="button is-dark is-primary">Adicionar Livro</a>
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
                    {props.model.map((m, i) => (
                        <tr
                            key={i}
                            class="is-clickable"
                            onClick={() => globalThis.location.href = `/biblioteca/livros/${m.id.toString()}`}
                        >
                            <td>{m.titulo}</td>
                            <td>{m.autor?.nomeAutor}</td>
                            <td>{m.dataConclusao?.split("-").reverse().join("/")}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    )
}
