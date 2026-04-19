import { ILivroModel } from "@/app/domain/models/livro-model.ts"
import { Msgbox, MsgboxController } from "@/islands/msgbox.tsx"

export default function Biblioteca(props: { model: ILivroModel[] }) {
    const { model } = props
    const msgbox = new MsgboxController()

    const sair = async () => {
        const result = await msgbox.open({ title: "Deseja realmente sair?", ok: "Sim", cancel: "Não" })
        if (result === "cancel") {
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
                <button type="button" class="button is-dark is-danger" onClick={() => sair()}>Sair</button>
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
            <Msgbox controller={msgbox} />
        </>
    )
}
