import { define } from "../utils.ts"
import { cadastroModelValidator, createCadastroModel, ICadastroModel } from "../app/domain/models/cadastro-model.ts"
import Cadastro from "../islands/login/cadastro.tsx"
import { ICadastroData } from "../app/domain/data/cadastro-data.ts"
import ValidatorService from "../app/services/validator-service.ts"
import LoginService from "@/app/services/login-service.ts"
import { setCookie } from "@std/http/cookie"
import PageService from "@/app/services/page-service.ts"

export default define.page<typeof handler>((props) => <Cadastro model={props.data.model!} />)

export const handler = define.handlers<ICadastroData>({
    GET() {
        const data: ICadastroData = {
            model: createCadastroModel()
        }
        return { data }
    },
    async POST(ctx) {
        const model: ICadastroModel = await ctx.req.json()
        const data: ICadastroData = {
            errors: ValidatorService.getValidationErrors(cadastroModelValidator, model)
        }

        if (data.errors) {
            return Response.json(data, { status: 400 })
        }

        try {
            const service = await PageService.getService(ctx.state.sp, "loginService")
            const { cookie, chave } = await service.novoUsuarioLogado(model)
            const headers = new Headers()
            setCookie(headers, cookie)
            data.chave = chave
            return Response.json(data, { status: 200, headers })
        } catch (error) {
            data.errors = PageService.handleError(error)
            return Response.json(data, { status: 400 })
        }
    }
})
