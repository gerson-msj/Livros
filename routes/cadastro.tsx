import { Head } from "fresh/runtime"
import { RegistrationValidationError, UsernameAlreadyExistsError, type ValidationIssue } from "../dominio/autenticacao.ts"
import { getSessionIdFromCookie, setSessionCookie } from "../infraestrutura/session_cookie.ts"
import CadastroForm from "../islands/CadastroForm.tsx"
import PageTitle from "../islands/PageTitle.tsx"
import ResetKeyPanel from "../islands/ResetKeyPanel.tsx"
import { define } from "../utils.ts"

interface CadastroPageData {
    username: string
    errors: {
        username?: string
        password?: string
        general?: string
    }
    resetKey?: string
}

const emptyData: CadastroPageData = {
    username: "",
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
                        errors: mapValidationIssues(error.issues)
                    }
                }
            }

            if (error instanceof UsernameAlreadyExistsError) {
                return {
                    data: {
                        username: username.trim(),
                        errors: {
                            username: "Este nome de usuario nao esta disponivel."
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
                        <PageTitle title="Criar conta" />
                        <p class="subtitle">Entre na sua biblioteca logo apos o cadastro.</p>

                        {data.resetKey
                            ? <ResetKeyPanel resetKey={data.resetKey} />
                            : <CadastroForm username={data.username} errors={data.errors} />}
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
        errors[issue.field] = issue.message
    }

    return errors
}
