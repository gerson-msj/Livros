import { DbContext } from "@/app/data-context/db-context.ts"

export default class DbOperation {
    private dbContext: DbContext

    constructor(dbContext: DbContext) {
        this.dbContext = dbContext
    }

    public commit(): Promise<void> {
        return this.dbContext.commitOperation()
    }
}
