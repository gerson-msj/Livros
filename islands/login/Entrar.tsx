import Login from "../../components/login/Login.tsx"
import Password from "../../components/login/Password.tsx"

export default function Entrar() {
  return (
    <div class="container mt-3">
      <div class="box">
        <h1 class="title">Livros</h1>
        <form>
          <Login />
          <Password />
          <div class="buttons">
            <button type="button" class="button is-primary is-responsive">Entrar</button>
            <a href="/cadastro" class="button is-dark is-responsive">Cadastrar</a>
            <button type="button" class="button is-dark is-responsive">Recuperar Senha</button>
          </div>
        </form>
      </div>
    </div>
  )
}
