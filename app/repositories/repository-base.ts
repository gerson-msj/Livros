import { DbContext, DbIdx, DbPrefix } from "@/app/data-context/db-context.ts"

export default abstract class RepositoryBase {
    protected prefix: DbPrefix
    protected seqKey: Deno.KvKey
    protected userId: number
    protected get db() {
        return this.dbContext.db
    }

    private dbContext: DbContext

    constructor(
        dbContext: DbContext,
        prefix: DbPrefix,
        userId: number = 0
    ) {
        this.dbContext = dbContext
        this.prefix = prefix
        this.seqKey = [`${prefix}:seq`]
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
}
