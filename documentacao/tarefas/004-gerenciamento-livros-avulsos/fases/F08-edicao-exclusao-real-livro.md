# F08 - Edicao e exclusao real de livro

**Tarefa:** [TF-004 - Gerenciamento de livros avulsos](../tarefa.md)

**Estado:** Concluida **Depende de:** F04, F05 **Tipo de fase:** Comum

## Objetivo tecnico

Implementar a edicao real de datas e a exclusao real de livro avulso do usuario autenticado, preservando titulo e autor como dados somente
leitura depois do cadastro.

## Contexto necessario

- [Imutabilidade dos cadastros](../../../conhecimento.md#imutabilidade-dos-cadastros): depois do cadastro, somente datas podem ser
  alteradas.
- [F04](F04-edicao-exclusao-mockadas-livro.md): experiencia UX validada para edicao e exclusao.
- [F05](F05-dominio-persistencia-livros.md): regras e persistencia de livros.

## Entrega esperada

- Rota real de edicao de livro avulso.
- Titulo e autor exibidos como somente leitura.
- Alteracao real de datas com validacao.
- Exclusao real com confirmacao contendo o titulo do livro.
- Confirmacoes de sucesso e retorno para a lista.
- Bloqueio de acesso a livros de outros usuarios.

## Criterios de conclusao

- Usuario consegue abrir livro proprio para edicao.
- Titulo e autor nao podem ser alterados pela interface.
- Datas validas sao salvas e refletidas na lista.
- Datas incoerentes sao recusadas.
- Usuario recebe alerta ao tentar voltar com alteracoes nao salvas.
- Usuario consegue excluir livro proprio apos confirmar o titulo correto.
- Usuario nao consegue editar nem excluir livro de outro usuario.

## Fora da fase

- Alteracao de titulo ou autor.
- Restauracao de livro excluido.
- Regras de series.

## Resultado

- Rota `/biblioteca/livros/:id` substituida pela edicao/exclusao real protegida por sessao, carregando apenas livro avulso do usuario
  autenticado no `GET`, salvando datas no `POST` e excluindo no `DELETE`.
- Criado `BookEditForm` real com titulo e autor somente leitura, edicao das datas, alerta de volta com alteracoes nao salvas, confirmacao de
  exclusao com titulo do livro, mensagens de sucesso e retorno para a lista.
- Bloqueio de acesso a livros de outros usuarios mantido por consulta e operacoes escopadas por `userId`; livro inexistente ou alheio nao
  pode ser editado nem excluido.
- Removidos artefatos mockados paralelos ja cobertos pela implementacao real da lista, inclusao e edicao/exclusao: `MockBooksList`,
  `MockBookCreateForm`, `MockAuthorPicker`, `MockBookDateInput` e `MockBookEditForm`.
- Adicionados testes de rota para visitante sem sessao, carregamento de livro proprio, bloqueio de livro de outro usuario, salvamento real
  de datas, validacao de datas incoerentes e exclusao real.
- Verificacoes realizadas: `rg -n "Mock|mockad|simulad" islands routes`, `deno fmt --check` nos arquivos tocados,
  `deno test -A
  routes\biblioteca_livros_id_test.ts`, `deno test -A`, `deno lint .`, `deno check` e `deno task build`.
- Testes unitarios temporarios: nao criados.
- Riscos, limitacoes ou pendencias: validacao visual em navegador fica para a validacao integrada da F09, salvo se o usuario solicitar
  ajuste antes.
- Validacao dos fontes: aprovada pelo usuario em 2026-06-23.
