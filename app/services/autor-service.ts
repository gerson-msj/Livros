import ServiceBase from "@/app/services/service-base.ts"
import DbOperation from "@/app/data-context/db-operation.ts"
import AutorRepository from "@/app/repositories/autor-repository.ts"
import { IAutorModel } from "@/app/domain/models/autor-model.ts"

export default class AutorService extends ServiceBase {
    private autorRepository: AutorRepository

    constructor(
        dbOperation: DbOperation,
        autorRepository: AutorRepository
    ) {
        super(dbOperation)
        this.autorRepository = autorRepository
    }

    public obterAutores(): Promise<IAutorModel[]> {
        return this.autorRepository.obterAutores()
    }
}
