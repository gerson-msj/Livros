# T02 - Cadastro na rota /cadastro com handlers proprios

**Trabalho:** [TR-001 - Cadastro de usuarios](../trabalho.md)

**Estado:** Concluida **Depende de:** T01

**Objetivo tecnico**

Implementar a rota `/cadastro` com pagina e handlers proprios para exibir o formulario, processar o cadastro, criar sessao inicial, gravar o
cookie HTTP e apresentar a chave de redefinicao antes de encaminhar o usuario para `/biblioteca`.

**Contexto necessario**

- [Rotas Fresh e handlers](../../../conhecimento.md#rotas-fresh-e-handlers): a rota deve preferir `GET` e `POST` proprios em vez de API
  separada.
- [Interface com Bulma](../../../conhecimento.md#interface-com-bulma): uso visual do Bulma na tela.
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
- Plano restante aprovado pelo usuario; tarefa liberada para desenvolvimento futuro, sem inicio imediato.
- Iniciada a execucao da rota `/cadastro` com handlers proprios.
- Verificacao focada concluida com lint, check, testes automatizados e validacao HTTP local da rota `/cadastro`.
- Enviada para auditoria tecnica.
- Auditoria tecnica aprovada e validacao humana registrada; conclusao confirmada.

## Evidencias da T02

### Mapa de fluxo - T02

**Fluxo:** cadastro inicial pela rota `/cadastro`. **Resultado produzido:** formulario responsivo, validacao de campos, criacao de usuario e
sessao, cookie HTTP e exibicao da chave de redefinicao. **Exemplo acompanhado:** nome `Gerson` e senha `senhaboa` chegam pelo formulario; o
usuario `gerson` e cadastrado, recebe a chave UUID e o cookie `livros_session`, podendo seguir para `/biblioteca`. **Resumo:** a rota
concentra `GET` e `POST`, o formulario interativo coleta os dados, o servico de autenticacao cria usuario/sessao e o helper de cookie grava
a sessao no navegador.

### 1. Abrir a tela de cadastro

**Componente:** [Handler GET de cadastro](../../../../routes/cadastro.tsx:25) - ðŸŸ¢ **Criado**

**Entra:** request `GET /cadastro`, possivelmente com cookie `livros_session`. **Faz:** le a sessao do cookie e consulta o servico de
autenticacao quando houver identificador. **Sai:** formulario vazio para visitante sem sessao, ou redirecionamento `303` para `/biblioteca`
quando a sessao esta ativa.

### 2. Preencher o formulario

**Componente:** [Formulario de cadastro](../../../../islands/CadastroForm.tsx:12) - ðŸŸ¢ **Criado**

**Entra:** nome de usuario inicial e erros retornados pelo handler. **Faz:** renderiza campos Bulma para nome e senha, aplica `is-danger`
nos campos invalidos e alterna a senha entre texto e senha pela acao "Mostrar senha". **Sai:** submissao `POST /cadastro` com `username` e
`password`.

### 3. Processar o cadastro

**Componente:** [Handler POST de cadastro](../../../../routes/cadastro.tsx:35) - ðŸŸ¢ **Criado**

**Entra:** dados do formulario, como `Gerson` e `senhaboa`. **Faz:** envia os valores ao `AuthenticationService`, reaproveitando as regras
de normalizacao, validacao, hash, geracao da chave e criacao de sessao da T01. **Sai:** em sucesso, dados da pagina com usuario normalizado
e chave de redefinicao; em erro de validacao ou duplicidade, formulario com mensagens e `is-danger`.

### 4. Gravar cookie de sessao

**Componente:** [Helper de cookie de sessao](../../../../infraestrutura/session_cookie.ts:22) - ðŸŸ¢ **Criado**

**Entra:** identificador e expiracao da sessao criada. **Faz:** monta `Set-Cookie` para `livros_session` com `Path=/`, `HttpOnly`,
`SameSite=Lax` e `Expires` alinhado a expiracao da sessao. **Sai:** resposta HTML da tela de chave com cookie HTTP gravado.

### 5. Apresentar a chave e proximo passo

**Componente:** [Painel da chave de redefinicao](../../../../routes/cadastro.tsx:100) - ðŸŸ¢ **Criado**

**Entra:** chave UUID retornada pelo cadastro. **Faz:** mostra a chave em campo somente leitura e oferece a acao para seguir ate
`/biblioteca`. **Sai:** usuario consegue sair da tela de cadastro carregando a sessao criada no cookie.

| Estacao   | Componente          | Impacto     | Entra -> Sai                                |
| --------- | ------------------- | ----------- | ------------------------------------------- |
| Abrir     | `GET /cadastro`     | ðŸŸ¢ Criado | Request -> formulario ou redirect           |
| Preencher | `CadastroForm`      | ðŸŸ¢ Criado | Dados digitados -> POST do formulario       |
| Processar | `POST /cadastro`    | ðŸŸ¢ Criado | Formulario -> usuario/sessao/chave ou erros |
| Cookie    | `session_cookie.ts` | ðŸŸ¢ Criado | Sessao criada -> `Set-Cookie`               |
| Chave     | `ResetKeyPanel`     | ðŸŸ¢ Criado | Chave UUID -> link para `/biblioteca`       |

Aspectos relevantes:

- A T02 nao cria a tela final de `/biblioteca`; ela apenas aponta para essa rota apos a exibicao da chave, como planejado para a T03.
- A leitura e escrita do cookie ficaram em helper de infraestrutura pequeno para reutilizacao posterior pela biblioteca segura.
- O Browser interno nao estava disponivel na sessao; a validacao local da tela foi feita por servidor Fresh/Vite e requisicoes HTTP.

## Verificacoes - T02

- `deno lint` focado em `routes/cadastro.tsx`, `routes/cadastro_test.ts`, `islands/CadastroForm.tsx`, `infraestrutura/session_cookie.ts`,
  arquivos de autenticacao da T01, `main.ts` e `utils.ts`: aprovado.
- `deno check` focado em `routes/cadastro.tsx`, `routes/cadastro_test.ts`, `islands/CadastroForm.tsx`, `infraestrutura/session_cookie.ts` e
  `main.ts`: aprovado.
- `deno test -A routes/cadastro_test.ts aplicacao/autenticacao_service_test.ts infraestrutura/auth_repositories_test.ts`: 8 testes
  aprovados.
- Validacao HTTP local em `http://127.0.0.1:5174/cadastro`: `GET` retornou `200`; `POST` invalido retornou pagina com `is-danger` e mensagem
  de validacao; `POST` valido retornou a chave de redefinicao e `Set-Cookie` `livros_session`; `GET /cadastro` com sessao ativa retornou
  `303` para `/biblioteca`.

## Auditoria - T02

**Resultado:** Aprovada

### Achados

- Nenhum.

### Verificacoes

- Leitura do escopo, criterios, evolucao, verificacoes e mapa de fluxo da T02.
- Revisao de `routes/cadastro.tsx`, `islands/CadastroForm.tsx`, `infraestrutura/session_cookie.ts` e `routes/cadastro_test.ts`.
- Confirmado que a rota `/cadastro` usa handler `GET` e `POST` proprios, sem API separada.
- Confirmado que o formulario usa Bulma, `is-danger` em campos invalidos e `defaultValue` no nome de usuario para nao perder dados ao
  alternar a visualizacao da senha.
- Confirmado que o cookie `livros_session` usa `HttpOnly`, `SameSite=Lax`, `Path=/` e expiracao da sessao.
- `deno lint` focado nos arquivos relacionados da T02 e base de autenticacao: aprovado.
- `deno check` focado em rota, teste, island, cookie e `main.ts`: aprovado.
- `deno test -A routes/cadastro_test.ts aplicacao/autenticacao_service_test.ts infraestrutura/auth_repositories_test.ts`: 8 testes
  aprovados.
- Validacao HTTP local de `GET`, `POST` invalido, `POST` valido com cookie e redirecionamento de usuario logado: aprovada.

### Mapa de fluxo

- Correto para a T02. O mapa representa o fluxo real de abertura da tela, envio do formulario, criacao de sessao, gravacao do cookie e
  apresentacao da chave.

## Validacao humana - T02

**Resultado:** Aprovado **Retorno:** T02 aprovada.
