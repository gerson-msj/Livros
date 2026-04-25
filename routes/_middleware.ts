import { define } from "@/utils.ts"
import { DbContext } from "@/app/data-context/db-context.ts"
import { getCookies } from "@std/http/cookie"
import LoginService from "@/app/services/login-service.ts"
import { ServiceProvider } from "@/app/services/service-provider.ts"
import SessionRepository from "@/app/repositories/session-repository.ts"
import UsuarioRepository from "@/app/repositories/usuario-repository.ts"
import LivroRepository from "@/app/repositories/livro-repository.ts"
import AutorRepository from "@/app/repositories/autor-repository.ts"
import SerieRepository from "@/app/repositories/serie-repository.ts"
import LivroService from "@/app/services/livro-service.ts"
import SerieService from "@/app/services/serie-service.ts"
import DbOperation from "@/app/data-context/db-operation.ts"
import AutorService from "@/app/services/autor-service.ts"

/**
 * ### Configura a injeção de dependência
 * - Disponibiliza o service provider no contexto
 */
const dependencyInjection = define.middleware(async (ctx) => {
    const sp = new ServiceProvider()

    const path = Deno.env.get("DBPATH")

    using dbContext = new DbContext(path)

    sp.registerInstance("dbContext", dbContext)
    sp.register("dbOperation", () =>
        new DbOperation(
            sp.get("dbContext")
        ))
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
            sp.get("usuarioRepository"),
            sp.get("sessionRepository")
        ))

    ctx.state.sp = sp
    return await ctx.next()
})

const userDependencyInjection = (sp: ServiceProvider, userId: number) => {
    sp.register("autorRepository", () =>
        new AutorRepository(
            sp.get("dbContext"),
            userId
        ))
    sp.register("livroRepository", () =>
        new LivroRepository(
            sp.get("dbContext"),
            userId
        ))
    sp.register("serieRepository", () =>
        new SerieRepository(
            sp.get("dbContext"),
            userId
        ))
    sp.register("autorService", () =>
        new AutorService(
            sp.get("dbOperation"),
            sp.get("autorRepository")
        ))
    sp.register("livroService", () =>
        new LivroService(
            sp.get("dbOperation"),
            sp.get("autorRepository"),
            sp.get("livroRepository"),
            sp.get("serieRepository")
        ))
    sp.register("serieService", () =>
        new SerieService(
            sp.get("dbOperation"),
            sp.get("autorRepository"),
            sp.get("livroRepository"),
            sp.get("serieRepository")
        ))
}

/**
 * ### Resgata e valida a sessão do usuário
 * - Disponibiliza a sessão no contexto
 */
const session = define.middleware(async (ctx) => {
    const cookies = getCookies(ctx.req.headers)
    const sessionId: string | undefined = cookies["session"]
    ctx.state.sessionData = undefined
    if (sessionId) {
        await ctx.state.sp.get("dbContext").openDb()
        const loginService: LoginService = ctx.state.sp.get("loginService")
        ctx.state.sessionData = await loginService.validateSession(sessionId)
        if (ctx.state.sessionData !== undefined && !ctx.req.url.includes("biblioteca")) {
            return Response.redirect(new URL("/biblioteca", ctx.req.url), 303)
        }

        if (ctx.state.sessionData !== undefined) {
            userDependencyInjection(ctx.state.sp, ctx.state.sessionData.userId)
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
