import { createDefine } from "fresh"
import { ServiceProvider } from "@/app/services/service-provider.ts"
import { ISessionData } from "@/app/domain/data/session-data.ts"

export interface State {
    sessionData?: ISessionData
    sp: ServiceProvider
}

export const define = createDefine<State>()
