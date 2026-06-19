# F03 - Biblioteca segura na rota /biblioteca com handlers proprios

**Tarefa:** [TF-001 - Cadastro de usuarios](../tarefa.md)

**Estado:** Concluida **Depende de:** F02

**Objetivo tecnico**

Implementar `/biblioteca` como area segura minima, com verificacao de sessao no handler `GET` da propria pagina e saida da sessao por
handler `POST`.

**Contexto necessario**

- [Rotas Fresh e handlers](../../../conhecimento.md#rotas-fresh-e-handlers): a rota deve concentrar pagina e handlers quando suficiente.
- F02 concluida.

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

**Fora da fase**

- Recursos de livros, autores ou series.
- Login separado e redefinicao de senha.
- APIs separadas, salvo descoberta tecnica indispensavel.

**Evolucao**

- Planejada para validacao humana junto das demais fases restantes.
- Validada pelo usuario, liberada e iniciada em 2026-06-17.
- Verificacao focada concluida com formato, lint, check e testes automatizados dos handlers de `/biblioteca`.
- Enviada para auditoria tecnica.
- Validacao humana aprovada.
- Conclusao confirmada pelo Auditor; checkpoint autorizado.

## Evidencias da F03

### Mapa de fluxo - F03

**Fluxo:** acesso seguro e saida pela rota `/biblioteca`. **Resultado produzido:** rota protegida por sessao ativa, tela minima com opcao de
saida e logout que encerra a sessao persistida e limpa o cookie HTTP. **Exemplo acompanhado:** o usuario `gerson` chega com cookie
`livros_session=00000000-0000-4000-8000-000000000002`, acessa `/biblioteca`, aciona "Sair" e a mesma sessao deixa de autenticar novos
acessos. **Resumo:** a propria rota `/biblioteca` concentra `GET` e `POST`, usando o helper de cookie e o servico de autenticacao para
validar ou encerrar a sessao.

### 1. Proteger o acesso a biblioteca

**Componente:** [Handler GET de biblioteca](../../../../routes/biblioteca.tsx:5) - 🟢 **Criado**

**Entra:** request `GET /biblioteca`, possivelmente com cookie `livros_session`. **Faz:** extrai o identificador da sessao e consulta
`AuthenticationService.findActiveSession`; sem cookie ou sem sessao ativa, interrompe o fluxo com redirecionamento `303`. **Sai:** pagina
minima da biblioteca para sessao valida, ou `303` para `/cadastro` para visitante deslogado.

### 2. Renderizar a area segura minima

**Componente:** [Pagina de biblioteca](../../../../routes/biblioteca.tsx:27) - 🟢 **Criado**

**Entra:** resposta de pagina liberada pelo handler `GET`. **Faz:** renderiza estrutura Bulma responsiva com titulo "Biblioteca" e um unico
formulario de saida. **Sai:** tela segura contendo somente a opcao "Sair".

### 3. Encerrar a sessao

**Componente:** [Handler POST de biblioteca](../../../../routes/biblioteca.tsx:16) - 🟢 **Criado**

**Entra:** submissao `POST /biblioteca` com cookie `livros_session`. **Faz:** se houver identificador no cookie, chama
`AuthenticationService.endSession`, que marca a sessao como encerrada no repositorio persistente. **Sai:** resposta de redirecionamento para
`/cadastro`.

### 4. Limpar o cookie HTTP

**Componente:** [Helper de limpeza de cookie](../../../../infraestrutura/session_cookie.ts:35) - 🟡 **Modificado**

**Entra:** headers da resposta de logout. **Faz:** adiciona `Set-Cookie` para `livros_session` vazio, com `Path=/`, `HttpOnly`,
`SameSite=Lax`, `Expires` no passado e `Max-Age=0`. **Sai:** navegador instruido a remover o cookie de sessao.

### 5. Recusar sessao encerrada

**Componente:** [Servico de autenticacao](../../../../aplicacao/autenticacao_service.ts:85) e
[Repositorio de sessoes](../../../../infraestrutura/auth_repositories.ts:65) - ⚪ **Existente**

**Entra:** novo `GET /biblioteca` usando o identificador de sessao encerrado. **Faz:** a busca de sessao ativa filtra sessoes com
`ended_at IS NULL` e expiracao futura; a sessao encerrada nao passa nesse filtro. **Sai:** redirecionamento `303` para `/cadastro`.

| Estacao    | Componente           | Impacto       | Entra -> Sai                    |
| ---------- | -------------------- | ------------- | ------------------------------- |
| Proteger   | `GET /biblioteca`    | 🟢 Criado     | Request -> pagina ou redirect   |
| Renderizar | Pagina `/biblioteca` | 🟢 Criado     | Sessao valida -> botao de saida |
| Encerrar   | `POST /biblioteca`   | 🟢 Criado     | Cookie -> sessao encerrada      |
| Limpar     | `session_cookie.ts`  | 🟡 Modificado | Logout -> `Set-Cookie` expirado |
| Revalidar  | Servico/repositorio  | ⚪ Existente  | Sessao encerrada -> redirect    |

Aspectos relevantes:

- A biblioteca nao adiciona recursos de livros, autores ou series; a tela contem apenas a opcao de saida, como definido para a F03.
- O logout redireciona para `/cadastro` mesmo sem cookie; quando ha cookie, encerra a sessao antes de limpar o navegador.
- `GET /biblioteca` nao limpa cookie invalido ou expirado; ele apenas redireciona para `/cadastro`, mantendo a entrega pequena e alinhada
  aos criterios da fase.

## Verificacoes - F03

- `deno test --allow-env routes\biblioteca_test.ts routes\cadastro_test.ts`: 6 testes aprovados.
- `deno fmt --check` focado em `infraestrutura/session_cookie.ts`, `routes/biblioteca.tsx`, `routes/biblioteca_test.ts` e documentacao do
  tarefa: aprovado.
- `deno lint infraestrutura\session_cookie.ts routes\biblioteca.tsx routes\biblioteca_test.ts`: aprovado.
- `deno check routes\biblioteca.tsx routes\biblioteca_test.ts infraestrutura\session_cookie.ts`: aprovado.
- Validacao HTTP local em `http://127.0.0.1:5173`: `GET /biblioteca` sem sessao retornou `303` para `/cadastro`; cadastro temporario gerou
  cookie `livros_session`; `GET /biblioteca` com cookie retornou pagina `Biblioteca` com opcao "Sair"; `POST /biblioteca` retornou `303`
  para `/cadastro`, enviou `Set-Cookie` com `Max-Age=0` e a sessao encerrada voltou a receber `303` para `/cadastro`.
- O Browser interno nao estava disponivel na sessao; a validacao local da tela foi feita por servidor Fresh/Vite e requisicoes HTTP com
  `curl.exe`.
- `deno task check`: falhou em `deno fmt --check .` por arquivos preexistentes fora do escopo da F03, como template Fresh e CSS estatico; a
  validacao focada acima cobriu os arquivos alterados.

## Auditoria - F03

**Resultado:** Aprovada

### Achados

- Nenhum.

### Verificacoes

- Leitura do escopo, criterios, evolucao, verificacoes e mapa de fluxo da F03.
- Revisao de `routes/biblioteca.tsx`, `infraestrutura/session_cookie.ts` e `routes/biblioteca_test.ts`.
- Confirmado que `/biblioteca` usa handlers `GET` e `POST` proprios, sem API separada.
- Confirmado que `GET /biblioteca` redireciona visitante sem sessao ativa para `/cadastro`.
- Confirmado que usuario com sessao ativa recebe a pagina minima contendo somente a opcao de saida.
- Confirmado que `POST /biblioteca` encerra a sessao quando ha cookie, limpa o cookie HTTP e redireciona para `/cadastro`.
- Confirmado que sessao encerrada nao volta a autenticar acesso seguro.
- `deno fmt --check` focado nos arquivos alterados da F03 e documentacao relacionada: aprovado.
- `deno lint infraestrutura\session_cookie.ts routes\biblioteca.tsx routes\biblioteca_test.ts`: aprovado.
- `deno check routes\biblioteca.tsx routes\biblioteca_test.ts infraestrutura\session_cookie.ts`: aprovado.
- `deno test --allow-env routes\biblioteca_test.ts routes\cadastro_test.ts`: 6 testes aprovados.
- Validacao HTTP local com servidor Fresh/Vite e `curl.exe`: cadastro gerou sessao, `/biblioteca` autenticada renderizou a tela minima,
  logout limpou o cookie e a sessao encerrada foi redirecionada para `/cadastro`.
- `deno task check`: falha na etapa global de formato por arquivos preexistentes fora do escopo, sem bloquear a F03.

### Mapa de fluxo

- Correto para a F03. O mapa representa o fluxo real de acesso seguro, renderizacao minima da biblioteca, logout, limpeza do cookie e recusa
  de sessao encerrada.

## Validacao humana - F03

**Resultado:** Aprovado **Retorno:** Ok, validado, pode seguir.

## Confirmacao de conclusao - F03

**Resultado:** Conclusao confirmada

### Verificacoes

- Auditoria tecnica aprovada sem achados.
- Validacao humana registrada como aprovada.
- Mapa, verificacoes e evolucao estao atualizados.
- Tabela de controle em `tarefa.md` sincronizada com o estado `Concluida`.
- Nenhuma falha conhecida relacionada a F03 permanece aberta; checkpoint autorizado.
