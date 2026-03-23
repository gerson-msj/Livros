import { define } from "../../utils.ts"

export default define.page(() => {
  return (
    <>
      <h1 class="title">Biblioteca</h1>
      <div class="buttons">
        <a href="/biblioteca/livros" class="button is-dark is-responsive">Livros</a>
        <a href="/biblioteca/series" class="button is-dark is-responsive">Séries</a>
      </div>
      <h3 class="title">Leituras mais recentes</h3>
      <table>
        <thead>
          <tr>
            <th>Título</th>
            <th>Autor</th>
            <th>Conclusão</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </>
  )
})
