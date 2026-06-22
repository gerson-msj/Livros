# F02 - Lista mockada de livros

**Tarefa:** [TF-004 - Gerenciamento de livros avulsos](../tarefa.md)

**Estado:** Concluida
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
- Lista com rolagem da propria pagina, passando por tras do topo fixo e sem barra interna adicional.
- Estados mockados necessarios, como lista vazia e lista com livros.
- Layout reutilizavel para paginas com topo fixo calculado dinamicamente.

## Criterios de conclusao

- Usuario valida em navegador que a pagina rola com uma unica barra e que topo/botoes permanecem fixos.
- Cada item apresenta titulo, autor, data de inicio e data de conclusao de forma legivel.
- O clique ou toque em item simula abertura da edicao.
- O botao de inclusao simula ida ao fluxo de novo livro.
- O layout permanece utilizavel em desktop e mobile.
- A logica de topo fixo e deslocamento do conteudo fica disponivel para reaproveitamento por fases futuras.

## Fora da fase

- Busca, filtros avancados ou paginacao.
- Persistencia real, isolamento por usuario e ordenacao real por banco.
- Validacoes de dominio.

## Recurso reutilizavel registrado

- `FixedHeaderPage` em `islands/FixedHeaderPage.tsx` fornece um layout reutilizavel para paginas com topo fixo e rolagem da pagina.
- O componente mede o header com `ResizeObserver`, atualiza a variavel CSS `--livros-fixed-page-header-height` no proprio root do layout e
  usa essa altura para deslocar o conteudo.
- Telas futuras podem reaproveitar o componente passando `header`, `children` e classes especificas de tema/largura, sem duplicar a logica
  de calculo de altura.
- `MockBooksList` em `islands/MockBooksList.tsx` e apenas suporte UX desta fase: dados, mensagens e acoes simuladas devem ser substituidos
  nas fases comuns por uma lista real, reaproveitando `FixedHeaderPage` e os elementos visuais aprovados quando fizer sentido.

## Resultado

- Tela `/biblioteca/livros` entregue com lista mockada de livros avulsos, cards em tema escuro, dados essenciais e estados de lista
  preenchida e vazia.
- Header, acoes principais e mensagens permanecem fixos no topo; a lista rola com a propria pagina e passa por tras do topo fixo, sem barra
  interna adicional.
- `FixedHeaderPage` foi criado como layout reutilizavel para paginas com topo fixo e altura calculada dinamicamente por `ResizeObserver`.
- `MockBooksList` permanece temporario para validacao UX; deve ser substituido nas fases comuns por lista real, preservando o layout
  reutilizavel e os elementos visuais aprovados quando fizer sentido.
- Validacoes realizadas com `deno fmt --check islands\FixedHeaderPage.tsx islands\MockBooksList.tsx routes\biblioteca\livros.tsx`,
  `deno task build` e navegador visivel em desktop, com usuario local `gerson`.
- Usuario aprovou a fase apos ajustes de rolagem, tema escuro, espacamentos e extracao do layout reutilizavel.
