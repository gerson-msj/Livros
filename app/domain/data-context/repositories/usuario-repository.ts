import CryptService from "../../../services/crypt-service.ts"
import { ICadastroModel } from "../../models/cadastro-model.ts"
import { DbContext } from "../db-context.ts"
import { IUsuarioValue } from "../values/usuario-value.ts"
import RepositoryBase from "./repository-base.ts"
import SessionRepository from "./session-repository.ts"

export default class UsuarioRepository extends RepositoryBase {
    private sessionRepository: SessionRepository

    constructor(dbContext: DbContext) {
        super(dbContext, "usuarios")
        this.sessionRepository = new SessionRepository(dbContext)
    }

    /**
     * ### Cria um novo usuário juntamente com o registro de sessão.
     * @param model Dados de cadastro
     * @param chave Chave de redefinição de senha
     * @param sessionId UUID da sessão
     * @param expiresIn Tempo, em **minutos**, para a expiração da sessão
     * @returns UserId
     */
    public async novo(
        model: ICadastroModel,
        chave: string,
        sessionId: string,
        expiresIn: number
    ): Promise<number> {
        const usuarioIdxKey = this.getIdxKey("usuarios:usuario_idx", model.usuario)
        const [seqRes, usuarioIdxRes] = await this.dbContext.kv.getMany<[number, number]>([
            this.seqKey,
            usuarioIdxKey
        ])

        if (usuarioIdxRes.value !== null) {
            throw new Error("O nome do usuário informado já está em uso.")
        }

        const userId = (seqRes.value ?? 0) + 1
        const key = this.getEntityKey(userId)
        const value: IUsuarioValue = {
            id: userId,
            usuario: model.usuario,
            senha: await CryptService.criptografarSenha(model.senha),
            chave
        }

        const sessionOperation = this.sessionRepository.getSessionSetOperation({ sessionId, expiresIn, userId })

        const atomicOperation = this.dbContext.kv.atomic()
            .check(seqRes, usuarioIdxRes)
            .set(this.seqKey, value.id) // Sequência
            .set(key, value) // Usuário
            .set(usuarioIdxKey, value.id) // Indice campo Usuario
            .enqueue(sessionOperation) // Sessão

        const res = await atomicOperation.commit()

        if (!res.ok) {
            throw new Error("Não foi possível criar seu usuário, Tente Novamente.")
        }

        return value.id
    }
}
