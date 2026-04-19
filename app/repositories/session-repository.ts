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

        return this.db.atomic()
            .set(k, v, { expireIn: sessionData.expireIn })
    }

    public async getSession(sessionId?: string): Promise<ISessionValue | null> {
        if (sessionId === undefined) {
            return null
        }

        const k = [this.prefix, sessionId]
        const res = await this.db.get<ISessionValue>(k)
        return res.value
    }

    public deleteSession(sessionId: string): Promise<void> {
        const k = [this.prefix, sessionId]
        return this.db.delete(k)
    }
}
