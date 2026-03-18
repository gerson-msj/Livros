import { Head } from "fresh/runtime"
import { define } from "../utils.ts"
import CadastroComponent from "../islands/login/CadastroComponent.tsx"

export default define.page(() => {
  return (
    <>
      <Head>
        <title>Cadastro</title>
      </Head>
      <div class="container mt-3">
        <div class="box">
          <h1 class="title">Cadastro</h1>
          <CadastroComponent />
        </div>
      </div>
    </>
  )
})
