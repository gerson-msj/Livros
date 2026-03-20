import { Head } from "fresh/runtime"
import RecuperarSenhaComponent from "../islands/login/RecuperarSenhaComponent.tsx"
import { define } from "../utils.ts"

export default define.page(() => {
  return (
    <>
      <Head>
        <title>Recuperar Senha</title>
      </Head>
      <h1 class="title">Recuperar Senha</h1>
      <form>
        <RecuperarSenhaComponent />
      </form>
    </>
  )
})
