import ServiceBase from "@/app/services/service-base.ts"
import AutorRepository from "@/app/repositories/autor-repository.ts"
import LivroRepository from "@/app/repositories/livro-repository.ts"
import { ILivroModel } from "@/app/domain/models/livro-model.ts"

export default class LivroService extends ServiceBase {
    private autorRepository: AutorRepository
    private livroRepository: LivroRepository

    constructor(
        autorRepository: AutorRepository,
        livroRepository: LivroRepository
    ) {
        super()
        this.autorRepository = autorRepository
        this.livroRepository = livroRepository
    }

    public async obterLivroPorId(id: number): Promise<ILivroModel> {
        if (id === 0) {
            return {
                id: 0,
                titulo: ""
            }
        }

        const livroValue = await this.livroRepository.obterLivroPorId(id)
        if (livroValue === null) {
            throw new Error("Livro inexistente.")
        }

        const { titulo, ordem, dataConclusao, idAutor } = livroValue
        const livroModel: ILivroModel = { id, titulo, ordem, dataConclusao }

        if (idAutor !== undefined) {
            const autorValue = await this.autorRepository.obterAutorPorId(idAutor)
            if (autorValue !== null) {
                livroModel.autor = {
                    id: autorValue.id,
                    nomeAutor: autorValue.nomeAutor
                }
            }
        }

        return livroModel
    }

    public async incluirLivro(model: ILivroModel): Promise<void> {
    }
}
