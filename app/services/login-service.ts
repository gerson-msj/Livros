import ServiceBase from "./service-base.ts"
import { createSessionData, ISessionData } from "@/app/domain/data/session-data.ts"
import { ICadastroModel } from "@/app/domain/models/cadastro-model.ts"
import { Cookie } from "@std/http/cookie"
import { DbContext } from "@/app/data-context/db-context.ts"
import { ILoginModel } from "@/app/domain/models/login-model.ts"
import UsuarioRepository from "@/app/repositories/usuario-repository.ts"
import SessionRepository from "@/app/repositories/session-repository.ts"
import CryptService from "@/app/services/crypt-service.ts"
import { IRedefinirSenhaModel } from "@/app/domain/models/redefinir-senha-model.ts"
import { IUsuarioValue } from "@/app/domain/values/usuario-value.ts"

export default class LoginService extends ServiceBase {
    private usuarioRepository: UsuarioRepository
    private sessionRepository: SessionRepository

    constructor(
        dbContext: DbContext,
        usuarioRepository: UsuarioRepository,
        sessionRepository: SessionRepository
    ) {
        super(dbContext)
        this.usuarioRepository = usuarioRepository
        this.sessionRepository = sessionRepository
    }

    public async novoUsuarioLogado(
        model: ICadastroModel
    ): Promise<{ cookie: Cookie; chave: string }> {
        await this.dbContext.openDb()
        const { userId, chave, novoUsuarioOperation } = await this.usuarioRepository.novoUsuarioSetOperation(model)
        const { sessionData, sessionOperation } = this.createSession(userId)

        const operation = novoUsuarioOperation.enqueue(sessionOperation)
        const res = await operation.commit()
        if (!res.ok) {
            throw new Error("Não foi possível criar seu usuário, Tente Novamente.")
        }

        const cookie = this.createCookie(sessionData)
        return { cookie, chave }
    }

    public async validateSession(sessionId: string): Promise<ISessionData | undefined> {
        const sessionValue = await this.sessionRepository.getSession(sessionId)

        if (sessionValue === null) {
            return undefined
        }

        const currTime = (new Date()).getTime()
        const expireIn = sessionValue.expiresTime - currTime
        if (expireIn <= 0) {
            await this.sessionRepository.deleteSession(sessionId)
            return undefined
        }

        return {
            sessionId,
            userId: sessionValue.userId,
            expiresTime: sessionValue.expiresTime,
            expireIn,
            maxAge: Math.ceil(expireIn / 1000)
        }
    }

    public async login(model: ILoginModel): Promise<Cookie> {
        const usuarioValue = await this.tentarObterUsuario(model.usuario)
        const senhaValida = await CryptService.validarSenha(model.senha, usuarioValue.senha)
        if (!senhaValida) {
            throw new Error("A senha informada é inválida.")
        }

        const { sessionData, sessionOperation } = this.createSession(usuarioValue.id)

        const res = await sessionOperation.commit()
        if (!res.ok) {
            throw new Error("Não foi possível criar a sessão para este login, tente novamente.")
        }

        const cookie = this.createCookie(sessionData)
        return cookie
    }

    public async redefinirSenha(model: IRedefinirSenhaModel): Promise<{ cookie: Cookie; chave: string }> {
        await this.dbContext.openDb()
        const usuarioValue = await this.tentarObterUsuario(model.usuario)
        const chaveValida = await CryptService.validarSenha(model.chave, usuarioValue.chave)
        if (chaveValida !== true) {
            throw new Error("A chave informada é inválida.")
        }

        const { chave, redefinirSenhaOperation } = await this.usuarioRepository.redefinirSenhaSetOperation(usuarioValue, model.senha)
        const { sessionData, sessionOperation } = this.createSession(usuarioValue.id)

        const operation = redefinirSenhaOperation.enqueue(sessionOperation)
        const res = await operation.commit()
        if (!res.ok) {
            throw new Error("Não foi possível redefinir a senha, Tente Novamente.")
        }

        const cookie = this.createCookie(sessionData)
        return { cookie, chave }
    }

    private createCookie(sessionData: ISessionData): Cookie {
        return {
            name: "session",
            path: "/",
            httpOnly: true,
            maxAge: sessionData.maxAge,
            value: sessionData.sessionId
        }
    }

    private async tentarObterUsuario(usuario: string): Promise<IUsuarioValue> {
        const usuarioValue = await this.usuarioRepository.obterUsuario(usuario)
        if (usuarioValue === null) {
            throw new Error("Usuário inexistente.")
        }
        return usuarioValue
    }

    private createSession(userId: number): { sessionData: ISessionData; sessionOperation: Deno.AtomicOperation } {
        const sessionId = crypto.randomUUID()
        const sessionData: ISessionData = createSessionData(sessionId, userId)
        const sessionOperation = this.sessionRepository.sessionSetOperation(sessionData)
        return { sessionData, sessionOperation }
    }
}
