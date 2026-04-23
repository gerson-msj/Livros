import DbOperation from "@/app/data-context/db-operation.ts"

export default abstract class ServiceBase {
    private dbOperation: DbOperation

    constructor(dbOperation: DbOperation) {
        this.dbOperation = dbOperation
    }

    protected commit() {
        return this.dbOperation.commit()
    }
}
