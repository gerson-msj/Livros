import { useSignal } from "@preact/signals"
import { createLivro, ILivroModel, validateLivroModel } from "../app/domain/models/livro-model.ts"
import { IAutorModel } from "../app/domain/models/autor-model.ts"
import PesquisaAutor from "../components/pesquisa-autor.tsx"
import Input from "../components/input.tsx"
import InputDate from "../components/input-date.tsx"

interface LivroAddOptions {
    autores: IAutorModel[]
}

export default function LivroAdd(props: LivroAddOptions) {
    const model = useSignal(createLivro())
    const errMsgs = useSignal<string[]>([])

    const voltar = () => {
        globalThis.location.href = "/biblioteca/livros"
    }

    const onChange = <k extends keyof ILivroModel>(key: k, value: ILivroModel[k]) => {
        const changed = { ...model.value, [key]: value }
        const changedValidated = getModelValidated(changed, key)
        model.value = changedValidated
    }

    const getModelValidated = (model: ILivroModel, key?: keyof ILivroModel): ILivroModel => {
        const newValidations = validateLivroModel(model, "livro", key)
        const validationResults = [...model.validationResults.filter((r) => r.key !== key), ...newValidations]
        return { ...model, validationResults }
    }

    const validateAll = (): boolean => {
        const modelValidated = getModelValidated(model.value)
        model.value = modelValidated
        updateErrMsgs()
        return model.value.validationResults.length === 0
    }

    const updateErrMsgs = () => {
        errMsgs.value = model.value.validationResults.map((v) => v.message)
    }

    const classNames = (key: keyof ILivroModel) => {
        return model.value.validationResults.some((v) => v.key === key) ? "input is-danger" : "input"
    }

    return (
        <>
            <h1 class="title">Adicionar Livro</h1>
            <div class="buttons">
                <button type="button" class="button is-dark is-primary">Salvar</button>
                <button type="button" class="button is-dark" onClick={() => voltar()}>Voltar</button>
            </div>

            <Input
                label="Título"
                type="text"
                value={model.value.titulo}
                onChange={({ currentTarget: { value } }) => onChange("titulo", value)}
                placeholder="Informe o título do livro"
                class={classNames("titulo")}
            />

            <PesquisaAutor
                autor={model.value.autor}
                autores={props.autores}
                onChange={(autor) => onChange("autor", autor)}
                class={classNames("autor")}
            />

            <InputDate
                label="Data de conclusão"
                class={`${classNames("dataConclusao")} ${model.value.dataConclusao ? "" : "is-placeholder"}`}
                onChange={({ currentTarget: { value } }) => onChange("dataConclusao", value == "" ? undefined : value)}
            />
        </>
    )
}
