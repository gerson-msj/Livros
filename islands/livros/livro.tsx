import { useSignal, useSignalEffect } from "@preact/signals"
import { createLivro, ILivroModel, livroModelValidator } from "../../app/domain/models/livro-model.ts"
import { IAutorModel } from "../../app/domain/models/autor-model.ts"
import PesquisaAutor from "../../components/pesquisa-autor.tsx"
import Input from "../../components/input.tsx"
import InputDate from "../../components/input-date.tsx"
import Validations from "../../components/Validations.tsx"
import { getErrMsgs, getModelValidated, getValidationClass } from "../../app/domain/validation/model-validation.ts"
import Msgbox, { MsgboxOptions } from "../msgbox.tsx"
import { ILivroData } from "../../routes/biblioteca/livros/[livro].tsx"

export default function Livro(props: {
    livro: ILivroModel
    autores: IAutorModel[]
}) {
    const model = useSignal(props.livro)
    const errMsgs = useSignal<string[]>([])
    const msgOptions = useSignal<MsgboxOptions>({ title: "Livro adicionado com sucesso!", ok: "Ok" })
    const isEdit = model.value.id > 0

    const voltar = () => {
        globalThis.location.href = "/biblioteca/livros"
    }

    useSignalEffect(() => {
        if (msgOptions.value.result !== undefined) {
            msgOptions.value = { ...msgOptions.value, result: undefined }
            voltar()
        }
    })

    const onChange = <k extends keyof ILivroModel>(key: k, value: ILivroModel[k]) => {
        const changed = { ...model.value, [key]: value }
        model.value = getModelValidated(livroModelValidator, changed, key)
        errMsgs.value = getErrMsgs(model.value)
    }

    const salvar = async () => {
        model.value = getModelValidated(livroModelValidator, model.value)
        errMsgs.value = getErrMsgs(model.value)
        if (errMsgs.value.length > 0) return

        const request: RequestInit = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(model.value)
        }

        try {
            const response = await fetch("", request)
            if (response.ok) {
                msgOptions.value = { ...msgOptions.value, isActive: true }
            } else {
                const data: { errMsg?: string } = await response.json()
                errMsgs.value = [data.errMsg ?? `Status: ${response.status}.`]
            }
        } catch (error) {
            const errMsg = "Falha de comunicação com o servidor"
            console.error(errMsg, error)
            errMsgs.value = [errMsg]
        }
    }

    const excluir = () => {}

    return (
        <>
            <h1 class="title">{isEdit ? "Editar" : "Adicionar"} Livro</h1>
            <div class="buttons">
                <button type="button" class="button is-dark is-primary" onClick={() => salvar()}>Salvar</button>
                <button type="button" class="button is-dark" onClick={() => voltar()}>Voltar</button>
                {isEdit && <button type="button" class="button is-dark is-danger" onClick={() => excluir()}>Excluir</button>}
            </div>

            <Input
                label="Título"
                type="text"
                value={model.value.titulo}
                onChange={({ currentTarget: { value } }) => onChange("titulo", value)}
                placeholder="Informe o título do livro"
                class={`input ${getValidationClass(model.value, "titulo")}`}
                disabled={isEdit}
            />

            <PesquisaAutor
                autor={model.value.autor}
                autores={props.autores}
                onChange={(autor) => onChange("autor", autor)}
                class={getValidationClass(model.value, "autor")}
                disabled={isEdit}
            />

            <InputDate
                label="Data de conclusão"
                class={`input ${getValidationClass(model.value, "dataConclusao")} ${model.value.dataConclusao ? "" : "is-placeholder"}`}
                onChange={({ currentTarget: { value } }) => onChange("dataConclusao", value == "" ? undefined : value)}
            />

            <Validations errMsgs={errMsgs.value} />

            <Msgbox options={msgOptions} />
        </>
    )
}
