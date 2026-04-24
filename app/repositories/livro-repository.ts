import RepositoryBase from "@/app/repositories/repository-base.ts"
import { DbContext } from "@/app/data-context/db-context.ts"
import { ILivroValue } from "@/app/domain/values/livro-value.ts"
import { objectExpression } from "@/node_modules/.deno/@babel+types@7.29.0/node_modules/@babel/types/lib/index.d.ts"

export default class LivroRepository extends RepositoryBase {
    constructor(dbContext: DbContext, userId: number) {
        super(dbContext, "livros", userId)
    }

    public async obterLivros(): Promise<ILivroValue[]> {
        const livros: ILivroValue[] = []
        const key = this.getKey()
        const entries = this.db.list<ILivroValue>({ prefix: key })
        for await (const entry of entries) {
            livros.push(entry.value)
        }
        return livros
    }

    public async obterLivroPorId(id: number): Promise<ILivroValue | null> {
        const key = this.getKey(id)
        const res = await this.db.get<ILivroValue>(key)
        return res.value
    }

    public async incluirLivro(
        value: ILivroValue
    ): Promise<number> {
        const { nextId: id, seq } = await this.getNextId()
        value.id = id
        this.operation
            .check(seq)
            .set(this.seqKey, id)
            .set(this.getKey(id), value)

        return id
    }

    public async atualizarDataConclusao(data: Record<number, string | undefined>): Promise<void> {
        const ids = Object.keys(data).map((k) => Number(k))
        const keys = ids.map<Deno.KvKey>((id) => {
            return this.getKey(id)
        })

        const entries = await this.db.getMany<ILivroValue[]>(keys)
        for await (const entry of entries) {
            if (entry.value === null) continue
            entry.value.dataConclusao = data[entry.value.id]
            this.operation.check(entry)
            this.operation.set(entry.key, entry.value)
        }
    }

    public async excluirLivro(id: number): Promise<void> {
        const key = this.getKey(id)
        const livroRes = await this.db.get<ILivroValue>(key)
        if (livroRes.value === null) {
            return
        }

        const operation = this.db.atomic()
            .check(livroRes)
            .delete(key)

        await this.commit(operation)
    }

    public async incluirLivros(values: ILivroValue[]): Promise<void> {
        const { nextId, seq } = await this.getNextId()
        let id = nextId - 1
        this.operation.check(seq)
        for (const value of values) {
            id++
            value.id = id
            this.operation.set(this.getKey(id), value)
        }
        this.operation.set(this.seqKey, id)
    }
}
