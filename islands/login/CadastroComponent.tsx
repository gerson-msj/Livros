import Login from "../../components/login/Login.tsx"
import Password from "../../components/login/Password.tsx"

export default function CadastroComponent() {
  return (
    <form>
      <Login />
      <Password />
      <div class="buttons">
        <button type="button" class="button is-primary">Cadastrar</button>
      </div>
    </form>
  )
}
