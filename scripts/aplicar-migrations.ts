import { createClient } from "@libsql/client"

const DEFAULT_DATABASE_URL = "file:Livros.db"
const MIGRATIONS_DIR = new URL("../infraestrutura/migrations/", import.meta.url)

const url = Deno.env.get("LIVROS_DATABASE_URL") ?? DEFAULT_DATABASE_URL
const authToken = Deno.env.get("LIVROS_DATABASE_AUTH_TOKEN")

const client = createClient({
    url,
    authToken
})

const migrations: string[] = []

for await (const entry of Deno.readDir(MIGRATIONS_DIR)) {
    if (entry.isFile && entry.name.endsWith(".sql")) {
        migrations.push(entry.name)
    }
}

for (const migration of migrations.sort()) {
    const migrationUrl = new URL(migration, MIGRATIONS_DIR)
    const sql = await Deno.readTextFile(migrationUrl)

    console.log(`Aplicando ${migration} em ${url}`)
    await client.executeMultiple(sql)
}

client.close()
