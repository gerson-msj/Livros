# F08 - Edicao e exclusao real de livro

**Tarefa:** [TF-004 - Gerenciamento de livros avulsos](../tarefa.md)

**Estado:** Planejada
**Depende de:** F04, F05
**Tipo de fase:** Comum

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
