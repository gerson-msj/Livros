import ILoginData from "../app/domain/data/login-data.ts"
import { createLoginModel, ILoginModel, loginModelValidator } from "../app/domain/models/login-model.ts"
import PageService from "@/app/services/page-service.ts"
import ValidatorService from "../app/services/validator-service.ts"
import Login from "../islands/login/login.tsx"
import { define } from "../utils.ts"
import { setCookie } from "@std/http/cookie"

export default define.page<typeof handler>((props) => <Login model={props.data.model!} />)

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
            return Response.json(data, { status: 400 })
        }

        try {
            const service = ctx.state.sp.get("loginService")
            const cookie = await service.login(model)
            const headers = new Headers()
            setCookie(headers, cookie)
            return new Response(null, { status: 200, headers })
        } catch (error) {
            data.errors = PageService.handleError(error)
            return Response.json(data, { status: 400 })
        }
    }
})
