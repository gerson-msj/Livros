import ServiceBase from "@/app/services/service-base.ts"
import SerieRepository from "@/app/repositories/serie-repository.ts"
import AutorRepository from "@/app/repositories/autor-repository.ts"
import LivroRepository from "@/app/repositories/livro-repository.ts"
import { ISerieModel } from "@/app/domain/models/serie-model.ts"
import { ILivroModel } from "@/app/domain/models/livro-model.ts"
import { ISerieValue } from "@/app/domain/values/serie-value.ts"
import { ILivroValue } from "@/app/domain/values/livro-value.ts"
import DbOperation from "@/app/data-context/db-operation.ts"
import LivroService from "@/app/services/livro-service.ts"

export default class SerieService extends ServiceBase {
    private autorRepository: AutorRepository
    private livroRepository: LivroRepository
    private serieRepository: SerieRepository

    constructor(
        dbOperation: DbOperation,
        autorRepository: AutorRepository,
        livroRepository: LivroRepository,
        serieRepository: SerieRepository
    ) {
        super(dbOperation)
        this.autorRepository = autorRepository
        this.livroRepository = livroRepository
        this.serieRepository = serieRepository
    }

    public async obterSeries(): Promise<ISerieModel[]> {
        const [seriesValue, livrosValue, autoresModel] = await Promise.all([
            this.serieRepository.obterSeries(),
            this.livroRepository.obterLivros(),
            this.autorRepository.obterAutores()
        ])

        const seriesModel: ISerieModel[] = []

        for (const serieValue of seriesValue) {
            const serieModel: ISerieModel = {
                id: serieValue.id,
                nomeSerie: serieValue.nomeSerie
            }

            serieModel.livros = livrosValue
                .filter((l) => l.idSerie === serieValue.id)
                .map<ILivroModel>((m) => {
                    return {
                        id: m.id,
                        titulo: m.titulo,
                        ordem: m.ordem,
                        dataConclusao: m.dataConclusao
                    }
                })
                .sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0))

            serieModel.autor = autoresModel
                .find((a) => a.id === serieValue.idAutor)

            seriesModel.push(serieModel)
        }

        return seriesModel
    }

    public async obterSerie(id: number): Promise<ISerieModel> {
        const [serieValue, livrosValue] = await Promise.all([
            this.serieRepository.obterSerie(id),
            this.livroRepository.obterLivros(id)
        ])

        if (serieValue === null) {
            throw new Error("Série inexistente.")
        }

        const autorValue = await this.autorRepository.obterAutorPorId(serieValue.idAutor)
        if (autorValue === null || livrosValue.length === 0) {
            throw new Error("Série inválida.")
        }

        const model: ISerieModel = {
            id: serieValue.id,
            nomeSerie: serieValue.nomeSerie,
            autor: {
                id: autorValue.id,
                nomeAutor: autorValue.nomeAutor
            },
            livros: livrosValue.map<ILivroValue>((v) => {
                return {
                    id: v.id,
                    titulo: v.titulo,
                    ordem: v.ordem,
                    dataConclusao: v.dataConclusao,
                    idSerie: serieValue.id
                }
            })
        }

        return model
    }

    public async incluirSerie(model: ISerieModel): Promise<number> {
        /**
         * O autor pode ser novo ou existente
         * Os livros são sempre novos
         * A série é sempre nova
         */

        /** Tratativas para Autor */
        if (model.autor === undefined) throw new Error("Autor não informado.")
        let idAutor = model.autor.id
        if (idAutor === 0) {
            const autorValue = await this.autorRepository.criarAutor(model.autor)
            idAutor = autorValue.id
        } else {
            const autorValue = this.autorRepository.obterAutorPorId(idAutor)
            if (autorValue === null) throw new Error("Autor inexistente.")
        }

        /** Tratativas para a Serie */
        const serieValue: ISerieValue = {
            id: model.id,
            nomeSerie: model.nomeSerie,
            idAutor
        }
        const idSerie = await this.serieRepository.incluirSerie(serieValue)

        /** Tratativas para Livros */
        if ((model.livros?.length ?? 0) === 0) {
            throw new Error("Livros não informados.")
        }

        const livrosValue = model.livros!.map<ILivroValue>((value) => {
            return {
                id: 0,
                titulo: value.titulo,
                ordem: value.ordem,
                dataConclusao: value.dataConclusao,
                idSerie
            }
        })

        await this.livroRepository.incluirLivros(livrosValue)

        await this.commit()

        return idSerie
    }

    public async atualizarLivros(model: ISerieModel): Promise<void> {
        if ((model.livros?.length ?? 0) === 0) {
            throw new Error("Livros não informados.")
        }
        const data: Record<number, string | undefined> = {}
        for (const livro of model.livros!) {
            data[livro.id] = livro.dataConclusao
        }

        await this.livroRepository.atualizarDataConclusao(data)
    }

    public async excluirSerie(id: number): Promise<void> {
        const model = await this.obterSerie(id)
        await this.serieRepository.excluirSerie(model.id)
        const livrosId = model.livros?.map((livro) => livro.id) ?? []
        if (livrosId.length > 0) {
            await this.livroRepository.excluirLivros(livrosId)
        }
        await this.commit()
    }
}
