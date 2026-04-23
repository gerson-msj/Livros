/// <reference lib="deno.unstable" />

const prefixes = [
    "sessions",
    "usuarios",
    "autores",
    "livros",
    "series"
] as const

const seqs = [
    "usuarios:seq",
    "autores:seq",
    "livros:seq",
    "series:seq"
] as const

const idxs = [
    "usuarios:usuario_idx"
] as const

export type DbPrefix = typeof prefixes[number]
export type DbSeq = typeof seqs[number]
export type DbIdx = typeof idxs[number]

export class DbContext {
    private path?: string

    private _operation: Deno.AtomicOperation | undefined = undefined
    public get operation(): Deno.AtomicOperation {
        if (this._operation === undefined) {
            throw new Error("A operação atômica não foi iniciada!")
        }
        return this._operation
    }

    private _db: Deno.Kv | undefined = undefined
    public get db(): Deno.Kv {
        if (this._db === undefined) {
            throw new Error("Abra o banco de dados antes de sua utilização!")
        }

        return this._db
    }

    constructor(path?: string) {
        this.path = path
    }

    public async openDb() {
        this._db ??= await Deno.openKv(this.path)
        this.startOperation()
    }

    public closeDb(): void {
        this._db?.close()
    }

    public startOperation() {
        this._operation = this.db.atomic()
    }

    public async commitOperation(operation?: Deno.AtomicOperation) {
        const op = operation ?? this.operation
        const res = await op.commit()

        if (!res.ok) {
            throw new Error("Houve uma falha de banco de dados, a operação não foi realizada.")
        }

        console.log("DbContext.commitOperation", op)

        if (operation === undefined) {
            this.startOperation()
        }
    }

    [Symbol.dispose]() {
        this.closeDb()
    }
}
