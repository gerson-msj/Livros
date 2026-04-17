import ServiceBase from "@/app/services/service-base.ts"
import SerieRepository from "@/app/repositories/serie-repository.ts"
import AutorRepository from "@/app/repositories/autor-repository.ts"
import LivroRepository from "@/app/repositories/livro-repository.ts"

export default class SerieService extends ServiceBase {
    private autorRepository: AutorRepository
    private livroRepository: LivroRepository
    private serieRepository: SerieRepository

    constructor(
        autorRepository: AutorRepository,
        livroRepository: LivroRepository,
        serieRepository: SerieRepository
    ) {
        super()
        this.autorRepository = autorRepository
        this.livroRepository = livroRepository
        this.serieRepository = serieRepository
    }

    // public async obterLivroPorId(id: number): Promise<ILivroModel | undefined> {
    // }
}
