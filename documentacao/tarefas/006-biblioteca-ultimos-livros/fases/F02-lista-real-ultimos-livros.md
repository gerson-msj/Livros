# F02 - Lista real de ultimos livros

**Tarefa:** [T-006 - Biblioteca com ultimos livros](../tarefa.md)

**Estado:** Concluida **Depende de:** F01 **Tipo de fase:** Comum

**Objetivo tecnico** Integrar a biblioteca com dados reais para exibir ate 10 livros recentes do usuario autenticado, unindo livros avulsos
e livros de series.

**Contexto necessario**

- [Modelo de livros e autores](../../../conhecimento.md#modelo-de-livros-e-autores): livros avulsos e de series compartilham a tabela de
  livros, mas obtem autor de fontes diferentes.
- [Privacidade](../../../conhecimento.md#privacidade): a consulta deve retornar somente dados do usuario autenticado.
- [Rotas Fresh e handlers](../../../conhecimento.md#rotas-fresh-e-handlers): preferir a propria pagina e seu handler quando isso for
  suficiente.
- [F01 - Biblioteca mockada com ultimos livros](F01-biblioteca-mockada-ultimos-livros.md): layout e comportamento visual a preservar.

**Entrega esperada**

- Lista real na pagina `/biblioteca`, preservando a experiencia visual validada na F01.
- Consulta ou servico capaz de retornar livros avulsos e livros de series em uma unica colecao compacta.
- Ordenacao com livros concluidos primeiro, por data de conclusao decrescente.
- Complemento, quando houver menos de 10 concluidos, com livros sem data de conclusao por ordem decrescente de cadastro.
- Mocks da F01 removidos ou substituidos pela integracao real.

**Criterios de conclusao**

- Biblioteca exibe no maximo 10 itens reais do usuario autenticado.
- Livros avulsos e livros de series aparecem juntos quando existirem.
- Livros com data de conclusao sempre aparecem antes dos sem data.
- Livros concluidos ficam em ordem decrescente de conclusao.
- Livros sem conclusao usados para completar a lista ficam em ordem decrescente de cadastro.
- Cada item exibe somente titulo, autor e data de conclusao.
- Itens nao possuem clique, link ou acao propria.
- Verificacoes adequadas cobrem a regra de ordenacao e isolamento por usuario.

**Fora da fase**

- Mudancas nos cadastros, edicoes ou exclusoes de livros e series.
- Busca, filtros, paginacao ou navegacao a partir dos itens da lista compacta.

## Resultado

- `dominio/livros.ts` (U)
  - `RecentLibraryBook` (C)
    - Estrutura de leitura compacta para os ultimos livros da biblioteca.
- `aplicacao/livros_service.ts` (U)
  - `StandaloneBookRepository` (U)
    - `listRecentByUser` (C)
  - `BooksService` (U)
    - `listRecentLibraryBooks` (C)
- `infraestrutura/book_repositories.ts` (U)
  - `LibsqlStandaloneBookRepository` (U)
    - `listRecentByUser` (C)
  - `mapRecentLibraryBook` (C)
- `routes/biblioteca/index.tsx` (U)
  - `handler.GET` (U)
    - Substituiu os dados mockados por livros reais do usuario autenticado.
  - `Biblioteca` (U)
    - Preservou o layout validado e renderiza a lista real compacta.
- `infraestrutura/book_repositories_test.ts` (C)
  - `lista ultimos livros concluindo primeiro e completa com abertos por cadastro` (C)
  - `nao completa com livros abertos quando concluidos ja atingem o limite` (C)
