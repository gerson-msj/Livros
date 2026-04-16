import { define } from "@/utils.ts"

const session = define.middleware(async (ctx) => {
    if (ctx.state.sessionData === undefined) {
        return Response.redirect(new URL("/", ctx.req.url), 303)
    }

    return await ctx.next()
})

export default [
    session
]
