import { createClient } from "@libsql/client"
import { assertEquals, assertNotEquals } from "jsr:@std/assert@1"
import { AuthenticationService, type Clock } from "../aplicacao/autenticacao_service.ts"
import { WebCryptoSecretHasher } from "./crypto.ts"
import { LibsqlSessionRepository, LibsqlUserRepository } from "./auth_repositories.ts"

Deno.test("persiste usuario e sessao em banco libSQL local", async () => {
    const dbPath = await Deno.makeTempFile({ suffix: ".db" })
    const client = createClient({ url: `file:${dbPath.replaceAll("\\", "/")}` })
    const service = new AuthenticationService(
        new LibsqlUserRepository(client),
        new LibsqlSessionRepository(client),
        new WebCryptoSecretHasher(),
        new FixedIds(),
        new FixedClock(new Date("2026-06-16T12:00:00.000Z"))
    )

    try {
        const result = await service.registerUser({
            username: "  JOANA  ",
            password: "  senha-secreta  "
        })

        const users = await client.execute("SELECT username, password_hash, reset_key_hash FROM users")
        const sessions = await client.execute("SELECT id, user_id, expires_at, ended_at FROM sessions")

        assertEquals(users.rows[0].username, "joana")
        assertNotEquals(users.rows[0].password_hash, "senha-secreta")
        assertNotEquals(users.rows[0].reset_key_hash, result.resetKey)
        assertEquals(sessions.rows[0].id, result.session.id)
        assertEquals(sessions.rows[0].user_id, result.user.id)
        assertEquals(sessions.rows[0].expires_at, "2026-06-23T12:00:00.000Z")
        assertEquals(sessions.rows[0].ended_at, null)
        assertEquals(await service.findActiveSession(result.session.id), result.session)

        const reset = await service.resetPassword({
            username: "joana",
            resetKey: result.resetKey,
            newPassword: "nova-senha"
        })
        const updatedUsers = await client.execute("SELECT password_hash, reset_key_hash FROM users WHERE id = ?", [result.user.id])
        const sessionsAfterReset = await client.execute("SELECT id, ended_at FROM sessions ORDER BY created_at, id")

        assertNotEquals(updatedUsers.rows[0].password_hash, users.rows[0].password_hash)
        assertNotEquals(updatedUsers.rows[0].reset_key_hash, users.rows[0].reset_key_hash)
        assertEquals(reset.session.userId, result.user.id)
        assertEquals(sessionsAfterReset.rows.length, 1)
        assertEquals(sessionsAfterReset.rows[0].id, reset.session.id)
        assertEquals(sessionsAfterReset.rows[0].ended_at, null)
        assertEquals(await service.findActiveSession(result.session.id), null)
        const authenticated = await service.authenticateUser({ username: "joana", password: "nova-senha" })

        const sessionsAfterLogin = await client.execute("SELECT id FROM sessions WHERE user_id = ?", [result.user.id])
        assertEquals(sessionsAfterLogin.rows.length, 1)
        assertEquals(sessionsAfterLogin.rows[0].id, authenticated.session.id)

        await service.endSession(authenticated.session.id)

        const sessionsAfterLogout = await client.execute("SELECT id FROM sessions WHERE user_id = ?", [result.user.id])
        assertEquals(sessionsAfterLogout.rows.length, 0)
        assertEquals(await service.findActiveSession(authenticated.session.id), null)
    } finally {
        client.close()
        await Deno.remove(dbPath).catch(() => {})
    }
})

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
