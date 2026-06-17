# T03 - Biblioteca segura na rota /biblioteca com handlers proprios

**Trabalho:** [TR-001 - Cadastro de usuarios](../trabalho.md)

**Estado:** Planejada **Depende de:** T02

**Objetivo tecnico**

Implementar `/biblioteca` como area segura minima, com verificacao de sessao no handler `GET` da propria pagina e saida da sessao por
handler `POST`.

**Contexto necessario**

- [Rotas Fresh e handlers](../../../conhecimento.md#rotas-fresh-e-handlers): a rota deve concentrar pagina e handlers quando suficiente.
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
