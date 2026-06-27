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
        "CREATE INDEX IF NOT EXISTS idx_sessions_active ON sessions(id, expires_at, ended_at)",
        `CREATE TABLE IF NOT EXISTS authors (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            name TEXT NOT NULL,
            normalized_name TEXT NOT NULL,
            created_at TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )`,
        "CREATE UNIQUE INDEX IF NOT EXISTS idx_authors_user_normalized_name ON authors(user_id, normalized_name)",
        `CREATE TABLE IF NOT EXISTS series (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            name TEXT NOT NULL,
            normalized_name TEXT NOT NULL,
            author_id TEXT NOT NULL,
            created_at TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (author_id) REFERENCES authors(id)
        )`,
        "CREATE UNIQUE INDEX IF NOT EXISTS idx_series_user_name_author ON series(user_id, normalized_name, author_id)",
        "CREATE INDEX IF NOT EXISTS idx_series_user_created_at ON series(user_id, created_at)",
        `CREATE TABLE IF NOT EXISTS books (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            title TEXT NOT NULL,
            normalized_title TEXT NOT NULL,
            author_id TEXT,
            series_id TEXT,
            series_order INTEGER,
            reading_started_on TEXT,
            reading_finished_on TEXT,
            created_at TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (author_id) REFERENCES authors(id),
            FOREIGN KEY (series_id) REFERENCES series(id),
            CHECK (
                (author_id IS NOT NULL AND series_id IS NULL AND series_order IS NULL)
                OR (author_id IS NULL AND series_id IS NOT NULL AND series_order IS NOT NULL)
            )
        )`,
        "CREATE INDEX IF NOT EXISTS idx_books_user_created_at ON books(user_id, created_at)",
        "CREATE INDEX IF NOT EXISTS idx_books_user_title_author ON books(user_id, normalized_title, author_id)",
        "CREATE INDEX IF NOT EXISTS idx_books_user_series_order ON books(user_id, series_id, series_order)"
    ], "write")
}
