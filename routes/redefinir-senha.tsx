import { createRedefinirSenhaModel, IRedefinirSenhaModel, validateRedefinirSenhaModel } from "../app/domain/models/redefinir-senha-model.ts"
import RedefinirSenha from "../islands/login/redefinir-senha.tsx"
import { define } from "../utils.ts"

export interface IRedefinirSenhaData {
    model?: IRedefinirSenhaModel
    errMsg?: string
    chave?: string
}

export default define.page<typeof handler>((props) => {
    return (
        <>
            <h1 class="title">Livros - Redefinir Senha</h1>
            <form>
                <RedefinirSenha model={props.data.model!} />
            </form>
        </>
    )
})

export const handler = define.handlers<IRedefinirSenhaData>({
    GET() {
        const data: IRedefinirSenhaData = {
            model: createRedefinirSenhaModel()
        }
        return { data }
    },
    async POST(ctx) {
        const data: IRedefinirSenhaData = {}
        let status: number = 200 // OK

        const model: IRedefinirSenhaModel = await ctx.req.json()
        model.validationResults = validateRedefinirSenhaModel(model)
        if (model.validationResults.length > 0) {
            data.errMsg = "Dados inválidos"
            status = 400 // Bad Request
        } else {
            // Valida usuário e chave
            // Atera a senha
            // Cria uma nova chave e sessão para o usuário
            data.chave = "5678"
        }

        return Response.json(data, { status })
    }
})
