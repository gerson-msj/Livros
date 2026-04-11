import { ILivroModel, livroModelValidator } from "../../../../app/domain/models/livro-model.ts"
import LivroEdit from "../../../../islands/livros/livro-edit.tsx"
import { define } from "../../../../utils.ts"

interface ILivroEditData {
    model: ILivroModel
    errMsg?: string
}

export default define.page<typeof handler>((props) => <LivroEdit model={props.data.model} />)

export const handler = define.handlers<ILivroEditData>({
    GET(ctx) {
        const id = Number.parseInt(ctx.params.id)
        const data: ILivroEditData = {
            model: {
                id,
                titulo: "Editar Livro",
                autor: {
                    id: 1,
                    nomeAutor: "Ana"
                }
            }
        }
        return { data }
    },
    async POST(ctx) {
        const id = Number.parseInt(ctx.params.id)
        const data: ILivroEditData = {
            model: {
                id,
                titulo: "Editar Livro",
                autor: {
                    id: 1,
                    nomeAutor: "Ana"
                }
            }
        }

        let status: number = 200

        const model: ILivroModel = await ctx.req.json()
        model.ordem = undefined
        model.validationResults = livroModelValidator(model)
        if (model.validationResults.length > 0) {
            data.errMsg = "Dados inválidos"
            status = 400
        }

        // realiza a gravação e retorna possíveis erros.

        return Response.json(data, { status })
    },
    DELETE(ctx) {
        const id = Number.parseInt(ctx.params.id)
        console.log(id)
        const data: ILivroEditData = {
            model: {
                id,
                titulo: "Editar Livro",
                autor: {
                    id: 1,
                    nomeAutor: "Ana"
                }
            }
        }
        return { data }
    }
})
