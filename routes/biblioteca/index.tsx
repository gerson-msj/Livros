import { IAutorModel } from "../../app/domain/models/autor-model.ts"
import { ILivroModel } from "../../app/domain/models/livro-model.ts"
import { ISerieModel } from "../../app/domain/models/serie-model.ts"
import { define } from "../../utils.ts"

interface IBibliotecaData {
  model: ILivroModel[]
}

export default define.page<typeof handler>((props) => {
  const { model } = props.data

  return (
    <>
      <h1 class="title">Biblioteca</h1>
      <div class="buttons">
        <a href="/biblioteca/livros" class="button is-dark is-responsive">Livros</a>
        <a href="/biblioteca/series" class="button is-dark is-responsive">Séries</a>
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
          {model.map((m, i) => {
            <tr key={i}>
              <td>{m.titulo}</td>
              <td>{m.autor?.nomeAutor ?? m.serie?.autor?.nomeAutor}</td>
              <td>{m.dataConclusao}</td>
            </tr>
          })}
        </tbody>
      </table>
    </>
  )
})

export const handler = define.handlers<IBibliotecaData>({
  GET() {
    const autor0: IAutorModel = { id: 0, nomeAutor: "Autor A" }
    const autor1: IAutorModel = { id: 1, nomeAutor: "Autor B" }
    const serie0: ISerieModel = { id: 0, nomeSerie: "Série C", autor: autor0 }
    const livros: ILivroModel[] = [
      { id: 0, titulo: "Livro D", serie: serie0, dataConclusao: "01/01/2026" },
      { id: 1, titulo: "Livro E", autor: autor1, dataConclusao: "01/01/2025" }
    ]

    const data: IBibliotecaData = {
      model: livros
    }

    return { data }
  }
})
