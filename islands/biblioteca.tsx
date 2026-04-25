import { Msgbox, MsgboxController } from "@/islands/msgbox.tsx"
import { useRef } from "preact/hooks"
import { IBibliotecaData } from "@/app/domain/data/biblioteca-data.ts"

export default function Biblioteca(props: IBibliotecaData) {
    const msgboxRef = useRef(new MsgboxController())
    const msgbox = msgboxRef.current

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
                    {props.model.map((m, i) => (
                        <tr key={i}>
                            <td>{m.titulo}</td>
                            <td>{m.autor?.nomeAutor ?? m.serie?.autor?.nomeAutor}</td>
                            <td>{m.dataConclusao?.split("-").reverse().join("/")}</td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan={3}>
                            <p class="subtitle is-4">
                                Total de livros concluídos: &nbsp;
                                <span class="has-text-success">
                                    {props.livrosLidos}
                                </span>
                            </p>
                        </td>
                    </tr>
                </tfoot>
            </table>

            <Msgbox controller={msgbox} />
        </>
    )
}
