import { ISerieModel } from "../../../app/domain/models/serie-model.ts"
import PageService from "@/app/services/page-service.ts"
import Series from "../../../islands/series/series.tsx"
import { define } from "../../../utils.ts"

interface ISerieData {
    model: ISerieModel[]
}

export default define.page<typeof handler>((props) => <Series model={props.data.model} />)

export const handler = define.handlers<ISerieData>({
    async GET(ctx) {
        const service = await PageService.getService(ctx.state.sp, "serieService")
        const series = await service.obterSeries()
        const data: ISerieData = { model: series }
        return { data }
    }
})
