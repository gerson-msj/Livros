import { createDefine } from "fresh"
import type { RequestServices } from "./infraestrutura/provider.ts"

// This specifies the type of "ctx.state" which is used to share
// data among middlewares, layouts and routes.
export interface State {
    services: RequestServices
}

export const define = createDefine<State>()
