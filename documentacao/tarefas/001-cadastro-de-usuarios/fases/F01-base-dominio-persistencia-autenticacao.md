# F01 - Base de dominio e persistencia de autenticacao

**Tarefa:** [TF-001 - Cadastro de usuarios](../tarefa.md)

**Estado:** Concluida **Depende de:** Nenhuma

**Objetivo tecnico**

Criar a base de dominio, persistencia e composicao necessaria para cadastrar usuarios, gerar chave de redefinicao, criar sessoes e
validar/encerrar sessoes.

**Contexto necessario**

- [Usuario](../../../conhecimento.md#usuario): regras de cadastro, chave de redefinicao e entrada direta na area segura.
- [Autenticacao e redefinicao de senha](../../../conhecimento.md#autenticacao-e-redefinicao-de-senha): ausencia de email e necessidade de
  armazenamento seguro.
- [Persistencia com libSQL e Turso](../../../conhecimento.md#persistencia-com-libsql-e-turso): persistencia local inicial com
  compatibilidade futura.
- [Composicao e injecao de dependencias](../../../conhecimento.md#composicao-e-injecao-de-dependencias): provider simples por request para
  dependencias de infraestrutura.
- [Organizacao orientada a dominio](../../../conhecimento.md#organizacao-orientada-a-dominio): DDD pragmatico sem complexidade preventiva.

**Entrega esperada**

- Estrutura persistente para usuarios e sessoes no banco local.
- Operacoes de dominio/aplicacao para normalizar nome de usuario, validar minimo de 5 caracteres, criar usuario, gerar chave UUID de
  redefinicao, criar sessao com validade de uma semana, localizar sessao valida e encerrar sessao.
- Senha e chave de redefinicao armazenadas por hash criptografico, nunca em texto puro.
- Composicao minima disponivel para uso posterior pelas rotas.
- Vite configurado para ignorar alteracoes em `Livros.db`.

**Criterios de conclusao**

- Usuario pode ser cadastrado com nome normalizado em minusculas.
- Nome de usuario e senha invalidos por tamanho sao recusados apos `trim`.
- Senha e chave de redefinicao persistidas nao correspondem aos valores em texto puro.
- Sessao criada fica registrada no banco com expiracao de uma semana.
- Sessao valida pode ser consultada e sessao encerrada deixa de autenticar.
- Alteracoes em `Livros.db` nao disparam refresh do Vite.
- Comportamentos relevantes possuem verificacao automatizada.

**Fora da fase**

- Tela `/cadastro`.
- Tela `/biblioteca`.
- Cookies e redirecionamentos HTTP.
- Login separado e redefinicao de senha.

**Evolucao**

- Planejada e liberada para desenvolvimento.
- Iniciada a execucao; projeto sem repositorio Git inicializado, portanto o checkpoint por commit nao se aplica nesta etapa.
- Verificacao focada concluida com lint, check e testes automatizados da base de autenticacao.
- Enviada para auditoria tecnica.
- Retornada ao desenvolvimento apos validacao humana apontar que o Vite deve ignorar alteracoes em `Livros.db`.
- Configurado o Vite para ignorar alteracoes em `Livros.db`, verificacao focada refeita e fase reenviada para auditoria.
- Reauditoria tecnica aprovada apos ajuste do Vite.
- Validacao humana aprovada com o ajuste para ignorar `Livros.db`.
- Conclusao confirmada; checkpoint por commit nao foi criado porque o projeto ainda nao esta associado a um repositorio Git.

## Evidencias da F01

### Mapa de fluxo - F01

**Fluxo:** cadastro de um novo usuario e criacao da sessao inicial na base de autenticacao. **Resultado produzido:** usuario persistido com
senha e chave protegidas, sessao persistida com validade de uma semana e operacoes para consultar/encerrar sessao. **Exemplo acompanhado:**
nome `JOANA` e senha `senha-secreta` entram no servico; o usuario `joana` e salvo e recebe uma sessao valida ate `2026-06-23T12:00:00.000Z`.
**Resumo:** o dominio normaliza e valida a entrada, o servico coordena hashes, UUIDs e validade, e os repositorios gravam usuarios e sessoes
no libSQL local.

### 1. Compor dependencias do request

**Componente:** [Middleware principal](../../../../main.ts:9) e [Provider](../../../../infraestrutura/provider.ts:10) - 🟡 **Modificado** /
🟢 **Criado**

**Entra:** um request Fresh. **Faz:** cria um provider por request em `ctx.state.services`, reutilizando o cliente libSQL global e
instanciando repositorios, hasher, gerador de UUID e relogio do sistema. **Sai:** `AuthenticationService` disponivel para as rotas futuras.

### 2. Normalizar e validar o cadastro

**Componente:** [Dominio de autenticacao](../../../../dominio/autenticacao.ts:62) - 🟢 **Criado**

**Entra:** nome `JOANA` e senha `senha-secreta`. **Faz:** remove espacos ao redor, converte o nome para minusculas e exige no minimo 5
caracteres em nome e senha. **Sai:** nome `joana` e senha `senha-secreta`, ou erro de validacao com os campos invalidos.

### 3. Criar usuario e sessao

**Componente:** [Servico de autenticacao](../../../../aplicacao/autenticacao_service.ts:55) - 🟢 **Criado**

**Entra:** cadastro normalizado e dependencias de repositorio, hasher, UUID e relogio. **Faz:** impede duplicidade por nome de usuario, gera
a chave UUID de redefinicao, calcula hashes da senha e da chave, cria o usuario e cria a sessao com expiracao de sete dias. **Sai:** usuario
persistido, sessao persistida e chave de redefinicao em texto claro apenas no retorno do cadastro.

### 4. Proteger senha e chave

**Componente:** [Hasher WebCrypto](../../../../infraestrutura/crypto.ts:8) - 🟢 **Criado**

**Entra:** senha `senha-secreta` e chave UUID gerada. **Faz:** aplica PBKDF2 com SHA-256, salt aleatorio e 210000 iteracoes; o resultado
inclui versao, iteracoes, salt e hash em base64url. **Sai:** hashes que podem ser verificados, mas nao armazenam os segredos em texto puro.

### 5. Persistir em libSQL local

**Componente:** [Schema e cliente](../../../../infraestrutura/database.ts:18) e
[Repositorios libSQL](../../../../infraestrutura/auth_repositories.ts:6) - 🟢 **Criado**

**Entra:** usuario com nome `joana`, hashes e sessao com expiracao. **Faz:** garante as tabelas `users` e `sessions`, grava o usuario com
`username` unico e grava a sessao com `expires_at` e `ended_at` nulo. **Sai:** registros persistidos no banco local configurado por
`LIVROS_DATABASE_URL` ou, por padrao, `file:Livros.db`.

### 6. Consultar ou encerrar sessao

**Componente:** [Servico de autenticacao](../../../../aplicacao/autenticacao_service.ts:55) e
[Repositorio de sessoes](../../../../infraestrutura/auth_repositories.ts:44) - 🟢 **Criado**

**Entra:** identificador da sessao. **Faz:** consulta somente sessoes sem `ended_at` e com `expires_at` maior que o momento atual; ao sair,
grava `ended_at`. **Sai:** sessao ativa quando valida, ou `null` depois de expirada/encerrada.

### 7. Ignorar alteracoes do banco no desenvolvimento

**Componente:** [Configuracao Vite](../../../../vite.config.ts:4) - 🟡 **Modificado**

**Entra:** alteracoes no arquivo local `Livros.db`. **Faz:** configura `server.watch.ignored` para ignorar `**/Livros.db`. **Sai:**
alteracoes no banco local nao disparam refresh/reload do Vite.

| Estacao   | Componente            | Impacto | Entra -> Sai                                  |
| --------- | --------------------- | ------- | --------------------------------------------- |
| Compor    | `main.ts` + provider  | 🟡/🟢   | Request -> servico em `ctx.state`             |
| Validar   | Dominio               | 🟢      | Dados digitados -> dados normalizados ou erro |
| Criar     | Servico               | 🟢      | Dados validos -> usuario, sessao e chave      |
| Proteger  | Hasher                | 🟢      | Segredos -> hashes verificaveis               |
| Persistir | Repositorios libSQL   | 🟢      | Usuario/sessao -> registros no banco          |
| Sessao    | Servico + repositorio | 🟢      | ID da sessao -> sessao ativa ou `null`        |
| Vite      | Configuracao Vite     | 🟡      | Alteracao em `Livros.db` -> sem refresh       |

Aspectos relevantes:

- A chave de redefinicao e retornada em texto claro apenas no resultado do cadastro; o banco recebe somente o hash.
- O `sqlite3.exe` permanece como apoio externo de inspecao, sem ser usado pela aplicacao.
- `deno task check` nao ficou conclusivo porque o projeto ainda contem arquivos do template fora do padrao global de formatacao; a F01 foi
  validada com comandos focados nos arquivos alterados.

## Verificacoes - F01

- `deno lint` focado em `main.ts`, `utils.ts`, `routes/index.tsx`, `dominio/autenticacao.ts`, `aplicacao/autenticacao_service.ts`,
  `aplicacao/autenticacao_service_test.ts`, `infraestrutura/crypto.ts`, `infraestrutura/database.ts`, `infraestrutura/auth_repositories.ts`,
  `infraestrutura/auth_repositories_test.ts` e `infraestrutura/provider.ts`: aprovado.
- `deno check` focado em `main.ts`, servico, infraestrutura, teste de repositorio e `routes/index.tsx`: aprovado.
- `deno test -A aplicacao/autenticacao_service_test.ts infraestrutura/auth_repositories_test.ts`: 5 testes aprovados.
- `sqlite3.exe Livros.db ".schema users"` e `sqlite3.exe Livros.db ".schema sessions"`: tabelas `users`, `sessions` e indices de sessao
  presentes no banco local.
- Apos ajuste do Vite, `deno lint`, `deno check` e `deno test -A` focados foram repetidos incluindo `vite.config.ts`: aprovado.

## Auditoria - F01

**Resultado:** Aprovada

### Achados

- Nenhum.

### Verificacoes

- Leitura do escopo, criterios, evolucao, verificacoes e mapa de fluxo da F01.
- Revisao de `dominio/autenticacao.ts`, `aplicacao/autenticacao_service.ts`, `infraestrutura/crypto.ts`, `infraestrutura/database.ts`,
  `infraestrutura/auth_repositories.ts`, `infraestrutura/provider.ts`, `main.ts` e `utils.ts`.
- Reauditoria de `vite.config.ts` apos ajuste para ignorar alteracoes em `Livros.db`.
- Revisao dos testes `aplicacao/autenticacao_service_test.ts` e `infraestrutura/auth_repositories_test.ts`.
- `deno lint` focado nos arquivos alterados da F01: aprovado.
- `deno check` focado nos arquivos alterados da F01: aprovado.
- `deno test -A aplicacao/autenticacao_service_test.ts infraestrutura/auth_repositories_test.ts`: 5 testes aprovados.
- `sqlite3.exe Livros.db ".schema users"` e `sqlite3.exe Livros.db ".schema sessions"`: schema esperado presente.
- Repeticao de `deno lint`, `deno check` e `deno test -A` focados incluindo `vite.config.ts`: aprovado.

### Mapa de fluxo

- Correto para a F01. O mapa representa o fluxo real implementado para dominio, servico, hashing, persistencia, sessao e configuracao do
  Vite para ignorar `Livros.db`.

## Validacao humana - F01

**Resultado:** Aprovado **Retorno:** Resultado aprovado com o ajuste de Vite para ignorar alteracoes em `Livros.db`.
