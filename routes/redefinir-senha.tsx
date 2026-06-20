import { Head } from "fresh/runtime"
import { InvalidPasswordResetError, RegistrationValidationError } from "../dominio/autenticacao.ts"
import { getSessionIdFromCookie, setSessionCookie } from "../infraestrutura/session_cookie.ts"
import PageTitle from "../islands/PageTitle.tsx"
import ResetPasswordForm from "../islands/ResetPasswordForm.tsx"
import ResetPasswordResultPanel from "../islands/ResetPasswordResultPanel.tsx"
import { define } from "../utils.ts"

interface ResetPasswordPageData {
    username: string
    resetKey: string
    error?: string
    newResetKey?: string
}

const emptyData: ResetPasswordPageData = {
    username: "",
    resetKey: ""
}

const invalidResetMessage = "Nao foi possivel redefinir a senha. Confira os dados e tente novamente."

export const handler = define.handlers({
    async GET(ctx) {
        const sessionId = getSessionIdFromCookie(ctx.req.headers)

        if (sessionId && await ctx.state.services.authentication.findActiveSession(sessionId)) {
            return redirectToBiblioteca()
        }

        return { data: emptyData }
    },

    async POST(ctx) {
        const form = await ctx.req.formData()
        const username = form.get("username")?.toString() ?? ""
        const resetKey = form.get("resetKey")?.toString() ?? ""
        const newPassword = form.get("newPassword")?.toString() ?? ""

        try {
            const result = await ctx.state.services.authentication.resetPassword({ username, resetKey, newPassword })
            const headers = new Headers()
            setSessionCookie(headers, result.session.id, result.session.expiresAt)
            return {
                data: {
                    username: result.user.username,
                    resetKey: "",
                    newResetKey: result.resetKey
                },
                headers
            }
        } catch (error) {
            if (error instanceof InvalidPasswordResetError || error instanceof RegistrationValidationError) {
                return {
                    data: {
                        username: username.trim(),
                        resetKey: resetKey.trim(),
                        error: invalidResetMessage
                    }
                }
            }

            throw error
        }
    }
})

export default define.page<typeof handler>(function ResetPassword({ data }) {
    return (
        <section class="section">
            <Head>
                <title>Redefinir senha | Livros</title>
            </Head>
            <div class="container">
                <div class="columns is-centered">
                    <div class="column is-full-mobile is-two-thirds-tablet is-half-desktop">
                        <PageTitle title="Redefinir senha" leftMode="back" backHref="/login" />
                        <p class="subtitle">Use sua chave atual para escolher uma nova senha.</p>

                        {data.newResetKey
                            ? <ResetPasswordResultPanel resetKey={data.newResetKey} />
                            : <ResetPasswordForm username={data.username} resetKey={data.resetKey} error={data.error} />}

                        {!data.newResetKey && (
                            <div class="content has-text-centered">
                                <p>
                                    Lembrou a senha? <a href="/login">Voltar para login</a>
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
})

function redirectToBiblioteca(headers = new Headers()): Response {
    headers.set("location", "/biblioteca")

    return new Response(null, {
        status: 303,
        headers
    })
}
