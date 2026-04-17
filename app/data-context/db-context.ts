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
    private _kv: Deno.Kv | undefined = undefined
    public get kv() {
        return this._kv!
    }

    public async openDb() {
        this._kv ??= await Deno.openKv(Deno.env.get("DBPATH")) // Temporário em dev.
    }

    public closeDb(): void {
        this._kv?.close()
    }

    [Symbol.dispose]() {
        this.closeDb()
    }
}
