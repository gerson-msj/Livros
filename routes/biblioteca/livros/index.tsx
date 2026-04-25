import { ILivroModel } from "../../../app/domain/models/livro-model.ts"
import PageService from "@/app/services/page-service.ts"
import Livros from "../../../islands/livros/livros.tsx"
import { define } from "../../../utils.ts"

interface ILivroData {
    model: ILivroModel[]
}

export default define.page<typeof handler>((props) => <Livros model={props.data.model} />)

export const handler = define.handlers<ILivroData>({
    async GET(ctx) {
        const data: ILivroData = {
            model: []
        }

        try {
            const service = await PageService.getService(ctx.state.sp, "livroService")
            data.model = await service.obterLivrosAvulsos()
        } catch (error) {
            PageService.handleError(error)
        }

        return { data }
    }
})
