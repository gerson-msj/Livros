# T04 - Verificacao integrada e mapa final do fluxo

**Trabalho:** [TR-001 - Cadastro de usuarios](../trabalho.md)

**Estado:** Planejada **Depende de:** T03

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
- Validada pelo usuario em 2026-06-17; permanece planejada por depender da conclusao da T03.
