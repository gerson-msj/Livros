import ISessionData from "../../data/session-data.ts"
import { DbContext } from "../db-context.ts"
import ISessionValue from "../values/session-value.ts"
import RepositoryBase from "./repository-base.ts"

export default class SessionRepository extends RepositoryBase {
    constructor(dbContext: DbContext) {
        super(dbContext, "sessions")
    }

    public getSessionSetOperation(data: ISessionData): Deno.AtomicOperation {
        const now = new Date()
        const fatorMinMs = 60 * 1000

        const k = [this.prefix]
        const v: ISessionValue = {
            userId: data.userId,
            expires: now.getTime() + (data.expiresIn * fatorMinMs)
        }

        return this.dbContext.kv.atomic()
            .set(k, v, { expireIn: data.expiresIn * fatorMinMs })
    }
}
