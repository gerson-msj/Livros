import { useSignal } from "@preact/signals"
import { createLivro, ILivroModel, livroModelValidator } from "../../app/domain/models/livro-model.ts"
import PesquisaAutor from "../../components/pesquisa-autor.tsx"
import Input from "../../components/input.tsx"
import InputDate from "../../components/input-date.tsx"
import Validations from "../../components/Validations.tsx"
import PageService from "@/app/services/page-service.ts"
import ValidatorService from "@/app/services/validator-service.ts"
import { ILivroData } from "@/routes/biblioteca/livros/[livro].tsx"
import { Msgbox, MsgboxController } from "@/islands/msgbox.tsx"
import { useEffect } from "preact/hooks"

export default function Livro(props: { data: ILivroData }) {
    const model = useSignal<ILivroModel>(props.data.livro ?? createLivro())
    const errMsgs = useSignal<string[]>([])
    const isEdit = model.value.id > 0
    const validator = new ValidatorService(livroModelValidator, model.value)
    const msgbox = new MsgboxController()

    const onChange = <k extends keyof ILivroModel>(key: k, value: ILivroModel[k]) => {
        const changed = { ...model.value, [key]: value }
        model.value = validator.validateChanged(changed, key)
        updateErrMsgs()
    }

    const updateErrMsgs = () => {
        errMsgs.value = model.value.validationResults?.map((v) => v.message) ?? []
    }

    const salvar = async () => {
        model.value = validator.validateModel()
        updateErrMsgs()
        if (model.value.validationResults !== undefined) {
            return
        }

        await PageService.requestPost(
            model.value,
            async () => {
                const title = isEdit ? "Livro atualizado com sucesso" : "Livro adicionado com sucesso"
                await msgbox.open({ title, ok: "Ok" })
                voltar()
            },
            (errors) => errMsgs.value = errors
        )
    }

    const excluir = async () => {
        const result = await msgbox.open({
            title: "Deseja realmente excluir este livro?",
            ok: "Sim",
            cancel: "Não"
        })

        if (result === "cancel") {
            return
        }

        await PageService.requestServer(
            { method: "DELETE" },
            voltar,
            (errors) => errMsgs.value = errors
        )
    }

    const voltar = () => {
        globalThis.location.href = "/biblioteca/livros"
    }

    useEffect(() => {
        if (props.data.errors !== undefined) {
            msgbox.open({ title: props.data.errors![0], ok: "Ok" }).finally(() => voltar())
        }
    }, [props.data.errors])

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
                class={`input ${validator.class("titulo")}`}
                disabled={isEdit}
            />

            <PesquisaAutor
                autor={model.value.autor}
                autores={props.data.autores ?? []}
                onChange={(autor) => onChange("autor", autor)}
                class={validator.class("autor")}
                disabled={isEdit}
            />

            <InputDate
                label="Data de conclusão"
                class={`input ${validator.class("dataConclusao")} ${model.value.dataConclusao ? "" : "is-placeholder"}`}
                onChange={({ currentTarget: { value } }) => onChange("dataConclusao", value == "" ? undefined : value)}
            />

            <Validations errMsgs={errMsgs.value} />

            <Msgbox controller={msgbox} />
        </>
    )
}
