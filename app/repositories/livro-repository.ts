import RepositoryBase from "@/app/repositories/repository-base.ts"
import { DbContext } from "@/app/data-context/db-context.ts"
import { ILivroValue } from "@/app/domain/values/livro-value.ts"

export default class LivroRepository extends RepositoryBase {
    constructor(dbContext: DbContext, userId: number) {
        super(dbContext, "livros", userId)
    }

    public async obterLivroPorId(id: number): Promise<ILivroValue | null> {
        const key = this.getKey(id)
        const res = await this.db.get<ILivroValue>(key)
        return res.value
    }
}
