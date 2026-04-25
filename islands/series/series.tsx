import { ISerieModel } from "../../app/domain/models/serie-model.ts"

export default function Series(props: { model: ISerieModel[] }) {
    return (
        <>
            <h1 class="title">Séries</h1>
            <div class="buttons">
                <a href="/biblioteca/series/nova" class="button is-dark is-primary">Adicionar Série</a>
                <a href="/biblioteca" class="button is-dark">Voltar</a>
            </div>

            <table class="table is-fullwidth is-hoverable">
                <tbody>
                    {props.model.length === 0 && (
                        <tr>
                            <td>
                                <p class="has-text-grey">Não existem séries cadastradas</p>
                            </td>
                        </tr>
                    )}
                    {props.model?.map((serie, serieIndex) => (
                        <>
                            <tr
                                key={`serie_${serieIndex}`}
                                class="is-clickable"
                                onClick={() => globalThis.location.href = `/biblioteca/series/${serie.id.toString()}`}
                            >
                                <td>
                                    <div class="columns mb-0 mt-1">
                                        <div class="column is-narrow">
                                            <p class="title is-5">
                                                {serie.nomeSerie}
                                            </p>
                                        </div>
                                        <div class="column is-align-content-center">
                                            <p class="subtitle is-6">
                                                {serie.autor?.nomeAutor}
                                            </p>
                                        </div>
                                    </div>
                                    {serie.livros?.map((livro, livroIndex) => (
                                        <div
                                            key={`serie_${serieIndex}_livro_${livroIndex}`}
                                            class="columns mb-1 ml-4"
                                        >
                                            <div class="column p-1">{livro.titulo}</div>
                                            <div class="column p-1">
                                                {livro.dataConclusao?.split("-").reverse().join("/")}
                                            </div>
                                        </div>
                                    ))}
                                </td>
                            </tr>
                        </>
                    ))}
                </tbody>
            </table>
        </>
    )
}
