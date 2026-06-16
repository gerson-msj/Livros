# TR-001 - Cadastro de usuarios

**Estado:** Em desenvolvimento **Tipo:** Nova capacidade

## Resumo

O projeto precisa permitir que qualquer usuario crie uma conta inicial e entre diretamente na area segura. O trabalho deve entregar a rota
`/cadastro`, criar a sessao inicial apos cadastro bem-sucedido, apresentar a chave de redefinicao de senha e proteger a rota `/biblioteca`.

## Escopo

- Criar a tela `/cadastro` com nome de usuario e senha.
- Permitir visualizar a senha digitada, sem caixa de confirmacao.
- Validar nome de usuario e senha com minimo de 5 caracteres apos remover espacos ao redor.
- Armazenar o nome de usuario em letras minusculas.
- Usar `is-danger` do Bulma quando o valor de um campo estiver invalido.
- Gerar chave de redefinicao de senha em formato UUID.
- Apresentar a chave de redefinicao ao usuario apos cadastro bem-sucedido.
- Criptografar senha e chave de redefinicao no banco.
- Criar uma sessao imediatamente apos cadastro bem-sucedido usando cookie HTTP.
- Registrar a sessao no banco com validade de uma semana.
- Encaminhar o usuario para `/biblioteca` depois que ele visualizar a chave.
- Proteger `/biblioteca`, redirecionando visitantes sem sessao para `/cadastro`.
- Redirecionar usuarios ja logados de `/cadastro` para `/biblioteca`.
- Criar `/biblioteca` como area segura contendo somente a opcao de saida.
- Permitir sair da sessao a partir da biblioteca.
- Garantir funcionamento da tela em desktop e mobile.

## Fora do escopo

- Login separado.
- Redefinicao de senha usando a chave gerada.
- Cadastro, edicao ou listagem de livros, autores e series.
- Perfil de usuario ou edicao de conta.
- Confirmacao de senha no cadastro.

## Expectativas de aceite

- Um visitante consegue se cadastrar em `/cadastro` informando nome de usuario e senha validos.
- Apos cadastro bem-sucedido, o usuario visualiza uma chave UUID de redefinicao de senha.
- Depois de visualizar a chave, o usuario e levado para `/biblioteca` ja logado.
- Uma sessao valida permite acessar `/biblioteca`.
- Acesso direto a `/biblioteca` sem sessao redireciona para `/cadastro`.
- Acesso a `/cadastro` com sessao valida redireciona para `/biblioteca`.
- A biblioteca permite sair da sessao.
- Senha e chave de redefinicao nao ficam armazenadas em texto puro no banco.
- Nome de usuario e senha com menos de 5 caracteres sao recusados depois de remover espacos ao redor.
- O nome de usuario fica armazenado em letras minusculas.
- Campos invalidos sao indicados visualmente com `is-danger`.
- A interface permanece utilizavel em desktop e mobile.

## Conhecimento relacionado

- [Usuario](../conhecimento.md#usuario): cadastro, chave de redefinicao e entrada direta na area segura ja fazem parte do dominio planejado.
- [Autenticacao e redefinicao de senha](../conhecimento.md#autenticacao-e-redefinicao-de-senha): o trabalho concretiza a primeira parte da
  autenticacao sem email.
- [Persistencia com libSQL e Turso](../conhecimento.md#persistencia-com-libsql-e-turso): sessoes e credenciais exigem persistencia local
  inicial.
- [Interface com Bulma](../conhecimento.md#interface-com-bulma): a tela deve usar os recursos visuais ja escolhidos para o projeto.

## Avaliacao arquitetural

Impacto permanente identificado: sim. O trabalho transforma parte do dominio de usuario e autenticacao planejados em recurso existente,
introduz persistencia de usuarios e sessoes e define detalhes tecnicos de seguranca para senha, chave de redefinicao e cookie de sessao.

Quando a entrega for validada, o conhecimento permanente devera ser atualizado para diferenciar os recursos implementados dos recursos ainda
planejados.

## Decisoes pendentes

Nenhuma.

## Plano

**Revisao:** 2
**Proxima tarefa:** Aguardando validacao do plano restante

### Estrategia

Entregar o cadastro em fatias verticais, mantendo todas as tarefas restantes visiveis para validacao humana antes de liberar o proximo
desenvolvimento. A execucao continuara faseada: cada tarefa sera desenvolvida, auditada e validada separadamente.

A implementacao deve seguir DDD de forma pragmatica, separando regras de usuario e sessao dos detalhes de Fresh, cookies e banco. As rotas
Fresh devem preferir pagina e handlers proprios: `/cadastro` usando `GET` e `POST` da propria rota, e `/biblioteca` fazendo o mesmo para
acesso seguro e saida.

O banco local sera `Livros.db`, com libSQL como direcao da aplicacao. O `sqlite3.exe` disponivel no diretorio do projeto pode ser usado como
apoio de verificacao direta da base, sem virar dependencia da aplicacao. O Vite deve ignorar alteracoes em `Livros.db` para evitar refresh
durante o desenvolvimento.

Ao final das tarefas funcionais, a verificacao integrada deve consolidar um mapa de fluxo completo do cadastro ate a saida da area segura.

### Historico do plano

- 2026-06-16: Revisao 2 reorganiza o plano para manter T02, T03 e T04 escritas em bloco antes da validacao e registra que o mapa completo
  sera consolidado ao final do trabalho.

### T01 - Base de dominio e persistencia de autenticacao

**Estado:** Concluida
**Depende de:** Nenhuma

**Objetivo tecnico**

Criar a base de dominio, persistencia e composicao necessaria para cadastrar usuarios, gerar chave de redefinicao, criar sessoes e
validar/encerrar sessoes.

**Contexto necessario**

- [Usuario](../conhecimento.md#usuario): regras de cadastro, chave de redefinicao e entrada direta na area segura.
- [Autenticacao e redefinicao de senha](../conhecimento.md#autenticacao-e-redefinicao-de-senha): ausencia de email e necessidade de
  armazenamento seguro.
- [Persistencia com libSQL e Turso](../conhecimento.md#persistencia-com-libsql-e-turso): persistencia local inicial com compatibilidade
  futura.
- [Composicao e injecao de dependencias](../conhecimento.md#composicao-e-injecao-de-dependencias): provider simples por request para
  dependencias de infraestrutura.
- [Organizacao orientada a dominio](../conhecimento.md#organizacao-orientada-a-dominio): DDD pragmatico sem complexidade preventiva.

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

**Fora da tarefa**

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
- Configurado o Vite para ignorar alteracoes em `Livros.db`, verificacao focada refeita e tarefa reenviada para auditoria.
- Reauditoria tecnica aprovada apos ajuste do Vite.
- Validacao humana aprovada com o ajuste para ignorar `Livros.db`.
- Conclusao confirmada; checkpoint por commit nao foi criado porque o projeto ainda nao esta associado a um repositorio Git.

### T02 - Cadastro na rota /cadastro com handlers proprios

**Estado:** Planejada
**Depende de:** T01

**Objetivo tecnico**

Implementar a rota `/cadastro` com pagina e handlers proprios para exibir o formulario, processar o cadastro, criar sessao inicial, gravar o
cookie HTTP e apresentar a chave de redefinicao antes de encaminhar o usuario para `/biblioteca`.

**Contexto necessario**

- [Rotas Fresh e handlers](../conhecimento.md#rotas-fresh-e-handlers): a rota deve preferir `GET` e `POST` proprios em vez de API separada.
- [Interface com Bulma](../conhecimento.md#interface-com-bulma): uso visual do Bulma na tela.
- T01 concluida.

**Entrega esperada**

- Pagina `/cadastro` responsiva com nome de usuario, senha e controle para visualizar a senha digitada.
- Handler `GET` da propria rota renderizando o formulario para visitante sem sessao e redirecionando usuario ja logado para `/biblioteca`.
- Handler `POST` da propria rota removendo espacos ao redor, validando campos, criando usuario e sessao, e configurando cookie HTTP.
- Cadastro bem-sucedido mostra a chave UUID de redefinicao ao usuario.
- Apos visualizar a chave, o usuario consegue seguir para `/biblioteca` usando a sessao criada.
- Campos invalidos usam `is-danger` do Bulma.

**Criterios de conclusao**

- Visitante sem sessao consegue abrir `/cadastro`.
- Nome de usuario e senha com menos de 5 caracteres apos `trim` sao recusados.
- Dados invalidos retornam ao formulario com indicacao `is-danger`.
- Cadastro valido cria usuario, sessao persistida e cookie HTTP.
- Chave UUID de redefinicao e apresentada ao usuario depois do cadastro.
- Senha pode ser visualizada por acao do usuario no formulario.
- Usuario ja logado que acessa `/cadastro` e redirecionado para `/biblioteca`.
- A tela permanece utilizavel em desktop e mobile.

**Fora da tarefa**

- Implementar o conteudo final da biblioteca alem do redirecionamento necessario.
- Logout.
- Login separado e redefinicao de senha.
- APIs separadas, salvo descoberta tecnica indispensavel.

**Evolucao**

- Planejada para validacao humana junto das demais tarefas restantes.

### T03 - Biblioteca segura na rota /biblioteca com handlers proprios

**Estado:** Planejada
**Depende de:** T02

**Objetivo tecnico**

Implementar `/biblioteca` como area segura minima, com verificacao de sessao no handler `GET` da propria pagina e saida da sessao por
handler `POST`.

**Contexto necessario**

- [Rotas Fresh e handlers](../conhecimento.md#rotas-fresh-e-handlers): a rota deve concentrar pagina e handlers quando suficiente.
- T02 concluida.

**Entrega esperada**

- `/biblioteca` redireciona visitantes sem sessao valida para `/cadastro`.
- Usuario autenticado visualiza somente a opcao de saida.
- Logout encerra a sessao no banco, limpa o cookie e impede novo acesso seguro com a sessao encerrada.
- Redirecionamentos entre `/cadastro` e `/biblioteca` permanecem coerentes para usuario logado e deslogado.

**Criterios de conclusao**

- Acesso direto a `/biblioteca` sem sessao redireciona para `/cadastro`.
- Acesso com sessao valida renderiza a biblioteca minima.
- Acao de saida encerra a sessao, limpa o cookie e redireciona para `/cadastro`.
- Sessao encerrada nao autentica novo acesso a `/biblioteca`.
- A tela permanece utilizavel em desktop e mobile.

**Fora da tarefa**

- Recursos de livros, autores ou series.
- Login separado e redefinicao de senha.
- APIs separadas, salvo descoberta tecnica indispensavel.

**Evolucao**

- Planejada para validacao humana junto das demais tarefas restantes.

### T04 - Verificacao integrada e mapa final do fluxo

**Estado:** Planejada
**Depende de:** T03

**Objetivo tecnico**

Validar o fluxo completo de cadastro, sessao, protecao de rota, logout, responsividade e persistencia segura, consolidando um mapa de fluxo
final do trabalho.

**Contexto necessario**

- T01, T02 e T03 concluidas.

**Entrega esperada**

- Fluxo completo verificado em desktop e mobile.
- Banco inspecionado para confirmar sessao registrada, expiracao coerente e ausencia de senha/chave em texto puro.
- Ajustes pequenos identificados durante a verificacao aplicados dentro do escopo do trabalho.
- Mapa de fluxo consolidado cobrindo o caminho completo de cadastro em `/cadastro`, exibicao da chave, entrada em `/biblioteca` e saida da
  sessao.

**Criterios de conclusao**

- Cadastro leva o usuario ate a visualizacao da chave e depois a `/biblioteca`.
- Redirecionamentos de usuario logado e deslogado funcionam como esperado.
- Logout invalida o acesso seguro.
- Verificacao automatizada e/ou manual cobre o fluxo principal.
- `sqlite3.exe`, quando usado, confirma que os dados sensiveis nao foram persistidos em texto puro.
- Mapa final permite validar o fluxo completo sem depender dos mapas parciais.

**Fora da tarefa**

- Novas capacidades de autenticacao fora do cadastro inicial.
- Recursos de livros, autores ou series.
- Redefinicao de senha.

**Evolucao**

- Planejada para validacao humana junto das demais tarefas restantes.

## Evidencias da T01

### Mapa de fluxo - T01

**Fluxo:** cadastro de um novo usuario e criacao da sessao inicial na base de autenticacao. **Resultado produzido:** usuario persistido com
senha e chave protegidas, sessao persistida com validade de uma semana e operacoes para consultar/encerrar sessao. **Exemplo acompanhado:**
nome `JOANA` e senha `senha-secreta` entram no servico; o usuario `joana` e salvo e recebe uma sessao valida ate `2026-06-23T12:00:00.000Z`.
**Resumo:** o dominio normaliza e valida a entrada, o servico coordena hashes, UUIDs e validade, e os repositorios gravam usuarios e sessoes
no libSQL local.

### 1. Compor dependencias do request

**Componente:** [Middleware principal](../../main.ts:9) e [Provider](../../infraestrutura/provider.ts:10) - 🟡 **Modificado** / 🟢
**Criado**

**Entra:** um request Fresh. **Faz:** cria um provider por request em `ctx.state.services`, reutilizando o cliente libSQL global e
instanciando repositorios, hasher, gerador de UUID e relogio do sistema. **Sai:** `AuthenticationService` disponivel para as rotas futuras.

### 2. Normalizar e validar o cadastro

**Componente:** [Dominio de autenticacao](../../dominio/autenticacao.ts:62) - 🟢 **Criado**

**Entra:** nome `JOANA` e senha `senha-secreta`. **Faz:** remove espacos ao redor, converte o nome para minusculas e exige no minimo 5
caracteres em nome e senha. **Sai:** nome `joana` e senha `senha-secreta`, ou erro de validacao com os campos invalidos.

### 3. Criar usuario e sessao

**Componente:** [Servico de autenticacao](../../aplicacao/autenticacao_service.ts:55) - 🟢 **Criado**

**Entra:** cadastro normalizado e dependencias de repositorio, hasher, UUID e relogio. **Faz:** impede duplicidade por nome de usuario, gera
a chave UUID de redefinicao, calcula hashes da senha e da chave, cria o usuario e cria a sessao com expiracao de sete dias. **Sai:** usuario
persistido, sessao persistida e chave de redefinicao em texto claro apenas no retorno do cadastro.

### 4. Proteger senha e chave

**Componente:** [Hasher WebCrypto](../../infraestrutura/crypto.ts:8) - 🟢 **Criado**

**Entra:** senha `senha-secreta` e chave UUID gerada. **Faz:** aplica PBKDF2 com SHA-256, salt aleatorio e 210000 iteracoes; o resultado
inclui versao, iteracoes, salt e hash em base64url. **Sai:** hashes que podem ser verificados, mas nao armazenam os segredos em texto puro.

### 5. Persistir em libSQL local

**Componente:** [Schema e cliente](../../infraestrutura/database.ts:18) e
[Repositorios libSQL](../../infraestrutura/auth_repositories.ts:6) - 🟢 **Criado**

**Entra:** usuario com nome `joana`, hashes e sessao com expiracao. **Faz:** garante as tabelas `users` e `sessions`, grava o usuario com
`username` unico e grava a sessao com `expires_at` e `ended_at` nulo. **Sai:** registros persistidos no banco local configurado por
`LIVROS_DATABASE_URL` ou, por padrao, `file:Livros.db`.

### 6. Consultar ou encerrar sessao

**Componente:** [Servico de autenticacao](../../aplicacao/autenticacao_service.ts:55) e
[Repositorio de sessoes](../../infraestrutura/auth_repositories.ts:44) - 🟢 **Criado**

**Entra:** identificador da sessao. **Faz:** consulta somente sessoes sem `ended_at` e com `expires_at` maior que o momento atual; ao sair,
grava `ended_at`. **Sai:** sessao ativa quando valida, ou `null` depois de expirada/encerrada.

### 7. Ignorar alteracoes do banco no desenvolvimento

**Componente:** [Configuracao Vite](../../vite.config.ts:4) - 🟡 **Modificado**

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
- `deno task check` nao ficou conclusivo porque o projeto ainda contem arquivos do template fora do padrao global de formatacao; a T01 foi
  validada com comandos focados nos arquivos alterados.

## Verificacoes - T01

- `deno lint` focado em `main.ts`, `utils.ts`, `routes/index.tsx`, `dominio/autenticacao.ts`, `aplicacao/autenticacao_service.ts`,
  `aplicacao/autenticacao_service_test.ts`, `infraestrutura/crypto.ts`, `infraestrutura/database.ts`, `infraestrutura/auth_repositories.ts`,
  `infraestrutura/auth_repositories_test.ts` e `infraestrutura/provider.ts`: aprovado.
- `deno check` focado em `main.ts`, servico, infraestrutura, teste de repositorio e `routes/index.tsx`: aprovado.
- `deno test -A aplicacao/autenticacao_service_test.ts infraestrutura/auth_repositories_test.ts`: 5 testes aprovados.
- `sqlite3.exe Livros.db ".schema users"` e `sqlite3.exe Livros.db ".schema sessions"`: tabelas `users`, `sessions` e indices de sessao
  presentes no banco local.
- Apos ajuste do Vite, `deno lint`, `deno check` e `deno test -A` focados foram repetidos incluindo `vite.config.ts`: aprovado.

## Auditoria - T01

**Resultado:** Aprovada

### Achados

- Nenhum.

### Verificacoes

- Leitura do escopo, criterios, evolucao, verificacoes e mapa de fluxo da T01.
- Revisao de `dominio/autenticacao.ts`, `aplicacao/autenticacao_service.ts`, `infraestrutura/crypto.ts`, `infraestrutura/database.ts`,
  `infraestrutura/auth_repositories.ts`, `infraestrutura/provider.ts`, `main.ts` e `utils.ts`.
- Reauditoria de `vite.config.ts` apos ajuste para ignorar alteracoes em `Livros.db`.
- Revisao dos testes `aplicacao/autenticacao_service_test.ts` e `infraestrutura/auth_repositories_test.ts`.
- `deno lint` focado nos arquivos alterados da T01: aprovado.
- `deno check` focado nos arquivos alterados da T01: aprovado.
- `deno test -A aplicacao/autenticacao_service_test.ts infraestrutura/auth_repositories_test.ts`: 5 testes aprovados.
- `sqlite3.exe Livros.db ".schema users"` e `sqlite3.exe Livros.db ".schema sessions"`: schema esperado presente.
- Repeticao de `deno lint`, `deno check` e `deno test -A` focados incluindo `vite.config.ts`: aprovado.

### Mapa de fluxo

- Correto para a T01. O mapa representa o fluxo real implementado para dominio, servico, hashing, persistencia, sessao e configuracao do
  Vite para ignorar `Livros.db`.

## Validacao humana - T01

**Resultado:** Aprovado
**Retorno:** Resultado aprovado com o ajuste de Vite para ignorar alteracoes em `Livros.db`.
