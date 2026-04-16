import { DbContext, DbIdx, DbPrefix } from "@/app/data-context/db-context.ts"

export default abstract class RepositoryBase {
    protected dbContext: DbContext
    protected prefix: DbPrefix
    protected seqKey: Deno.KvKey

    public get kv(): Deno.Kv {
        return this.dbContext.kv
    }

    constructor(
        dbContext: DbContext,
        prefix: DbPrefix
    ) {
        this.dbContext = dbContext
        this.prefix = prefix
        this.seqKey = [`${prefix}:seq`]
    }

    protected getKey<T extends Deno.KvKeyPart>(keyPart: T): Deno.KvKey {
        return [this.prefix, keyPart]
    }

    protected getIdxKey(idx: DbIdx, value: Deno.KvKeyPart): Deno.KvKey {
        return [idx, value]
    }

    protected async retry<T>(action: () => Promise<T>): Promise<T> {
        const maxRetries = 3
        const delayMs = 500

        let lastError: unknown

        for (let attempt = 0; attempt < maxRetries; attempt++) {
            try {
                return await action()
            } catch (error) {
                lastError = error

                const isLastAttempt = attempt === maxRetries - 1
                if (isLastAttempt) {
                    break
                }

                if (delayMs > 0) {
                    await new Promise((resolve) => setTimeout(resolve, delayMs))
                }
            }
        }

        throw lastError
    }

    protected openDb(): Promise<void> {
        return this.dbContext.openDb()
    }
}
