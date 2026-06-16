import { type Client, createClient } from "@libsql/client"

const DEFAULT_DATABASE_URL = "file:Livros.db"

let sharedClient: Client | null = null
const migrations = new WeakMap<Client, Promise<void>>()

export function getDatabaseClient(): Client {
    if (sharedClient === null) {
        sharedClient = createClient({
            url: Deno.env.get("LIVROS_DATABASE_URL") ?? DEFAULT_DATABASE_URL
        })
    }

    return sharedClient
}

export function ensureDatabaseSchema(client = getDatabaseClient()): Promise<void> {
    const existingMigration = migrations.get(client)

    if (existingMigration) {
        return existingMigration
    }

    const migration = runMigrations(client)
    migrations.set(client, migration)

    return migration
}

async function runMigrations(client: Client): Promise<void> {
    await client.batch([
        `CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            username TEXT NOT NULL UNIQUE,
            password_hash TEXT NOT NULL,
            reset_key_hash TEXT NOT NULL,
            created_at TEXT NOT NULL
        )`,
        `CREATE TABLE IF NOT EXISTS sessions (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            expires_at TEXT NOT NULL,
            created_at TEXT NOT NULL,
            ended_at TEXT,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )`,
        "CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id)",
        "CREATE INDEX IF NOT EXISTS idx_sessions_active ON sessions(id, expires_at, ended_at)"
    ], "write")
}
