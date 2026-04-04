import { createLoginModel, ILoginModel, validateLoginModel } from "../app/domain/models/login-model.ts"
import Login from "../islands/login/login.tsx"
import { define } from "../utils.ts"

export interface ILoginData {
  model?: ILoginModel
  errMsg?: string
  chave?: string
}

export default define.page<typeof handler>((props) => {
  
  return (
    <>
      <h1 class="title">Livros - Login</h1>
      <Login model={props.data.model!} />
    </>
  )
})

export const handler = define.handlers<ILoginData>({
  GET() {
    const data: ILoginData = {
      model: createLoginModel()
    }

    return { data }
  },
  async POST(ctx) {
    const data: ILoginData = {}
    let status: number = 200 // OK

    const model: ILoginModel = await ctx.req.json()
    model.validationResults = validateLoginModel(model)
    if (model.validationResults.length > 0) {
      data.errMsg = "Dados inválidos"
      status = 400 // Requisição inválida
      return Response.json(data, { status })
    } else {
      // valida a existência do usuário
      // elimina sessões anteriores
      // cria uma sessão para o usuário
      // inclui a sessão em um cookie
      status = 204 // No Content
      return new Response(null, { status })

      // Se não localizar retorna 400 - Requisição inválida
    }
  }
})
