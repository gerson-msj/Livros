# F02 - Lista mockada de livros

**Tarefa:** [TF-004 - Gerenciamento de livros avulsos](../tarefa.md)

**Estado:** Planejada
**Depende de:** F01
**Tipo de fase:** UX
**Executor:** designer

## Objetivo tecnico

Criar a tela mockada de listagem de livros avulsos, validando header e botoes fixos no topo, rolagem apenas da lista e apresentacao dos
dados essenciais de cada livro.

## Contexto necessario

- [Livro](../../../conhecimento.md#livro): livro possui titulo, autor, data de inicio e data de conclusao.
- [TF-004](../tarefa.md): lista deve mostrar livros mais recentes primeiro e abrir edicao ao selecionar item.
- [F01](F01-entrada-mockada-livros-biblioteca.md): define a entrada visual pela biblioteca.

## Entrega esperada

- Tela navegavel com lista mockada de livros.
- Header, titulo, botao de inclusao e acoes principais fixos no topo da area.
- Lista com rolagem propria, incluindo quantidade suficiente de itens mockados para validar o comportamento.
- Estados mockados necessarios, como lista vazia e lista com livros.

## Criterios de conclusao

- Usuario valida em navegador que somente a lista rola e que topo/botoes permanecem fixos.
- Cada item apresenta titulo, autor, data de inicio e data de conclusao de forma legivel.
- O clique ou toque em item simula abertura da edicao.
- O botao de inclusao simula ida ao fluxo de novo livro.
- O layout permanece utilizavel em desktop e mobile.

## Fora da fase

- Busca, filtros avancados ou paginacao.
- Persistencia real, isolamento por usuario e ordenacao real por banco.
- Validacoes de dominio.
