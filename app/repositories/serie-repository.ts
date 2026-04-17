import RepositoryBase from "@/app/repositories/repository-base.ts"
import { DbContext } from "@/app/data-context/db-context.ts"

export default class SerieRepository extends RepositoryBase {
    constructor(dbContext: DbContext, userId: number) {
        super(dbContext, "sessions", userId)
    }
}
