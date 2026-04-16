import { useSignal, useSignalEffect } from "@preact/signals"
import { ILivroModel, livroModelValidator } from "../../app/domain/models/livro-model.ts"
import { IAutorModel } from "../../app/domain/models/autor-model.ts"
import PesquisaAutor from "../../components/pesquisa-autor.tsx"
import Input from "../../components/input.tsx"
import InputDate from "../../components/input-date.tsx"
import Validations from "../../components/Validations.tsx"
import { getModelValidated, getValidationClass, modelToErrors } from "../../app/domain/validation/model-validation.ts"
import Msgbox, { MsgboxOptions } from "../msgbox.tsx"
import PageService from "@/app/services/page-service.ts"

export default function Livro(props: {
    livro: ILivroModel
    autores: IAutorModel[]
}) {
    const model = useSignal(props.livro)
    const errMsgs = useSignal<string[]>([])
    const msgbox = useSignal<MsgboxOptions>({ ok: "Ok" })
    const isEdit = model.value.id > 0

    const voltar = () => {
        globalThis.location.href = "/biblioteca/livros"
    }

    useSignalEffect(() => {
        const ok = (msgbox.value.result !== undefined && msgbox.value.key === "salvar") ||
            (msgbox.value.result === "ok" && msgbox.value.key === "excluir")

        if (ok) {
            msgbox.value = { ...msgbox.value, result: undefined }
            voltar()
        }
    })

    const onChange = <k extends keyof ILivroModel>(key: k, value: ILivroModel[k]) => {
        const changed = { ...model.value, [key]: value }
        model.value = getModelValidated(livroModelValidator, changed, key)
        errMsgs.value = modelToErrors(model.value)
    }

    const salvar = async () => {
        model.value = getModelValidated(livroModelValidator, model.value)
        errMsgs.value = modelToErrors(model.value)
        if (errMsgs.value.length > 0) return

        const request: RequestInit = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(model.value)
        }

        await PageService.requestServer(
            request,
            () => {
                const title = isEdit ? "Livro atualizado com sucesso" : "Livro adicionado com sucesso"
                msgbox.value = { title, key: "salvar", isActive: true, ok: "Ok" }
            },
            (errors) => errMsgs.value = errors
        )
    }

    const excluir = async (confirmado: boolean = false) => {
        if (!confirmado) {
            msgbox.value = {
                title: "Deseja realmente excluir este livro?",
                ok: "Sim",
                cancel: "Não",
                key: "excluir",
                isActive: true
            }
            return
        }

        await PageService.requestServer(
            { method: "DELETE" },
            voltar,
            (errors) => errMsgs.value = errors
        )
    }

    return (
        <>
            <p class="title is-3">{isEdit ? "Editar" : "Adicionar"} Livro</p>
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

            <Msgbox options={msgbox} />
        </>
    )
}
