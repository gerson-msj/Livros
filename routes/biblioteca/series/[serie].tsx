import { ISerieModel, serieModelValidatorFull } from "../../../app/domain/models/serie-model.ts"
import PageService from "@/app/services/page-service.ts"
import Serie from "../../../islands/series/serie.tsx"
import { define } from "../../../utils.ts"
import { ISerieData } from "@/app/domain/data/serie-data.ts"

export default define.page<typeof handler>((props) => <Serie {...props.data} />)

export const handler = define.handlers({
    async GET(ctx) {
        const id = PageService.getId(ctx.params.serie)

        const data: ISerieData = {}

        try {
            if (id === 0) {
                const service = await PageService.getService(ctx.state.sp, "autorService")
                data.serie = {
                    id,
                    nomeSerie: "",
                    autor: undefined,
                    livros: undefined
                }
                data.autores = await service.obterAutores()
            } else {
                const service = await PageService.getService(ctx.state.sp, "serieService")
                data.serie = await service.obterSerie(id)
            }
        } catch (error) {
            data.errors = PageService.handleError(error)
        }

        return { data }
    },
    async POST(ctx) {
        const id = PageService.getId(ctx.params.serie)

        const model: ISerieModel = await ctx.req.json()

        const data: ISerieData = {
            errors: model.id !== id ? ["Dados inválidos"] : serieModelValidatorFull(model)
        }

        if (data.errors !== undefined) {
            return Response.json(data, { status: 400 })
        }

        try {
            const service = await PageService.getService(ctx.state.sp, "serieService")
            if (id === 0) {
                await service.incluirSerie(model)
            } else {
                await service.atualizarLivros(model)
            }
            return new Response(null, { status: 201 })
        } catch (error) {
            data.errors = PageService.handleError(error)
            return Response.json(data, { status: 400 })
        }
    },
    async DELETE(ctx) {
        const id = PageService.getId(ctx.params.serie)
        try {
            const service = await PageService.getService(ctx.state.sp, "serieService")
            await service.excluirSerie(id)
            return new Response(null, { status: 201 })
        } catch (error) {
            const data: ISerieData = {
                errors: PageService.handleError(error)
            }
            return Response.json(data, { status: 400 })
        }
    }
})
