import { App, staticFiles } from "fresh"
import { type State } from "./utils.ts"
import { createRequestServices } from "./infraestrutura/provider.ts"

export const app = new App<State>()

app.use(staticFiles())

app.use(async (ctx) => {
    ctx.state.services = createRequestServices()
    return await ctx.next()
})

// Include file-system based routes here
app.fsRoutes()
