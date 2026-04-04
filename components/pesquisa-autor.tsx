import { useSignal } from "@preact/signals"
import { createAutor, IAutorModel } from "../app/domain/models/autor-model.ts"
import Modal, { ModalOptions } from "../islands/modal.tsx"

interface IPesquisaAutorProps {
    autor?: IAutorModel
    autores: IAutorModel[]
    onChange: (autor: IAutorModel) => void
    class: string
}

export default function PesquisaAutor(props: IPesquisaAutorProps) {
    const autor = useSignal(props.autor ?? createAutor())
    const modalOptions = useSignal<ModalOptions>({ isActive: false })
    const autoresFiltrados = useSignal(props.autores)
    const pesquisa = useSignal("")

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
        modalOptions.value = { ...modalOptions.value, isActive: false }
        pesquisa.value = ""
    }

    const abrirPesquisa = () => {
        pesquisa.value = ""
        autoresFiltrados.value = props.autores
        modalOptions.value = { ...modalOptions.value, isActive: true }
    }

    return (
        <>
            <div class="field">
                <label class="label">Autor</label>
                <div class="control has-icons-right">
                    <div
                        class={`${props.class} is-clickable ${props.autor ? "" : "is-placeholder"}`}
                        onClick={() => abrirPesquisa()}
                    >
                        {props.autor?.nomeAutor ?? "Selecione um autor"}
                    </div>
                    <span class="icon is-small is-right">
                        <i class="fas fa-search"></i>
                    </span>
                </div>
            </div>
            <Modal options={modalOptions}>
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
