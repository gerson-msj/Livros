import { define } from "@/utils.ts"
import { ILivroModel } from "@/app/domain/models/livro-model.ts"
import { IAutorModel } from "@/app/domain/models/autor-model.ts"
import { ISerieModel } from "@/app/domain/models/serie-model.ts"
import Biblioteca from "@/islands/biblioteca.tsx"
import { IBibliotecaData } from "@/app/domain/data/biblioteca-data.ts"
import { deleteCookie } from "@std/http/cookie"

export default define.page<typeof handler>((props) => <Biblioteca model={props.data.model!} />)

export const handler = define.handlers<IBibliotecaData>({
    GET() {
        const autor0: IAutorModel = { id: 0, nomeAutor: "Autor A" }
        const autor1: IAutorModel = { id: 1, nomeAutor: "Autor B" }
        const serie0: ISerieModel = { id: 0, nomeSerie: "Série C", autor: autor0 }
        const livros: ILivroModel[] = [
            { id: 0, titulo: "Livro D", serie: serie0, dataConclusao: "01/01/2026" },
            { id: 1, titulo: "Livro E", autor: autor1, dataConclusao: "01/01/2025" }
        ]

        const data: IBibliotecaData = {
            model: livros
        }

        return { data }
    },
    POST() {
        const headers = new Headers()
        deleteCookie(headers, "session")
        return new Response(null, { status: 201, headers })
    }
})
