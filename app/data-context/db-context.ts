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
    private _db: Deno.Kv | undefined = undefined
    public get db(): Deno.Kv {
        if (this._db === undefined) {
            throw new Error("Abra o banco de dados antes de sua utilização!")
        }

        return this._db
    }

    public async openDb() {
        this._db ??= await Deno.openKv(Deno.env.get("DBPATH")) // Temporário em dev.
    }

    public closeDb(): void {
        this._db?.close()
    }

    [Symbol.dispose]() {
        this.closeDb()
    }
}
