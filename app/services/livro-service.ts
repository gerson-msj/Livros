import ServiceBase from "@/app/services/service-base.ts"
import AutorRepository from "@/app/repositories/autor-repository.ts"
import LivroRepository from "@/app/repositories/livro-repository.ts"
import { ILivroModel } from "@/app/domain/models/livro-model.ts"
import { ILivroValue } from "@/app/domain/values/livro-value.ts"
import DbOperation from "@/app/data-context/db-operation.ts"

export default class LivroService extends ServiceBase {
    private autorRepository: AutorRepository
    private livroRepository: LivroRepository

    constructor(
        dbOperation: DbOperation,
        autorRepository: AutorRepository,
        livroRepository: LivroRepository
    ) {
        super(dbOperation)
        this.autorRepository = autorRepository
        this.livroRepository = livroRepository
    }

    public async obterLivros(): Promise<ILivroModel[]> {
        const [livrosValue, autoresModel] = await Promise.all([
            this.livroRepository.obterLivros(),
            this.autorRepository.obterAutores()
        ])

        const livrosModel: ILivroModel[] = []

        for (const livroValue of livrosValue.filter((l) => l.idAutor !== undefined)) {
            const { id, titulo, dataConclusao } = livroValue
            const autor = autoresModel.find((a) => a.id === livroValue.idAutor)
            const livroModel: ILivroModel = { id, titulo, dataConclusao, autor }
            livrosModel.push(livroModel)
        }

        return livrosModel
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
        if (model.ordem !== undefined || model.autor === undefined) {
            throw new Error("Dados inválidos.")
        }

        let idAutor = model.autor.id
        if (idAutor > 0) {
            const autor = await this.autorRepository.obterAutorPorId(idAutor)
            if (autor === null) {
                throw new Error("Autor inexistente.")
            }
        } else {
            const value = await this.autorRepository.criarAutor(model.autor)
            idAutor = value.id
        }

        const livroValue: ILivroValue = {
            id: 0,
            titulo: model.titulo,
            dataConclusao: model.dataConclusao,
            idAutor
        }

        await this.livroRepository.incluirLivro(livroValue)

        await this.commit()
    }

    public atualizarDataConclusao(id: number, dataConclusao?: string): Promise<void> {
        return this.livroRepository.atualizarDataConclusao(id, dataConclusao)
    }

    public excluirLivro(id: number): Promise<void> {
        return this.livroRepository.excluirLivro(id)
    }
}
