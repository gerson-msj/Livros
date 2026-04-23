import { DbContext, DbIdx, DbPrefix } from "@/app/data-context/db-context.ts"

export default abstract class RepositoryBase {
    protected prefix: DbPrefix
    protected seqKey: Deno.KvKey
    protected userId: number
    protected get db() {
        return this.dbContext.db
    }

    public get operation(): Deno.AtomicOperation {
        return this.dbContext.operation
    }

    private dbContext: DbContext

    constructor(
        dbContext: DbContext,
        prefix: DbPrefix,
        userId: number = 0
    ) {
        this.dbContext = dbContext
        this.prefix = prefix
        this.seqKey = userId > 0 ? [`${prefix}:seq`, userId] : [`${prefix}:seq`]
        this.userId = userId
    }

    protected getKey<T extends Deno.KvKeyPart>(keyPart?: T): Deno.KvKey {
        if (keyPart !== undefined) {
            return this.userId > 0 ? [this.prefix, this.userId, keyPart] : [this.prefix, keyPart]
        } else {
            return this.userId > 0 ? [this.prefix, this.userId] : [this.prefix]
        }
    }

    protected getIdxKey(idx: DbIdx, value: Deno.KvKeyPart): Deno.KvKey {
        return this.userId > 0 ? [idx, this.userId, value] : [idx, value]
    }

    protected commit(operation?: Deno.AtomicOperation) {
        return this.dbContext.commitOperation(operation)
    }

    protected async getNextId(): Promise<{ nextId: number; seq: Deno.KvEntryMaybe<number> }> {
        const seq = await this.db.get<number>(this.seqKey)
        const nextId = (seq.value ?? 0) + 1
        return { nextId, seq }
    }
}
