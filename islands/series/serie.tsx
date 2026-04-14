import { useSignal, useSignalEffect } from "@preact/signals"
import { autorModelValidator, IAutorModel } from "../../app/domain/models/autor-model.ts"
import { ISerieModel, serieModelValidator, serieModelValidatorFull } from "../../app/domain/models/serie-model.ts"
import Input from "../../components/input.tsx"
import { getModelValidated, getValidationClass, modelToErrors } from "../../app/domain/validation/model-validation.ts"
import PesquisaAutor from "../../components/pesquisa-autor.tsx"
import { ILivroModel, livroModelValidator } from "../../app/domain/models/livro-model.ts"
import InputDate from "../../components/input-date.tsx"
import Validations from "../../components/Validations.tsx"
import Msgbox, { MsgboxOptions } from "../msgbox.tsx"
import ControllerService from "../../app/services/controller-service.ts"

export default function Serie(props: {
    serie: ISerieModel
    autores?: IAutorModel[]
}) {
    const model = useSignal(props.serie)
    const errMsgs = useSignal<string[]>([])
    const msgbox = useSignal<MsgboxOptions>({})
    const isEdit = model.value.id > 0

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
            ...livros.slice(index + 1)
        ]
        model.value = { ...model.value, livros }
        updateErrMsgs()
    }

    const updateErrMsgs = () => {
        const serieErrMsgs = modelToErrors(model.value)
        const autorErrMsgs = model.value.autor !== undefined ? modelToErrors(model.value.autor) : []
        const livrosErrMsgs = model.value.livros?.map<string[]>((livro) => modelToErrors(livro))?.flat() ?? []
        errMsgs.value = [...serieErrMsgs, ...autorErrMsgs, ...livrosErrMsgs]
    }

    const adicionar = () => {
        const livros = model.value.livros ?? []
        const index = livros.length
        if (livros.length > 0 && livros[index - 1].titulo.trim() === "") {
            return
        }

        const ordem = livros.length + 1
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

    const salvar = async () => {
        errMsgs.value = serieModelValidatorFull(model.value) ?? []
        if (errMsgs.value.length > 0) return

        const request: RequestInit = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(model.value)
        }

        await ControllerService.requestServer(
            request,
            () => {
                const title = isEdit ? "Série atualizada com sucesso" : "Série adicionada com sucesso"
                msgbox.value = { title, key: "salvar", isActive: true, ok: "Ok" }
            },
            (errors) => errMsgs.value = errors
        )
    }

    const voltar = () => {
        globalThis.location.href = "/biblioteca/series"
    }

    const excluir = async (confirmado: boolean = false) => {
        if (!confirmado) {
            msgbox.value = {
                title: "Deseja realmente excluir esta série?",
                ok: "Sim",
                cancel: "Não",
                key: "excluir",
                isActive: true
            }
            return
        }

        await ControllerService.requestServer(
            { method: "DELETE" },
            voltar,
            (errors) => errMsgs.value = errors
        )
    }

    useSignalEffect(() => {
        const ok = (msgbox.value.result !== undefined && msgbox.value.key === "salvar") ||
            (msgbox.value.result === "ok" && msgbox.value.key === "excluir")

        if (ok) {
            msgbox.value = { ...msgbox.value, result: undefined }
            voltar()
        }
    })

    return (
        <>
            <p class="title is-3">{isEdit ? "Editar" : "Adicionar"} Série</p>
            <div class="buttons">
                <button type="button" class="button is-dark is-primary" onClick={() => salvar()}>Salvar</button>
                <button type="button" class="button is-dark" onClick={() => voltar()}>Voltar</button>
                {isEdit && <button type="button" class="button is-dark is-danger" onClick={() => excluir()}>Excluir</button>}
            </div>

            <Input
                label="Série"
                type="text"
                value={model.value.nomeSerie}
                onChange={({ currentTarget: { value } }) => onChangeSerie("nomeSerie", value)}
                placeholder="Informe o nome da série"
                class={`input ${getValidationClass(model.value, "nomeSerie")}`}
                disabled={isEdit}
            />

            <PesquisaAutor
                autor={model.value.autor}
                autores={props.autores ?? []}
                onChange={(autor) => onChangeAutor(autor)}
                class={getValidationClass(model.value, "autor")}
                disabled={isEdit}
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
                                    disabled={isEdit}
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

            {!isEdit && (
                <div class="buttons">
                    <button type="button" class="button is-dark is-primary is-narrow" onClick={() => adicionar()}>Adicionar</button>
                </div>
            )}

            <Validations errMsgs={errMsgs.value} />
            <Msgbox options={msgbox} />
        </>
    )
}
