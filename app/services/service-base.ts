import { DbContext } from "../domain/data-context/db-context.ts"

export default abstract class ServiceBase {
    protected dbContext: DbContext

    constructor() {
        this.dbContext = new DbContext()
    }

    [Symbol.dispose]() {
        this.dbContext.closeDb()
    }
}
