import { define } from "../utils.ts"
import { createCadastroModel, ICadastroModel, validateCadastroModel } from "../app/domain/models/cadastro-model.ts"
import Cadastro from "../islands/login/cadastro-component.tsx"

export interface ICadastroData {
  model?: ICadastroModel
  errMsg?: string
  chave?: string
}

export default define.page<typeof handler>((props) => {
  return (
    <>
      <h1 class="title">Livros - Cadastro</h1>
      <Cadastro model={props.data.model!} />
    </>
  )
})

export const handler = define.handlers<ICadastroData>({
  GET() {
    const data: ICadastroData = {
      model: createCadastroModel()
    }
    return { data }
  },
  async POST(ctx) {
    const data: ICadastroData = {}
    let status: number = 200 // OK

    const model: ICadastroModel = await ctx.req.json()
    model.validationResults = validateCadastroModel(model)
    if (model.validationResults.length > 0) {
      data.errMsg = "Dados inválidos"
      status = 400 // Bad Request
    } else {
      // realiza a criação do usuário
      // retorna a chave em caso positivo ou novo errMsg
      // cria uma sessão para o novo usuário
      // inclui a sessão em um cookie
      data.chave = "1234"
    }

    return Response.json(data, { status })
  }
})
