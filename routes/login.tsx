import { Head } from "fresh/runtime"
import { InvalidCredentialsError } from "../dominio/autenticacao.ts"
import { getSessionIdFromCookie, setSessionCookie } from "../infraestrutura/session_cookie.ts"
import LoginForm from "../islands/LoginForm.tsx"
import PageTitle from "../islands/PageTitle.tsx"
import { define } from "../utils.ts"

interface LoginPageData {
    username: string
    password: string
    error?: string
}

const emptyData: LoginPageData = {
    username: "",
    password: ""
}

const invalidLoginMessage = "Não foi possível entrar. Confira nome de usuário e senha."

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
        const password = form.get("password")?.toString() ?? ""

        try {
            const result = await ctx.state.services.authentication.authenticateUser({ username, password })
            const headers = new Headers()
            setSessionCookie(headers, result.session.id, result.session.expiresAt)
            return redirectToBiblioteca(headers)
        } catch (error) {
            if (error instanceof InvalidCredentialsError) {
                return {
                    data: {
                        username: username.trim(),
                        password,
                        error: invalidLoginMessage
                    }
                }
            }

            throw error
        }
    }
})

export default define.page<typeof handler>(function Login({ data }) {
    return (
        <section class="section">
            <Head>
                <title>Login | Livros</title>
            </Head>
            <div class="container">
                <div class="columns is-centered">
                    <div class="column is-full-mobile is-two-thirds-tablet is-half-desktop">
                        <PageTitle title="Entrar" />
                        <p class="subtitle">Entre na sua biblioteca, crie uma conta ou redefina sua senha.</p>

                        <LoginForm username={data.username} password={data.password} error={data.error} />

                        <div class="content has-text-centered">
                            <p>
                                Ainda não tem conta? <a href="/cadastro">Criar conta</a>
                            </p>
                            <p>
                                Esqueceu a senha? <a href="/redefinir-senha">Redefinir senha</a>
                            </p>
                        </div>
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
