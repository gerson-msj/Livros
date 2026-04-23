import { useSignal } from "@preact/signals"
import { createAutor, IAutorModel } from "../app/domain/models/autor-model.ts"
import Input from "./input.tsx"
import Modal, { ModalController } from "@/islands/modal.tsx"

interface IPesquisaAutorProps {
    autor?: IAutorModel
    autores: IAutorModel[]
    onChange: (autor: IAutorModel) => void
    class: string
    disabled?: boolean
}

export default function PesquisaAutor(props: IPesquisaAutorProps) {
    const autor = useSignal(props.autor ?? createAutor())
    const autoresFiltrados = useSignal(props.autores)
    const pesquisa = useSignal("")
    const disabled = props.disabled ?? false
    const modal = new ModalController()

    const pesquisar = (value: string) => {
        pesquisa.value = value
        let result: IAutorModel[] = value.trim() != ""
            ? props.autores.filter((a) => a.nomeAutor.toLowerCase().trim().includes(value.trim().toLowerCase()))
            : props.autores

        if (result.length == 0) {
            result = [{ id: 0, nomeAutor: value, validationResults: [] }]
        }

        autoresFiltrados.value = result
    }

    const selecionar = (autorSelecionado: IAutorModel) => {
        autor.value = autorSelecionado
        props.onChange(autorSelecionado)
        modal.close()
        pesquisa.value = ""
    }

    const abrirPesquisa = async () => {
        if (disabled) return
        pesquisa.value = ""
        autoresFiltrados.value = props.autores
        await modal.open()
    }

    const teclasPermitidas = [
        "Tab",
        "Shift",
        "Control",
        "Alt",
        "Meta",
        "Escape",
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown"
    ]

    return (
        <>
            {disabled && (
                <Input
                    label="Autor"
                    value={props.autor?.nomeAutor}
                    class="input"
                    disabled
                />
            )}

            {!disabled && (
                <div class="field">
                    <label class="label">Autor</label>
                    <div class="control has-icons-right">
                        <input
                            type="text"
                            value={props.autor?.nomeAutor}
                            placeholder="Selecione um autor"
                            class="input"
                            readOnly
                            onKeyDown={(e) => {
                                if (teclasPermitidas.includes(e.key) || e.ctrlKey) return
                                e.preventDefault()
                                abrirPesquisa()
                            }}
                        />
                        <span class="icon is-small is-right is-clickable" onClick={() => abrirPesquisa()}>
                            <i class="fas fa-search"></i>
                        </span>
                    </div>
                </div>
            )}

            <Modal controller={modal}>
                <div class="card m-6">
                    <div class="card-content">
                        <div class="field">
                            <label class="label">Autores</label>
                            <div class="control has-icons-left">
                                <input
                                    type="text"
                                    class="input is-fullwidth"
                                    placeholder="Pesquisar"
                                    onInput={({ currentTarget: { value } }) => pesquisar(value)}
                                    value={pesquisa.value}
                                />
                                <span class="icon is-small is-left">
                                    <i class="fas fa-search"></i>
                                </span>
                            </div>
                        </div>
                        <aside class="menu">
                            <ul class="menu-list overfow">
                                {autoresFiltrados.value.map((autor, index) => (
                                    <li key={index} onClick={() => selecionar(autor)}>
                                        <a>{autor.nomeAutor}</a>
                                    </li>
                                ))}
                            </ul>
                        </aside>
                    </div>
                </div>
            </Modal>
        </>
    )
}
