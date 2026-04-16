import { define } from "@/utils.ts"
import { DbContext } from "@/app/data-context/db-context.ts"
import { getCookies } from "@std/http/cookie"
import LoginService from "@/app/services/login-service.ts"
import { ServiceProvider } from "@/app/services/service-provider.ts"
import SessionRepository from "@/app/repositories/session-repository.ts"
import UsuarioRepository from "@/app/repositories/usuario-repository.ts"

/**
 * ### Configura a injeção de dependência
 * - Disponibiliza o service provider no contexto
 */
const dependencyInjection = define.middleware(async (ctx) => {
    const sp = new ServiceProvider()
    using dbContext = new DbContext()

    sp.registerInstance("dbContext", dbContext)
    sp.register("sessionRepository", () =>
        new SessionRepository(
            sp.get("dbContext")
        ))
    sp.register("usuarioRepository", () =>
        new UsuarioRepository(
            sp.get("dbContext")
        ))
    sp.register("loginService", () =>
        new LoginService(
            sp.get("dbContext"),
            sp.get("usuarioRepository"),
            sp.get("sessionRepository")
        ))

    ctx.state.sp = sp
    return await ctx.next()
})

/**
 * ### Resgata e valida a sessão do usuário
 * - Disponibiliza a sessão no contexto
 */
const session = define.middleware(async (ctx) => {
    const cookies = getCookies(ctx.req.headers)
    const sessionId: string | undefined = cookies["session"]
    ctx.state.sessionData = undefined
    if (sessionId) {
        const loginService: LoginService = ctx.state.sp.get("loginService")
        ctx.state.sessionData = await loginService.validateSession(sessionId)
        if (ctx.state.sessionData !== undefined && !ctx.req.url.includes("biblioteca")) {
            return Response.redirect(new URL("/biblioteca", ctx.req.url), 303)
        }
    }

    const response = await ctx.next()

    /**
     * Para uma aplicação com maior segurança a renovação de sessão poderia ser aplicada aqui.
     * - Verificar o tempo restante da sessão
     * - Excluir a sessão anterior
     * - Criar uma nova sessão
     */

    return response
})

export default [
    dependencyInjection,
    session
]
