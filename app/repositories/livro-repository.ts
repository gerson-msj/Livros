import RepositoryBase from "@/app/repositories/repository-base.ts"
import { DbContext } from "@/app/data-context/db-context.ts"
import { ILivroValue } from "@/app/domain/values/livro-value.ts"

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

    public async atualizarDataConclusao(id: number, dataConclusao?: string): Promise<void> {
        const key = this.getKey(id)
        const livroRes = await this.db.get<ILivroValue>(key)
        if (livroRes.value === null) {
            throw new Error("Livro inexistente")
        }

        const livro = livroRes.value

        if (livro.dataConclusao === dataConclusao) {
            return
        }

        livro.dataConclusao = dataConclusao
        const operation = this.db.atomic()
            .check(livroRes)
            .set(key, livro)
        await this.commit(operation)
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
