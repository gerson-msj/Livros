import UsuarioRepository from "../domain/data-context/repositories/usuario-repository.ts"
import { ILoginModel } from "../domain/models/login-model.ts"
import ServiceBase from "./service-base.ts"

export default class LoginService extends ServiceBase {
    private usuarioRepository: UsuarioRepository

    constructor() {
        super()
        this.usuarioRepository = new UsuarioRepository(this.dbContext)
    }
}
