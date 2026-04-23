import RepositoryBase from "@/app/repositories/repository-base.ts"
import { DbContext } from "@/app/data-context/db-context.ts"
import { ISerieValue } from "@/app/domain/values/serie-value.ts"

export default class SerieRepository extends RepositoryBase {
    constructor(dbContext: DbContext, userId: number) {
        super(dbContext, "sessions", userId)
    }

    public async obterSeries(): Promise<ISerieValue[]> {
        const key = this.getKey()
        const entries = this.db.list<ISerieValue>({ prefix: key })
        const values: ISerieValue[] = []
        for await (const entry of entries) {
            values.push(entry.value)
        }
        return values
    }

    public async incluirSerie(value: ISerieValue): Promise<number> {
        const { nextId: idSerie, seq } = await this.getNextId()
        value.id = idSerie
        this.operation
            .check(seq)
            .set(this.getKey(idSerie), value)
        return idSerie
    }
}
