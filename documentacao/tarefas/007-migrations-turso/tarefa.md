# T-007 - Migrations e preparo para Turso

**Estado:** Concluida **Tipo:** Infraestrutura

## Resumo

O projeto precisa de uma estrutura simples para criar o schema inicial em um banco Turso em branco e versionar futuras alteracoes de banco.
A aplicacao tambem precisa aceitar os dados de conexao remota do Turso para uso local e no Deno Deploy.

## Escopo

- Criar um script SQL inicial versionado para o schema atual.
- Criar uma estrutura de migrations SQL manuais para alteracoes futuras.
- Disponibilizar um helper local para aplicar os scripts quando necessario.
- Preparar a configuracao da aplicacao para usar URL e token do Turso via variaveis de ambiente.
- Documentar como aplicar o schema inicial manualmente no Turso.

## Fora do escopo

- Automatizar migrations em producao.
- Criar o banco Turso ou configurar a conta do usuario.
- Publicar a aplicacao no Deno Deploy.
- Migrar dados reais de `Livros.db` para o Turso.

## Expectativas de aceite

- Existe um arquivo SQL inicial capaz de criar o schema atual em um banco vazio.
- Existe uma convencao clara para adicionar novas migrations.
- Existe uma forma local opcional de aplicar os scripts versionados.
- A aplicacao consegue receber URL e token do Turso por variaveis de ambiente.

## Conhecimento relacionado

- [Persistencia com libSQL e Turso](../../conhecimento.md#persistencia-com-libsql-e-turso): define libSQL local e Turso como direcao
  arquitetural.
- [Estado atual](../../conhecimento.md#estado-atual): descreve as tabelas e recursos persistidos atualmente.

## Avaliacao arquitetural

A estrutura de migrations passa a ser uma decisao permanente de infraestrutura. O conhecimento local deve ser consolidado quando a tarefa
for encerrada.

## Decisoes pendentes

Nenhuma.

## Controle de fases

- Estrutura inicial de migrations SQL criada em `infraestrutura/migrations`.
- Helper local `deno task db:migrate` criado para aplicacao opcional das migrations.
- Cliente libSQL preparado para receber `LIVROS_DATABASE_URL` e `LIVROS_DATABASE_AUTH_TOKEN`.
- Driver de producao ajustado para `@tursodatabase/serverless`, evitando dependencias nativas no Deno Deploy.
- Decisao permanente registrada em `documentacao/conhecimento.md`.
- URL do banco Turso registrada: `libsql://livros-gerson-msj.aws-us-east-1.turso.io`.

## Resumo final da tarefa

### Fonte da verdade

A tarefa criou uma estrutura simples de migrations SQL manuais em `infraestrutura/migrations`, com `0001_schema_inicial.sql` como schema
inicial do banco e uma tabela `schema_migrations` para registrar versoes aplicadas. A aplicacao foi preparada para acessar Turso usando
`LIVROS_DATABASE_URL` e `LIVROS_DATABASE_AUTH_TOKEN`, mantendo `file:Livros.db` como padrao local quando a URL nao estiver configurada.

O banco Turso de producao foi definido como `libsql://livros-gerson-msj.aws-us-east-1.turso.io`, com token mantido fora da documentacao e do
repositorio. A migration inicial foi aplicada com sucesso no Turso pelo usuario, e as variaveis de ambiente foram configuradas em producao.
O acesso remoto em producao usa `@tursodatabase/serverless` para evitar carregamento de modulos nativos no Deno Deploy, enquanto o banco
local continua usando `@libsql/client`.

### Referencias

- [Migrations](../../../infraestrutura/migrations/README.md): convencao e uso manual dos scripts SQL.
- [Schema inicial](../../../infraestrutura/migrations/0001_schema_inicial.sql): script SQL inicial aplicado no Turso.
- [Conhecimento permanente](../../conhecimento.md#persistencia-com-libsql-e-turso): decisao consolidada de migrations e Turso.
