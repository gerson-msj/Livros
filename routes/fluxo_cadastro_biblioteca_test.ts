import { createClient } from "@libsql/client"
import { assert, assertEquals, assertMatch, assertNotEquals, assertStringIncludes } from "jsr:@std/assert@1"
import { AuthenticationService, type Clock } from "../aplicacao/autenticacao_service.ts"
import { WebCryptoSecretHasher } from "../infraestrutura/crypto.ts"
import { LibsqlSessionRepository, LibsqlUserRepository } from "../infraestrutura/auth_repositories.ts"
import { SESSION_COOKIE_NAME } from "../infraestrutura/session_cookie.ts"
import { handler as bibliotecaHandler } from "./biblioteca.tsx"
import { handler as cadastroHandler } from "./cadastro.tsx"
import { handler as loginHandler } from "./login.tsx"

Deno.test("fluxo integrado cadastra, acessa biblioteca, persiste dados seguros e encerra sessao", async () => {
    const dbPath = await Deno.makeTempFile({ suffix: ".db" })
    const client = createClient({ url: `file:${dbPath.replaceAll("\\", "/")}` })
    const service = new AuthenticationService(
        new LibsqlUserRepository(client),
        new LibsqlSessionRepository(client),
        new WebCryptoSecretHasher(),
        new FixedIds(),
        new FixedClock(new Date("2026-06-17T12:00:00.000Z"))
    )

    try {
        const cadastro = await cadastroHandler.POST!(createCadastroContext(
            createCadastroRequest({
                username: "  Gerson  ",
                password: " senha-secreta "
            }),
            service
        ))

        assertPageResponse(cadastro)
        assertEquals(cadastro.data.username, "gerson")
        assertMatch(cadastro.data.resetKey ?? "", /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/)

        const setCookie = new Headers(cadastro.headers).get("set-cookie")
        assert(setCookie)
        assertStringIncludes(setCookie, `${SESSION_COOKIE_NAME}=00000000-0000-4000-8000-000000000002`)
        const sessionCookie = setCookie.split(";")[0]

        const cadastroLogado = await cadastroHandler.GET!(createCadastroContext(createRequest("GET", "/cadastro", sessionCookie), service))

        assert(cadastroLogado instanceof Response)
        assertEquals(cadastroLogado.status, 303)
        assertEquals(cadastroLogado.headers.get("location"), "/biblioteca")

        const biblioteca = await bibliotecaHandler.GET!(
            createBibliotecaContext(createRequest("GET", "/biblioteca", sessionCookie), service)
        )

        assert(!(biblioteca instanceof Response))
        assertEquals(biblioteca.data, {})

        const users = await client.execute("SELECT username, password_hash, reset_key_hash FROM users")
        const sessions = await client.execute("SELECT id, user_id, expires_at, ended_at FROM sessions")

        assertEquals(users.rows[0].username, "gerson")
        assertNotEquals(users.rows[0].password_hash, "senha-secreta")
        assertNotEquals(users.rows[0].reset_key_hash, cadastro.data.resetKey)
        assertEquals(sessions.rows[0].id, "00000000-0000-4000-8000-000000000002")
        assertEquals(sessions.rows[0].user_id, "00000000-0000-4000-8000-000000000001")
        assertEquals(sessions.rows[0].expires_at, "2026-06-24T12:00:00.000Z")
        assertEquals(sessions.rows[0].ended_at, null)

        const logout = await bibliotecaHandler.POST!(createBibliotecaContext(createRequest("POST", "/biblioteca", sessionCookie), service))

        assert(logout instanceof Response)
        assertEquals(logout.status, 303)
        assertEquals(logout.headers.get("location"), "/login")
        assertStringIncludes(logout.headers.get("set-cookie") ?? "", "Max-Age=0")

        const bibliotecaAposLogout = await bibliotecaHandler.GET!(
            createBibliotecaContext(createRequest("GET", "/biblioteca", sessionCookie), service)
        )

        assert(bibliotecaAposLogout instanceof Response)
        assertEquals(bibliotecaAposLogout.status, 303)
        assertEquals(bibliotecaAposLogout.headers.get("location"), "/login")

        const login = await loginHandler.POST!(createLoginContext(
            createLoginRequest({ username: "gerson", password: "senha-secreta" }),
            service
        ))

        assert(login instanceof Response)
        assertEquals(login.status, 303)
        assertEquals(login.headers.get("location"), "/biblioteca")
        assertStringIncludes(login.headers.get("set-cookie") ?? "", `${SESSION_COOKIE_NAME}=00000000-0000-4000-8000-000000000003`)

        const endedSessions = await client.execute("SELECT ended_at FROM sessions")

        assertEquals(endedSessions.rows[0].ended_at, "2026-06-17T12:00:00.000Z")
    } finally {
        client.close()
        await Deno.remove(dbPath).catch(() => {})
    }
})

type CadastroContext = Parameters<NonNullable<typeof cadastroHandler.GET>>[0]
type BibliotecaContext = Parameters<NonNullable<typeof bibliotecaHandler.GET>>[0]
type LoginContext = Parameters<NonNullable<typeof loginHandler.GET>>[0]
type CadastroResponse = Awaited<ReturnType<NonNullable<typeof cadastroHandler.POST>>>
type CadastroPageResponse = Exclude<CadastroResponse, Response>

function createCadastroContext(request: Request, authentication: AuthenticationService): CadastroContext {
    return {
        req: request,
        state: {
            services: {
                authentication
            }
        }
    } as CadastroContext
}

function createBibliotecaContext(request: Request, authentication: AuthenticationService): BibliotecaContext {
    return {
        req: request,
        state: {
            services: {
                authentication
            }
        }
    } as BibliotecaContext
}

function createLoginContext(request: Request, authentication: AuthenticationService): LoginContext {
    return {
        req: request,
        state: {
            services: {
                authentication
            }
        }
    } as LoginContext
}

function createCadastroRequest(input: { username: string; password: string }): Request {
    return new Request("http://localhost/cadastro", {
        method: "POST",
        headers: {
            "content-type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams(input)
    })
}

function createLoginRequest(input: { username: string; password: string }): Request {
    return new Request("http://localhost/login", {
        method: "POST",
        headers: {
            "content-type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams(input)
    })
}

function createRequest(method: "GET" | "POST", path: "/cadastro" | "/biblioteca", cookie: string): Request {
    return new Request(`http://localhost${path}`, {
        method,
        headers: {
            cookie
        }
    })
}

function assertPageResponse(response: CadastroResponse): asserts response is CadastroPageResponse {
    assert(!(response instanceof Response))
}

class FixedIds {
    private index = 0

    newId(): string {
        this.index++
        return `00000000-0000-4000-8000-${this.index.toString().padStart(12, "0")}`
    }
}

class FixedClock implements Clock {
    constructor(private readonly value: Date) {}

    now(): Date {
        return this.value
    }
}
