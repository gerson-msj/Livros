import { IRedefinirSenhaData } from "@/app/domain/data/redefinir-senha-data.ts"
import {
    createRedefinirSenhaModel,
    IRedefinirSenhaModel,
    redefinirSenhaModelValidator
} from "../app/domain/models/redefinir-senha-model.ts"
import RedefinirSenha from "../islands/login/redefinir-senha.tsx"
import { define } from "../utils.ts"
import ValidatorService from "@/app/services/validator-service.ts"
import PageService from "@/app/services/page-service.ts"
import { setCookie } from "@std/http/cookie"

export default define.page<typeof handler>((props) => <RedefinirSenha model={props.data.model!} />)

export const handler = define.handlers<IRedefinirSenhaData>({
    GET() {
        const data: IRedefinirSenhaData = {
            model: createRedefinirSenhaModel()
        }
        return { data }
    },
    async POST(ctx) {
        const model: IRedefinirSenhaModel = await ctx.req.json()

        const data: IRedefinirSenhaData = {
            errors: ValidatorService.getValidationErrors(redefinirSenhaModelValidator, model)
        }

        if (data.errors) {
            return Response.json(data, { status: 400 })
        }

        try {
            const service = await PageService.getService(ctx.state.sp, "loginService")
            const { cookie, chave } = await service.redefinirSenha(model)
            const headers = new Headers()
            setCookie(headers, cookie)
            data.chave = chave
            return Response.json(data, { status: 200 })
        } catch (error) {
            data.errors = PageService.handleError(error)
            return Response.json(data, { status: 400 })
        }
    }
})
