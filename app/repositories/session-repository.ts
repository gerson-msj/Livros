import RepositoryBase from "@/app/repositories/repository-base.ts"
import { DbContext } from "@/app/data-context/db-context.ts"
import { ISessionData } from "@/app/domain/data/session-data.ts"
import ISessionValue from "@/app/domain/values/session-value.ts"

export default class SessionRepository extends RepositoryBase {
    constructor(dbContext: DbContext) {
        super(dbContext, "sessions")
    }

    public sessionSetOperation(sessionData: ISessionData): Deno.AtomicOperation {
        const k = [this.prefix, sessionData.sessionId]
        const v: ISessionValue = {
            userId: sessionData.userId,
            expiresTime: sessionData.expiresTime
        }

        return this.dbContext.kv.atomic()
            .set(k, v, { expireIn: sessionData.expireIn })
    }

    public async getSession(sessionId?: string): Promise<ISessionValue | null> {
        if (sessionId === undefined) {
            return null
        }

        const k = [this.prefix, sessionId]
        await this.dbContext.openDb()
        const res = await this.dbContext.kv.get<ISessionValue>(k)
        return res.value
    }

    public async deleteSession(sessionId: string): Promise<void> {
        await this.openDb()
        const k = [this.prefix, sessionId]
        return this.dbContext.kv.delete(k)
    }
}
