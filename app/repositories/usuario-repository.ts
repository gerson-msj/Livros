import RepositoryBase from "@/app/repositories/repository-base.ts"
import { DbContext } from "@/app/data-context/db-context.ts"
import { ICadastroModel } from "@/app/domain/models/cadastro-model.ts"
import { IUsuarioValue } from "@/app/domain/values/usuario-value.ts"
import CryptService from "@/app/services/crypt-service.ts"

export default class UsuarioRepository extends RepositoryBase {
    constructor(dbContext: DbContext) {
        super(dbContext, "usuarios")
    }

    public async novoUsuarioSetOperation(
        model: ICadastroModel
    ): Promise<{
        userId: number
        chave: string
        novoUsuarioOperation: Deno.AtomicOperation
    }> {
        const usuarioIdxKey = this.getIdxKey("usuarios:usuario_idx", model.usuario)
        const [seqRes, usuarioIdxRes] = await this.dbContext.kv.getMany<[number, number]>([
            this.seqKey,
            usuarioIdxKey
        ])

        if (usuarioIdxRes.value !== null) {
            throw new Error("O nome do usuário informado já está em uso.")
        }

        const userId = (seqRes.value ?? 0) + 1
        const chave = crypto.randomUUID()
        const key = this.getKey(userId)
        const value: IUsuarioValue = {
            id: userId,
            usuario: model.usuario,
            senha: await CryptService.criptografarSenha(model.senha),
            chave: await CryptService.criptografarSenha(chave)
        }

        const novoUsuarioOperation = this.dbContext.kv.atomic()
            .check(seqRes, usuarioIdxRes)
            .set(this.seqKey, userId) // Sequência
            .set(usuarioIdxKey, userId) // Indice campo Usuario
            .set(key, value) // Usuário

        return { userId, chave, novoUsuarioOperation }
    }

    public async obterUsuario(usuario: string): Promise<IUsuarioValue | null> {
        const idxKey = this.getIdxKey("usuarios:usuario_idx", usuario)
        await this.openDb()
        const idxRes = await this.kv.get<number>(idxKey)
        if (idxRes.value === null) {
            return null
        }
        const userId = idxRes.value
        const key = this.getKey(userId)
        const res = await this.kv.get<IUsuarioValue>(key)
        return res.value
    }

    public async redefinirSenhaSetOperation(
        usuarioValue: IUsuarioValue,
        senha: string
    ): Promise<{
        chave: string
        redefinirSenhaOperation: Deno.AtomicOperation
    }> {
        const chave = crypto.randomUUID()
        const key = this.getKey(usuarioValue.id)
        usuarioValue.chave = await CryptService.criptografarSenha(chave)
        usuarioValue.senha = await CryptService.criptografarSenha(senha)

        const redefinirSenhaOperation = this.dbContext.kv.atomic()
            .set(key, usuarioValue)

        return { chave, redefinirSenhaOperation }
    }
}
