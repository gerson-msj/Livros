import RepositoryBase from "@/app/repositories/repository-base.ts"
import { DbContext } from "@/app/data-context/db-context.ts"
import { ISerieValue } from "@/app/domain/values/serie-value.ts"

export default class SerieRepository extends RepositoryBase {
    constructor(dbContext: DbContext, userId: number) {
        super(dbContext, "series", userId)
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

    public async obterSerie(id: number): Promise<ISerieValue | null> {
        const entry = await this.db.get<ISerieValue>(this.getKey(id))
        return entry.value
    }

    public async incluirSerie(value: ISerieValue): Promise<number> {
        const { nextId: idSerie, seq } = await this.getNextId()
        value.id = idSerie
        this.operation
            .check(seq)
            .set(this.getKey(idSerie), value)
        return idSerie
    }

    public async excluirSerie(id: number): Promise<void> {
        const entry = await this.db.get(this.getKey(id))
        if (entry.value === null) {
            throw new Error("Série inexistente.")
        }

        this.operation
            .check(entry)
            .delete(entry.key)
    }
}
