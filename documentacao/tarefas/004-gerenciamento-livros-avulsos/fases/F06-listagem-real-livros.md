# F06 - Listagem real de livros

**Tarefa:** [TF-004 - Gerenciamento de livros avulsos](../tarefa.md)

**Estado:** Planejada
**Depende de:** F05
**Tipo de fase:** Comum

## Objetivo tecnico

Integrar a entrada real de livros na biblioteca e a listagem real de livros avulsos do usuario autenticado, usando a experiencia validada nas
fases UX.

## Contexto necessario

- [TF-004](../tarefa.md): biblioteca deve apresentar entrada para livros e lista deve ordenar os cadastros mais recentes primeiro.
- [F01](F01-entrada-mockada-livros-biblioteca.md): experiencia visual da entrada pela biblioteca.
- [F02](F02-lista-mockada-livros.md): experiencia visual da lista com topo fixo e rolagem.
- [F05](F05-dominio-persistencia-livros.md): base de dominio e persistencia.

## Entrega esperada

- Entrada real para livros a partir de `/biblioteca`.
- Rota real de listagem de livros avulsos do usuario autenticado.
- Lista carregada da persistencia, ordenada com registros mais recentes primeiro.
- Estado de lista vazia e estado com livros.
- Navegacao real para inclusao e edicao.

## Criterios de conclusao

- Usuario autenticado acessa a lista de livros pela biblioteca.
- Visitante sem sessao nao acessa a rota de livros.
- A lista mostra somente livros do usuario autenticado.
- Livros mais recentes aparecem no inicio da lista.
- Header e botoes permanecem fixos no topo e somente a lista rola.
- O comportamento visual aprovado nas fases UX e preservado em desktop e mobile.

## Fora da fase

- Inclusao real de livro.
- Edicao real de datas.
- Exclusao real de livro.
