import RepositoryBase from "@/app/repositories/repository-base.ts"
import { DbContext } from "@/app/data-context/db-context.ts"
import { IAutorValue } from "@/app/domain/values/autor-value.ts"
import { IAutorModel } from "@/app/domain/models/autor-model.ts"

export default class AutorRepository extends RepositoryBase {
    constructor(dbContext: DbContext, userId: number) {
        super(dbContext, "autores", userId)
    }

    public async obterAutorPorId(id: number): Promise<IAutorValue | null> {
        const key = this.getKey(id)
        const res = await this.db.get<IAutorValue>(key)
        return res.value
    }

    public async obterAutores(): Promise<IAutorModel[]> {
        const key = this.getKey()
        const entries = this.db.list<IAutorValue>({ prefix: key })
        const result: IAutorModel[] = []
        for await (const entry of entries) {
            result.push({
                id: entry.value.id,
                nomeAutor: entry.value.nomeAutor
            })
        }
        return result
    }
}
