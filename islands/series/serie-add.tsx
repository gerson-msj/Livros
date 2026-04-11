import { useSignal } from "@preact/signals"
import { autorModelValidator, IAutorModel } from "../../app/domain/models/autor-model.ts"
import { ISerieModel, serieModelValidator } from "../../app/domain/models/serie-model.ts"
import Input from "../../components/input.tsx"
import { getErrMsgs, getModelValidated, getValidationClass } from "../../app/domain/validation/model-validation.ts"
import PesquisaAutor from "../../components/pesquisa-autor.tsx"
import { ILivroModel, livroModelValidator } from "../../app/domain/models/livro-model.ts"
import InputDate from "../../components/input-date.tsx"
import Validations from "../../components/Validations.tsx"

export default function SerieAdd(props: { autores?: IAutorModel[] }) {
    const model = useSignal<ISerieModel>({
        id: 0,
        nomeSerie: ""
    })

    const errMsgs = useSignal<string[]>([])

    const onChangeSerie = <k extends keyof ISerieModel>(key: k, value: ISerieModel[k]) => {
        const changed = { ...model.value, [key]: value }
        model.value = getModelValidated(serieModelValidator, changed, key)
        updateErrMsgs()
    }

    const onChangeAutor = (autor: IAutorModel) => {
        autor = getModelValidated(autorModelValidator, autor, "nomeAutor")
        model.value = { ...model.value, autor }
        updateErrMsgs()
    }

    const onChangeLivro = <k extends keyof ILivroModel>(index: number, key: k, value: ILivroModel[k]) => {
        let livros = model.value.livros ?? []
        const livro = livros[index]
        livro[key] = value
        const livroValidated = getModelValidated(livroModelValidator, livro, key)
        livroValidated.validationResults?.forEach((v) => v.index = index)
        livros = [
            ...livros.slice(0, index),
            livroValidated,
            ...livros.slice(index)
        ]
        model.value = { ...model.value, livros }
        updateErrMsgs()
    }

    const updateErrMsgs = () => {
        const serieErrMsgs = getErrMsgs(model.value)
        const autorErrMsgs = model.value.autor !== undefined ? getErrMsgs(model.value.autor) : []
        const livrosErrMsgs = model.value.livros?.map<string[]>((livro) => getErrMsgs(livro))?.flat() ?? []
        errMsgs.value = [...serieErrMsgs, ...autorErrMsgs, ...livrosErrMsgs]
    }

    const adicionar = () => {
        const index = (model.value.livros ?? []).length
        if (index > 0 && model.value.livros![index - 1].titulo.trim() === "") {
            return
        }

        const ordem = (model.value.livros?.length ?? 0) + 1
        model.value = {
            ...model.value,
            livros: [
                ...model.value.livros ?? [],
                {
                    id: 0,
                    titulo: "",
                    ordem
                }
            ]
        }
    }

    const salvar = () => {}
    const voltar = () => {}

    return (
        <>
            <p class="title is-3">Adicionar Série {(model.value.validationResults ?? []).length}</p>
            <div class="buttons">
                <button type="button" class="button is-dark is-primary" onClick={() => salvar()}>Salvar</button>
                <button type="button" class="button is-dark" onClick={() => voltar()}>Voltar</button>
            </div>

            {
                /**
                 * Serie
                 * Autor
                 * Livros da Série
                 * - linha
                 * - linha
                 * [Adicionar]
                 * validador
                 * msgbox
                 */
            }

            <Input
                label="Série"
                type="text"
                value={model.value.nomeSerie}
                onChange={({ currentTarget: { value } }) => onChangeSerie("nomeSerie", value)}
                placeholder="Informe o nome da série"
                class={`input ${getValidationClass(model.value, "nomeSerie")}`}
            />

            <PesquisaAutor
                autor={model.value.autor}
                autores={props.autores ?? []}
                onChange={(autor) => onChangeAutor(autor)}
                class={getValidationClass(model.value, "autor")}
            />

            <p class="subtitle is-4">Livros da Série</p>
            <table class="table">
                <thead>
                    <tr>
                        <th>Título</th>
                        <th>Data de conclusão</th>
                    </tr>
                </thead>
                <tbody>
                    {(model.value.livros ?? []).length === 0 && (
                        <tr>
                            <td colSpan={2}>
                                Nenhum livro foi adicionado
                            </td>
                        </tr>
                    )}
                    {model.value.livros?.map((livro, index) => (
                        <tr key={index}>
                            <td>
                                <Input
                                    label=""
                                    type="text"
                                    value={livro.titulo}
                                    onChange={({ currentTarget: { value } }) => onChangeLivro(index, "titulo", value)}
                                    placeholder="Informe o título do livro"
                                    class={`input ${getValidationClass(livro, "titulo")}`}
                                />
                            </td>
                            <td>
                                <InputDate
                                    label=""
                                    class={`input ${getValidationClass(livro, "dataConclusao")} ${
                                        livro.dataConclusao ? "" : "is-placeholder"
                                    }`}
                                    onChange={({ currentTarget: { value } }) =>
                                        onChangeLivro(index, "dataConclusao", value == "" ? undefined : value)}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div class="buttons">
                <button type="button" class="button is-dark is-primary is-narrow" onClick={() => adicionar()}>Adicionar</button>
            </div>

            <Validations errMsgs={errMsgs.value} />
        </>
    )
}
