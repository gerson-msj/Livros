import type { Client, InArgs, InStatement, ResultSet, TransactionMode } from "@libsql/client"
import { type BatchStatement, type Config, connect, type Connection } from "@tursodatabase/serverless"

const DEFAULT_DATABASE_URL = "file:Livros.db"

let sharedClient: Client | null = null
const migrations = new WeakMap<Client, Promise<void>>()
const databaseUrl = Deno.env.get("LIVROS_DATABASE_URL") ?? DEFAULT_DATABASE_URL
const databaseAuthToken = Deno.env.get("LIVROS_DATABASE_AUTH_TOKEN")
const usesLocalFileDatabase = databaseUrl.startsWith("file:")
const localCreateClient = usesLocalFileDatabase ? (await loadLocalClientFactory()) : null

export function getDatabaseClient(): Client {
    if (sharedClient === null) {
        sharedClient = createDatabaseClient()
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
        `CREATE TABLE IF NOT EXISTS schema_migrations (
            version TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            applied_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
        )`,
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
        "CREATE INDEX IF NOT EXISTS idx_books_user_series_order ON books(user_id, series_id, series_order)",
        {
            sql: "INSERT OR IGNORE INTO schema_migrations (version, name) VALUES (?, ?)",
            args: ["0001", "schema_inicial"]
        }
    ], "write")
}

function createDatabaseClient(): Client {
    if (usesLocalFileDatabase) {
        return localCreateClient!({
            url: databaseUrl,
            authToken: databaseAuthToken
        })
    }

    return new TursoServerlessClient({
        url: databaseUrl,
        authToken: databaseAuthToken
    }) as unknown as Client
}

async function loadLocalClientFactory(): Promise<(config: { url: string; authToken?: string }) => Client> {
    const specifier = "@libsql/client"
    const module = await import(specifier) as typeof import("@libsql/client")

    return module.createClient
}

class TursoServerlessClient {
    readonly protocol = "https"
    readonly closed = false
    private readonly connection: Connection

    constructor(config: Config) {
        this.connection = connect(config)
    }

    execute(stmt: InStatement, args?: InArgs): Promise<ResultSet> {
        if (typeof stmt === "string") {
            return this.connection.execute(stmt, Array.isArray(args) ? args : undefined)
        }

        return this.connection.execute(stmt.sql, Array.isArray(stmt.args) ? stmt.args : undefined)
    }

    batch(stmts: Array<InStatement>, mode?: TransactionMode): Promise<Array<ResultSet>> {
        return this.connection.batch(stmts as BatchStatement[], mapTransactionMode(mode)) as Promise<Array<ResultSet>>
    }

    close(): void {
        void this.connection.close()
    }
}

function mapTransactionMode(mode?: TransactionMode): "deferred" | "immediate" | undefined {
    if (mode === "write") {
        return "immediate"
    }

    if (mode === "deferred") {
        return "deferred"
    }

    return undefined
}
