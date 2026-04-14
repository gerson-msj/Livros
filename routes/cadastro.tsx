import { define } from "../utils.ts"
import { cadastroModelValidator, createCadastroModel, ICadastroModel } from "../app/domain/models/cadastro-model.ts"
import Cadastro from "../islands/login/cadastro.tsx"
import { ICadastroData } from "../app/domain/data/cadastro-data.ts"
import ValidatorService from "../app/services/validator-service.ts"
import { DbContext } from "../app/domain/data-context/db-context.ts"
import UsuarioRepository from "../app/domain/data-context/repositories/usuario-repository.ts"

export default define.page<typeof handler>((props) => <Cadastro model={props.data.model!} />)

export const handler = define.handlers<ICadastroData>({
    GET() {
        debugger
        const data: ICadastroData = {
            model: createCadastroModel()
        }
        return { data }
    },
    async POST(ctx) {
        debugger
        const model: ICadastroModel = await ctx.req.json()
        const data: ICadastroData = {
            errors: ValidatorService.getValidationErrors(cadastroModelValidator, model)
        }

        if (data.errors) {
            return Response.json(data, { status: 400 })
        }

        using dbContext = new DbContext()
        const usuarioRepository = new UsuarioRepository(dbContext)
        data.chave = crypto.randomUUID()
        const sessionId = crypto.randomUUID()
        const expireIn = parseInt(Deno.env.get("SESSION_EXPIRES_IN_MINUTES") ?? "20")

        await usuarioRepository.novo(model, data.chave, sessionId, expireIn)

        const maxAge = 20 * 60 // expiresIn em segundos
        const headers: HeadersInit = {
            "Set-Cookie": `session=${sessionId}; Max-Age=${maxAge}; HttpOnly; Path=/`
        }

        return Response.json(data, { status: 200, headers })
    }
})
