import { ILivroModel } from "@/app/domain/models/livro-model.ts"
import { useSignal, useSignalEffect } from "@preact/signals"
import Msgbox, { MsgboxOptions } from "@/islands/msgbox.tsx"

export default function Biblioteca(props: { model: ILivroModel[] }) {
    const { model } = props
    const msgbox = useSignal<MsgboxOptions>({})

    useSignalEffect(() => {
        if (msgbox.value.result === "ok") {
            sair(true)
        }
    })

    const sair = async (confirmado: boolean) => {
        if (!confirmado) {
            msgbox.value = { title: "Deseja realmente sair?", ok: "Sim", cancel: "Não", isActive: true }
            return
        }

        const response = await fetch("", { method: "POST" })
        if (response.ok) {
            globalThis.location.href = "/"
        }
    }

    return (
        <>
            <p class="title is-3">Biblioteca</p>

            <div class="buttons">
                <a href="/biblioteca/livros" class="button is-dark is-responsive">Livros</a>
                <a href="/biblioteca/series" class="button is-dark is-responsive">Séries</a>
                <button type="button" class="button is-dark is-danger" onClick={() => sair(false)}>Sair</button>
            </div>
            <h3 class="subtitle">Leituras mais recentes</h3>
            <table class="table is-fullwidth">
                <thead>
                    <tr>
                        <th>Título</th>
                        <th>Autor</th>
                        <th>Conclusão</th>
                    </tr>
                </thead>
                <tbody>
                    {model.map((m, i) => (
                        <tr key={i}>
                            <td>{m.titulo}</td>
                            <td>{m.autor?.nomeAutor ?? m.serie?.autor?.nomeAutor}</td>
                            <td>{m.dataConclusao}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Msgbox options={msgbox} />
        </>
    )
}
