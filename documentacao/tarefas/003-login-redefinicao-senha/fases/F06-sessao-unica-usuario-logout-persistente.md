# F06 - Sessao unica por usuario e logout persistente

**Tarefa:** [TF-003 - Login e redefinicao de senha](../tarefa.md)

**Estado:** Concluida
**Depende de:** F05

## Objetivo tecnico

Garantir que o ciclo de sessao mantenha no maximo uma sessao ativa por usuario e que o logout remova a sessao persistida usada pelo
navegador.

## Contexto necessario

- [F01 - Base de autenticacao para login e redefinicao](F01-base-autenticacao-login-redefinicao.md): base de criacao, consulta e
  encerramento de sessoes.
- [F02 - Login como entrada principal](F02-login-entrada-principal.md): criacao de sessao apos login e redirecionamento de visitantes sem
  sessao.
- [F03 - Redefinicao de senha com nova chave](F03-redefinicao-senha-nova-chave.md): criacao de sessao apos redefinicao.
- [F05 - Correcoes validacao telas autenticacao](F05-correcoes-validacao-telas-autenticacao.md): ajustes mais recentes do fluxo de
  autenticacao.

## Entrega esperada

- Logout encerra a sessao persistida correspondente ao cookie atual e limpa o cookie do navegador.
- Quando uma nova sessao e criada para um usuario, sessoes anteriores desse mesmo usuario sao encerradas ou removidas.
- Login em outro dispositivo substitui a sessao anterior, mantendo no banco no maximo uma sessao ativa por usuario.
- Um navegador que ficou com cookie de sessao substituida deixa de acessar area segura quando a sessao for validada e e direcionado para
  login.

## Criterios de conclusao

- A base persistente nao mantem sessoes ativas antigas do usuario apos novo login, cadastro ou redefinicao que crie sessao.
- Logout remove ou invalida a sessao persistida usada pelo cookie, alem de limpar o cookie HTTP.
- Acesso a `/biblioteca` com cookie de sessao substituida ou encerrada redireciona para login.
- O comportamento possui verificacao automatizada adequada para regressao.

## Cuidados de implementacao

- Preservar a validade atual de uma semana e os atributos existentes do cookie de sessao.
- Aplicar a regra de sessao unica em todos os caminhos que criam sessao autenticada.
- Manter mensagens e redirecionamentos publicos genericos, sem expor detalhes internos da sessao.

## Fora da fase

- Gestao de dispositivos ou tela para listar sessoes.
- Opcao de manter varias sessoes simultaneas.
- Alteracao da duracao da sessao.
- Mecanismos de segundo fator, lembrar dispositivo ou bloqueio por tentativa.

## Resultado

- Resultado entregue: logout remove a sessao persistida correspondente ao cookie atual e a criacao de nova sessao remove sessoes anteriores
  do mesmo usuario antes de gravar a sessao atual.
- Verificacoes realizadas:
  `deno test --allow-env --allow-read --allow-write --allow-ffi aplicacao/autenticacao_service_test.ts infraestrutura/auth_repositories_test.ts routes/biblioteca_test.ts routes/login_test.ts routes/cadastro_test.ts routes/redefinir_senha_test.ts routes/fluxo_cadastro_biblioteca_test.ts`;
  `deno task build`.
- Riscos, limitacoes ou pendencias: o banco preserva a coluna `ended_at` existente por compatibilidade de schema, mas o fluxo atual remove
  as linhas de sessao no logout e na substituicao por nova sessao.
