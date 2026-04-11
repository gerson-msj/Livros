import { useSignal, useSignalEffect } from "@preact/signals"
import { ILivroModel, livroModelValidator } from "../../app/domain/models/livro-model.ts"
import Input from "../../components/input.tsx"
import InputDate from "../../components/input-date.tsx"
import { getErrMsgs, getModelValidated, getValidationClass } from "../../app/domain/validation/model-validation.ts"
import Validations from "../../components/Validations.tsx"
import Msgbox, { MsgboxOptions } from "../msgbox.tsx"

export default function LivroEdit(props: { model: ILivroModel }) {
    const model = useSignal(props.model)
    const errMsgs = useSignal<string[]>([])
    const msgOptions = useSignal<MsgboxOptions>({ ok: "Ok" })

    const voltar = () => {
        globalThis.location.href = "/biblioteca/livros"
    }

    const onChange = <k extends keyof ILivroModel>(key: k, value: ILivroModel[k]) => {
        const changed = { ...model.value, [key]: value }
        model.value = getModelValidated(livroModelValidator, changed, key)
        errMsgs.value = getErrMsgs(model.value)
    }

    useSignalEffect(() => {
        if (msgOptions.value.result == "ok") {
            switch (msgOptions.value.key) {
                case "salvar":
                    voltar()
                    break
                case "excluir":
                    excluir(true)
                    break
                default:
                    break
            }
        }
    })

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
                msgOptions.value = {
                    ...msgOptions.value,
                    title: "Livro atualizado!",
                    key: "salvar",
                    isActive: true
                }
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

    const excluir = async (confirmado: boolean = false) => {
        if (!confirmado) {
            msgOptions.value = {
                ...msgOptions.value,
                title: "Deseja realmente excluir este livro?",
                ok: "Sim",
                cancel: "Não",
                key: "excluir",
                isActive: true
            }
            return
        }

        try {
            //const response = await fetch(`/biblioteca/livros/edit/${model.peek().id}`, { method: "DELETE" })
            const response = await fetch("", { method: "DELETE" })
            if (response.ok) {
                voltar()
            } else {
                const data: { errMsg?: string } = await response.json()
                errMsgs.value = [data.errMsg ?? `Status: ${response.status}.`]
            }
        } catch (error) {
            const errMsg = "Falha de comunicação com o servidor..."
            console.error(errMsg, error)
            errMsgs.value = [errMsg]
        }
    }

    return (
        <>
            <h1 class="title">Editar Livro</h1>
            <div class="buttons">
                <button type="button" class="button is-dark is-primary" onClick={() => salvar()}>Salvar</button>
                <button type="button" class="button is-dark" onClick={() => voltar()}>Voltar</button>
                <button type="button" class="button is-dark is-danger" onClick={() => excluir(false)}>Excluir</button>
            </div>

            <Input
                label="Título"
                type="text"
                value={model.value.titulo}
                class="input"
                disabled
            />

            <Input
                label="Autor"
                type="text"
                value={model.value.autor?.nomeAutor}
                class="input"
                disabled
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
