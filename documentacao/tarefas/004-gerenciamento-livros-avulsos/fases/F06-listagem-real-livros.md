# F06 - Listagem real de livros

**Tarefa:** [TF-004 - Gerenciamento de livros avulsos](../tarefa.md)

**Estado:** Concluida **Depende de:** F05 **Tipo de fase:** Comum

## Objetivo tecnico

Integrar a entrada real de livros na biblioteca e a listagem real de livros avulsos do usuario autenticado, usando a experiencia validada
nas fases UX.

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

## Resultado

- Rota `/biblioteca/livros` passou a consultar a sessao ativa, usar `session.userId` e carregar livros avulsos reais via `BooksService`.
- A lista real recebe dados serializaveis com id, titulo, autor, data de inicio e data de conclusao.
- Criado `BooksList` reaproveitando `FixedHeaderPage`, `PageTitle`, classes visuais aprovadas, estado vazio, botao de novo livro e navegacao
  real para `/biblioteca/livros/novo` e `/biblioteca/livros/:id`.
- A listagem real preserva a ordenacao entregue pela persistencia, com livros mais recentes primeiro, e mostra somente os livros retornados
  para o usuario autenticado.
- Removidos da rota de listagem os controles, mensagens e dados mockados da fase UX, mantendo os componentes mockados antigos disponiveis
  para as rotas de inclusao/edicao que ainda serao substituidas em fases futuras.
- Verificacoes realizadas: `deno test -A routes\biblioteca_livros_test.ts`, `deno fmt --check` nos arquivos tocados, `deno lint` nos
  arquivos tocados, `deno check` nos arquivos tocados, `deno test -A`, `deno lint .`, `deno check` e `deno task build`.
- Validacao em navegador nao foi realizada nesta fase porque nao havia ferramenta direta de navegador disponivel no ambiente atual.
- Ajuste solicitado na validacao visual: o layout reutilizavel passou a usar header `sticky` no fluxo da pagina, sem margem calculada por
  JavaScript, eliminando salto inicial e vao entre a area fixa e a area de rolagem.
