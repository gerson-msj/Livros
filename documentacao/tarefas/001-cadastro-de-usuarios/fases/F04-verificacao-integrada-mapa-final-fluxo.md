# F04 - Verificacao integrada e mapa final do fluxo

**Tarefa:** [TF-001 - Cadastro de usuarios](../tarefa.md)

**Estado:** Concluida **Depende de:** F03

**Objetivo tecnico**

Validar o fluxo completo de cadastro, sessao, protecao de rota, logout, responsividade e persistencia segura, consolidando um mapa de fluxo
final da tarefa.

**Contexto necessario**

- F01, F02 e F03 concluidas.

**Entrega esperada**

- Fluxo completo verificado em desktop e mobile.
- Banco inspecionado para confirmar sessao registrada, expiracao coerente e ausencia de senha/chave em texto puro.
- Ajustes pequenos identificados durante a verificacao aplicados dentro do escopo da tarefa.
- Mapa de fluxo consolidado cobrindo o caminho completo de cadastro em `/cadastro`, exibicao da chave, entrada em `/biblioteca` e saida da
  sessao.

**Criterios de conclusao**

- Cadastro leva o usuario ate a visualizacao da chave e depois a `/biblioteca`.
- Redirecionamentos de usuario logado e deslogado funcionam como esperado.
- Logout invalida o acesso seguro.
- Verificacao automatizada e/ou manual cobre o fluxo principal.
- `sqlite3.exe`, quando usado, confirma que os dados sensiveis nao foram persistidos em texto puro.
- Mapa final permite validar o fluxo completo sem depender dos mapas parciais.

**Fora da fase**

- Novas capacidades de autenticacao fora do cadastro inicial.
- Recursos de livros, autores ou series.
- Redefinicao de senha.

**Evolucao**

- Planejada para validacao humana junto das demais fases restantes.
- Validada pelo usuario em 2026-06-17; permanece planejada por depender da conclusao da F03.
- Liberada para desenvolvimento em 2026-06-17 apos checkpoint da F03.
- Iniciada a verificacao integrada do fluxo completo em 2026-06-17.
- Verificacao integrada concluida com teste automatizado, validacao HTTP local e inspecao do banco temporario.
- Enviada para auditoria tecnica.
- Validada pelo usuario em 2026-06-17.
- Conclusao confirmada pela auditoria em 2026-06-17.

## Evidencias da F04

### Mapa de fluxo - F04

**Fluxo:** cadastro inicial ate saida da area segura. **Resultado produzido:** verificacao integrada do cadastro, sessao, persistencia
segura, protecao de `/biblioteca`, logout e recusa da sessao encerrada. **Exemplo acompanhado:** nome `Gerson` e senha `senha-secreta`
entram em `/cadastro`; o usuario `gerson` visualiza a chave UUID, segue autenticado para `/biblioteca`, aciona "Sair" e o mesmo cookie deixa
de autenticar. **Resumo:** a rota de cadastro cria usuario/sessao e grava o cookie; a biblioteca exige sessao ativa; o logout encerra a
sessao no banco, limpa o cookie e devolve o usuario a `/cadastro`.

### 1. Abrir o cadastro sem sessao

**Componente:** [Handler GET de cadastro](../../../../routes/cadastro.tsx:25) - ⚪ **Existente**

**Entra:** request `GET /cadastro` sem cookie `livros_session`. **Faz:** nao encontra sessao ativa e prepara dados vazios para a pagina.
**Sai:** formulario de cadastro renderizavel, com estrutura responsiva da pagina.

### 2. Validar e processar dados do cadastro

**Componente:** [Formulario de cadastro](../../../../islands/CadastroForm.tsx:12),
[Handler POST de cadastro](../../../../routes/cadastro.tsx:35) e [Teste integrado](../../../../routes/fluxo_cadastro_biblioteca_test.ts:9) -
⚪ **Existente** / 🟢 **Criado**

**Entra:** `username` como `Gerson` e `password` como `senha-secreta`. **Faz:** o handler envia os dados ao servico de autenticacao; o
dominio remove espacos, converte o nome para `gerson`, valida tamanho minimo e recusa campos invalidos com `is-danger` quando necessario.
**Sai:** usuario normalizado ou resposta de formulario com erros.

### 3. Persistir usuario, segredos protegidos e sessao

**Componente:** [Servico de autenticacao](../../../../aplicacao/autenticacao_service.ts:55) e
[Repositorios libSQL](../../../../infraestrutura/auth_repositories.ts:6) - ⚪ **Existente**

**Entra:** cadastro valido. **Faz:** gera chave UUID de redefinicao, calcula hashes da senha e da chave, cria usuario e sessao com expiracao
de sete dias. **Sai:** banco com `username` `gerson`, hashes que nao correspondem aos segredos em texto puro e sessao ativa ate uma semana
depois da criacao.

### 4. Mostrar chave e gravar cookie de sessao

**Componente:** [Painel de chave](../../../../routes/cadastro.tsx:88) e
[Helper de cookie](../../../../infraestrutura/session_cookie.ts:22) - ⚪ **Existente**

**Entra:** chave UUID e sessao criada. **Faz:** mostra a chave de redefinicao uma vez na resposta do cadastro e grava `livros_session` com
`Path=/`, `HttpOnly`, `SameSite=Lax` e `Expires`. **Sai:** usuario com proximo passo para `/biblioteca` e cookie HTTP de sessao.

### 5. Redirecionar usuario logado fora do cadastro

**Componente:** [Handler GET de cadastro](../../../../routes/cadastro.tsx:25) - ⚪ **Existente**

**Entra:** novo `GET /cadastro` com cookie de sessao ativa. **Faz:** consulta a sessao pelo servico de autenticacao. **Sai:**
redirecionamento `303` para `/biblioteca`.

### 6. Acessar a biblioteca segura

**Componente:** [Handler GET de biblioteca](../../../../routes/biblioteca.tsx:5) e
[Pagina de biblioteca](../../../../routes/biblioteca.tsx:27) - ⚪ **Existente**

**Entra:** `GET /biblioteca` com cookie de sessao ativa. **Faz:** valida a sessao e libera a pagina minima. **Sai:** biblioteca com somente
a opcao "Sair". Sem sessao ativa, o mesmo handler retorna `303` para `/cadastro`.

### 7. Encerrar sessao e limpar cookie

**Componente:** [Handler POST de biblioteca](../../../../routes/biblioteca.tsx:16) e
[Helper de limpeza de cookie](../../../../infraestrutura/session_cookie.ts:35) - ⚪ **Existente**

**Entra:** submissao `POST /biblioteca` com cookie de sessao. **Faz:** grava `ended_at` na sessao quando o cookie existe e envia
`Set-Cookie` expirado com `Max-Age=0`. **Sai:** redirecionamento `303` para `/cadastro`.

### 8. Recusar acesso com sessao encerrada

**Componente:** [Repositorio de sessoes](../../../../infraestrutura/auth_repositories.ts:44) - ⚪ **Existente**

**Entra:** novo `GET /biblioteca` usando o identificador da sessao encerrada. **Faz:** a consulta de sessao ativa exige `ended_at IS NULL` e
expiracao futura. **Sai:** sessao nao encontrada e redirecionamento `303` para `/cadastro`.

| Estacao      | Componente                  | Impacto                | Entra -> Sai                             |
| ------------ | --------------------------- | ---------------------- | ---------------------------------------- |
| Abrir        | `GET /cadastro`             | ⚪ Existente           | Sem cookie -> formulario                 |
| Processar    | `POST /cadastro` + teste    | ⚪/🟢 Existente/Criado | Dados -> usuario normalizado ou erro     |
| Persistir    | Servico + repositorios      | ⚪ Existente           | Dados validos -> usuario/sessao/segredos |
| Chave        | Painel + cookie             | ⚪ Existente           | Sessao -> chave visivel e cookie HTTP    |
| Redirecionar | `GET /cadastro`             | ⚪ Existente           | Cookie ativo -> `/biblioteca`            |
| Proteger     | `GET /biblioteca`           | ⚪ Existente           | Cookie ativo -> tela segura              |
| Sair         | `POST /biblioteca` + cookie | ⚪ Existente           | Acao de saida -> sessao encerrada        |
| Bloquear     | Repositorio de sessoes      | ⚪ Existente           | Sessao encerrada -> redirect `/cadastro` |

Aspectos relevantes:

- A F04 nao adiciona nova capacidade de produto; ela adiciona verificacao integrada automatizada e consolida o mapa final do fluxo.
- A validacao HTTP local usou banco temporario `F04-http-validation.db`, removido ao fim da verificacao, para nao alterar `Livros.db`.
- O Browser interno nao estava disponivel nesta sessao. A utilizacao em desktop/mobile foi verificada de forma indireta pela presenca de
  `meta viewport` e classes responsivas Bulma nas paginas retornadas por HTTP; validacao visual em browser permanece uma lacuna residual.

## Verificacoes - F04

- `deno test -A routes\fluxo_cadastro_biblioteca_test.ts`: 1 teste integrado aprovado.
- `deno test -A routes\fluxo_cadastro_biblioteca_test.ts routes\cadastro_test.ts routes\biblioteca_test.ts
  aplicacao\autenticacao_service_test.ts infraestrutura\auth_repositories_test.ts`:
  12 testes aprovados.
- `deno fmt --check` focado em rotas, testes, autenticacao, repositorios, cookie e documentacao da F04: aprovado.
- `deno lint` focado em rotas, testes, autenticacao, repositorios e cookie: aprovado.
- `deno check` focado em rotas, testes, autenticacao, repositorios e cookie: aprovado.
- Validacao HTTP local em `http://127.0.0.1:5175` com banco temporario: `/biblioteca` sem sessao retornou `303` para `/cadastro`; cadastro
  invalido mostrou `is-danger`; cadastro valido mostrou chave de redefinicao e cookie `HttpOnly`; `/cadastro` com sessao ativa redirecionou
  para `/biblioteca`; `/biblioteca` autenticada retornou pagina com "Sair"; logout retornou `303` para `/cadastro`, limpou cookie com
  `Max-Age=0` e impediu novo acesso a `/biblioteca`.
- `sqlite3.exe F04-http-validation.db` confirmou usuario normalizado, `password_hash` diferente da senha em texto puro, chave de redefinicao
  nao persistida em texto puro, expiracao de sessao em uma semana e sessao encerrada apos logout.
- `deno task check`: falhou em `deno fmt --check .` por arquivos preexistentes fora do escopo da F04, como CSS estatico e arquivos do
  template; as verificacoes focadas acima cobriram os arquivos relacionados.

## Auditoria - F04

**Resultado:** Aprovada.

### Achados

Nenhum defeito bloqueante encontrado.

### Verificacoes da auditoria

- Revisado o teste integrado `routes/fluxo_cadastro_biblioteca_test.ts`, incluindo cadastro, redirecionamento de usuario logado,
  persistencia segura, acesso a `/biblioteca`, logout e recusa de sessao encerrada.
- Revisado o mapa de fluxo registrado nesta fase, que cobre as estacoes de cadastro, persistencia, cookie, protecao da biblioteca, saida e
  bloqueio posterior.
- Confirmado que as evidencias registram as verificacoes automatizadas, a validacao HTTP local e a inspecao direta do banco temporario.
- Confirmado que a falha de `deno task check` veio de formatacao global preexistente fora do escopo da F04; os arquivos relacionados a F04
  foram cobertos por `deno fmt --check`, `deno lint`, `deno check` e testes focados.

### Risco residual

- A validacao visual real em desktop e mobile nao foi executada porque o Browser interno nao estava disponivel nesta sessao. O risco foi
  reduzido por validacao HTTP da pagina e pela confirmacao indireta de estrutura responsiva, mas permanece como lacuna visual nao
  bloqueante.
