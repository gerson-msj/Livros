/// <reference lib="deno.unstable" />

const prefixes = [
    "sessions",
    "usuarios"
] as const

const seqs = [
    "usuarios:seq"
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

    /**
     *   public async nextSeq(keySeq: Deno.KvKey): Promise<number> {
    const res = await this.kv.get<number>(keySeq);
    const lastSeq = (res.value as number | null) ?? 0;
    return lastSeq + 1;
  }

  public key_Usuarios_Seq(): Deno.KvKey {
    const seq: DbSeq = "usuarios:seq";
    return [seq];
  }

  public key_Cadastros_IdxIniciados(): Deno.KvKey {
    const idx: DbIdx = "cadastros:idx_iniciados";
    return [idx, this.IdUsuario];
  }

  public key_Cadastros_Seq(): Deno.KvKey {
    const seq: DbSeq = "cadastros:seq";
    return [seq, this.IdUsuario];
  }

  public key_Cadastros(idCadastro: number): Deno.KvKey {
    const prefix: DbPrefix = "cadastros";
    return [prefix, this.IdUsuario, idCadastro];
  }

  public key_Fotos(idCadastro: number): Deno.KvKey {
    const prefix: DbPrefix = "fotos";
    return [prefix, this.IdUsuario, idCadastro];
  }
     */
}
