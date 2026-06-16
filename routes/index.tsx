import { Head } from "fresh/runtime"
import { define } from "../utils.ts"

export default define.page(function Home() {
    return (
        <section class="section">
            <Head>
                <title>Livros</title>
            </Head>
            <div class="container">
                <h1 class="title">Livros</h1>
                <p class="subtitle">Controle simples de leituras e series.</p>
            </div>
        </section>
    )
})
