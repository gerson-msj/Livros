# F04 - Listagem e inclusao reais de series

**Tarefa:** [T-005 - Gerenciamento de series de livros](../tarefa.md)

**Estado:** Concluida

**Depende de:** F03

**Tipo de fase:** Comum

## Objetivo tecnico

Integrar a biblioteca, a listagem e a inclusao de series aos dados reais, preservando a experiencia validada nas fases UX.

## Contexto necessario

- [Rotas Fresh e handlers](../../../conhecimento.md#rotas-fresh-e-handlers): paginas e handlers de rota devem ser preferidos quando
  suficientes.
- [Interface com Bulma](../../../conhecimento.md#interface-com-bulma): manter componentes e estilo visual existentes.
- [F01 - Experiencia mockada de listagem de series](F01-experiencia-mockada-listagem-series.md): base visual da entrada e listagem.
- [F02 - Experiencia mockada de formulario de serie](F02-experiencia-mockada-formulario-serie.md): base visual da inclusao.
- [F03 - Dominio e persistencia de series](F03-dominio-persistencia-series.md): operacoes reais de dominio e persistencia.

## Entrega esperada

- Entrada de series na biblioteca apontando para o fluxo real.
- Listagem real de series do usuario autenticado, com livros em ordem.
- Tela real de nova serie usando autores existentes ou novo autor.
- Inclusao real de serie com um ou mais livros e datas opcionais.
- Substituicao ou remocao dos mocks cobertos pela implementacao real.

## Criterios de conclusao

- Usuario autenticado acessa `/biblioteca/series` e ve somente suas series.
- Series aparecem da mais recente para a mais antiga, com livros em ordem crescente.
- Usuario consegue criar uma serie com autor existente ou novo e ao menos um livro com titulo.
- Fluxo real preserva a experiencia visual e interativa validada nas fases UX.
- Visitantes sem sessao ativa nao acessam as rotas de series.
- Validacoes relevantes aparecem para o usuario sem quebrar o layout.

## Cuidados de implementacao

- Reutilizar os artefatos visuais validados nas fases UX sempre que eles ainda forem adequados.
- Remover ou substituir mocks cobertos por dados e handlers reais.

## Fora da fase

- Edicao real de datas de series existentes.
- Exclusao real de series.
- Reordenacao, adicao ou remocao de livros depois do cadastro.

## Resultado

- Resultado entregue: listagem `/biblioteca/series` passou a carregar series reais do usuario autenticado, ordenadas por cadastro mais
  recente, com livros ordenados; `/biblioteca/series/nova` passou a carregar autores reais e salvar series reais com um ou mais livros e
  datas opcionais.
- Mocks substituidos: dados temporarios da listagem, autores temporarios e resposta mockada de salvamento foram removidos ou trocados por
  handlers reais.
- Ajuste de validacao aplicado: rota de nova serie passou a buscar autores em `AuthorsService` e salvar series via `SeriesService`.
- Verificacoes realizadas: `deno task build`.
- Testes unitarios temporarios: removidos conforme solicitacao do usuario; nenhum novo teste foi criado.
- Riscos, limitacoes ou pendencias: nenhum apos validacao final pelo usuario.
