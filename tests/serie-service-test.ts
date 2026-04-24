/// <reference lib="deno.unstable" />

import { DbContext } from "@/app/data-context/db-context.ts"
import { expect } from "@std/expect"
import { exists } from "@std/fs"
import AutorRepository from "@/app/repositories/autor-repository.ts"
import LivroRepository from "@/app/repositories/livro-repository.ts"
import SerieRepository from "@/app/repositories/serie-repository.ts"
import SerieService from "@/app/services/serie-service.ts"
import { ISerieModel } from "@/app/domain/models/serie-model.ts"
import DbOperation from "@/app/data-context/db-operation.ts"

Deno.test("SerieServiceTest", async (t) => {
    const path = "./livros_test.db"
    const dbExists = await exists(path)
    if (dbExists) {
        await Deno.remove(path)
    }

    using dbContext = new DbContext(path)
    const dbOperation = new DbOperation(dbContext)
    const autorRepository = new AutorRepository(dbContext, 1)
    const livroRepository = new LivroRepository(dbContext, 1)
    const serieRepository = new SerieRepository(dbContext, 1)
    const serieService = new SerieService(dbOperation, autorRepository, livroRepository, serieRepository)
    let idSerie: number = 0

    await t.step("incluirSerie", async () => {
        const model: ISerieModel = {
            id: 0,
            nomeSerie: "Serie Teste",
            autor: { id: 0, nomeAutor: "Autor Teste" },
            livros: [
                { id: 0, titulo: "Livro 01", dataConclusao: "2026-01-01", ordem: 1 },
                { id: 0, titulo: "Livro 02", dataConclusao: "2026-01-02", ordem: 2 }
            ]
        }

        await dbContext.openDb()
        idSerie = await serieService.incluirSerie(model)

        expect(idSerie).toBe(1)
    })
})
