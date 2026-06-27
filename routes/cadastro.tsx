import { Head } from "fresh/runtime"
import { RegistrationValidationError, UsernameAlreadyExistsError, type ValidationIssue } from "../dominio/autenticacao.ts"
import { getSessionIdFromCookie, setSessionCookie } from "../infraestrutura/session_cookie.ts"
import CadastroForm from "../islands/CadastroForm.tsx"
import PageTitle from "../islands/PageTitle.tsx"
import ResetKeyPanel from "../islands/ResetKeyPanel.tsx"
import { define } from "../utils.ts"

interface CadastroPageData {
    username: string
    password: string
    errors: {
        username?: string
        password?: string
        general?: string
    }
    resetKey?: string
}

const emptyData: CadastroPageData = {
    username: "",
    password: "",
    errors: {}
}

const noErrors: CadastroPageData["errors"] = {}

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
            const result = await ctx.state.services.authentication.registerUser({ username, password })
            const headers = new Headers()
            setSessionCookie(headers, result.session.id, result.session.expiresAt)
            return {
                data: {
                    username: result.user.username,
                    password: "",
                    errors: noErrors,
                    resetKey: result.resetKey
                },
                headers
            }
        } catch (error) {
            if (error instanceof RegistrationValidationError) {
                return {
                    data: {
                        username: username.trim(),
                        password,
                        errors: mapValidationIssues(error.issues)
                    }
                }
            }

            if (error instanceof UsernameAlreadyExistsError) {
                return {
                    data: {
                        username: username.trim(),
                        password,
                        errors: {
                            username: "Este nome de usuário não está disponível."
                        }
                    }
                }
            }

            throw error
        }
    }
})

export default define.page<typeof handler>(function Cadastro({ data }) {
    return (
        <section class="section">
            <Head>
                <title>Cadastro | Livros</title>
            </Head>
            <div class="container">
                <div class="columns is-centered">
                    <div class="column is-full-mobile is-two-thirds-tablet is-half-desktop">
                        <PageTitle title="Criar conta" leftMode="back" backHref="/login" />
                        <p class="subtitle">Guarde sua chave antes de entrar na biblioteca.</p>

                        {data.resetKey
                            ? <ResetKeyPanel resetKey={data.resetKey} />
                            : <CadastroForm username={data.username} password={data.password} errors={data.errors} />}
                    </div>
                </div>
            </div>
        </section>
    )
})

function redirectToBiblioteca(): Response {
    return new Response(null, {
        status: 303,
        headers: {
            location: "/biblioteca"
        }
    })
}

function mapValidationIssues(issues: ValidationIssue[]): CadastroPageData["errors"] {
    const errors: CadastroPageData["errors"] = {}

    for (const issue of issues) {
        if (issue.field === "username" || issue.field === "password") {
            errors[issue.field] = issue.message
        }
    }

    return errors
}
