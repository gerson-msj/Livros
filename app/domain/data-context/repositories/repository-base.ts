import { DbContext, DbIdx, DbPrefix } from "../db-context.ts"

export default abstract class RepositoryBase {
    protected dbContext: DbContext
    protected prefix: DbPrefix
    protected seqKey: Deno.KvKey

    constructor(
        dbContext: DbContext,
        prefix: DbPrefix
    ) {
        this.dbContext = dbContext
        this.prefix = prefix
        this.seqKey = [`${prefix}:seq`]
    }

    protected nextSeq(): Promise<number> {
        return this.dbContext.nextSeq(this.seqKey)
    }

    protected getEntityKey(id: number): Deno.KvKey {
        return [this.prefix, id]
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
}
