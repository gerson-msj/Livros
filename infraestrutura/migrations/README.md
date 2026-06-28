# Migrations

Esta pasta guarda os scripts SQL versionados do banco.

## Uso manual no Turso

Para criar um banco Turso em branco com o schema inicial:

```powershell
turso db shell livros < infraestrutura/migrations/0001_schema_inicial.sql
```

Para futuras alteracoes de schema, crie um novo arquivo com o proximo numero,
por exemplo `0002_nome_da_mudanca.sql`, e registre a versao em
`schema_migrations` dentro do proprio script.

## Uso local opcional

O projeto tambem possui uma task auxiliar:

```powershell
deno task db:migrate
```

Por padrao ela usa `file:Livros.db`. Para apontar para outro banco:

```powershell
$env:LIVROS_DATABASE_URL = "file:outro.db"
deno task db:migrate
```

Para Turso remoto, informe tambem `LIVROS_DATABASE_AUTH_TOKEN`.
