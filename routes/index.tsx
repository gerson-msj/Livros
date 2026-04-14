import { DbContext, DbPrefix } from "../app/domain/data-context/db-context.ts"
import UsuarioRepository from "../app/domain/data-context/repositories/usuario-repository.ts"
import ILoginData from "../app/domain/data/login-data.ts"
import { createLoginModel, ILoginModel, loginModelValidator } from "../app/domain/models/login-model.ts"
import ValidatorService from "../app/services/validator-service.ts"
import Login from "../islands/login/login.tsx"
import { define } from "../utils.ts"

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
        const model: ILoginModel = await ctx.req.json()

        const data: ILoginData = {
            errors: ValidatorService.getValidationErrors(loginModelValidator, model)
        }

        if (data.errors) {
            // Bad Requestion
            return Response.json(data, { status: 400 })
        }

        using dbContext = new DbContext()
        const usuarioRepository = new UsuarioRepository(dbContext)

        const userId = await usuarioRepository.novo(model, "nnnnn")
        const sessionId = crypto.randomUUID()
        const maxAge = 20 * 60 // 20 minutos em segundos
        const expireIn = maxAge * 1000 // 20 minutos em milissegundos
        const sessionPrefix: DbPrefix = "sessions"

        await dbContext.kv.set([sessionPrefix, sessionId], userId, { expireIn })

        const headers: HeadersInit = {
            "Set-Cookie": `session=${sessionId}; Max-Age=${maxAge}; HttpOnly; Path=/`
        }

        // No Content
        return new Response(null, { status: 204, headers })
    }
})
