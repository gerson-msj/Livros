# T-006 - Biblioteca com ultimos livros

**Estado:** Concluida

**Tipo:** Alteracao de comportamento

## Resumo

A pagina `/biblioteca` hoje funciona principalmente como porta de entrada para livros avulsos e series. A tarefa deve torna-la uma visao
inicial mais util e compacta, reduzindo o peso visual dos pontos de entrada e exibindo os ultimos livros do usuario, sejam avulsos ou
pertencentes a series.

O resultado esperado e que o usuario autenticado veja na biblioteca ate 10 livros recentes, com titulo, autor e data de conclusao, sem acao
ao clicar no livro. A ordenacao deve priorizar livros com data de conclusao decrescente; se houver menos de 10, a lista deve ser completada
com livros sem data de conclusao, em ordem decrescente de cadastro.

## Escopo

- Modificar o layout da pagina `/biblioteca`.
- Reduzir os pontos de entrada para livros avulsos e series, mantendo ambos acessiveis.
- Exibir uma lista compacta com ate 10 livros do usuario autenticado.
- Misturar livros avulsos e livros de series na mesma lista.
- Exibir somente titulo, autor e data de conclusao na lista compacta.
- Ordenar primeiro livros com data de conclusao decrescente.
- Completar a lista, quando necessario, com livros sem data de conclusao em ordem decrescente de cadastro.
- Separar uma fase UX inicial para validar layout, hierarquia visual e lista com dados mockados.
- Integrar depois a lista com dados reais preservando a experiencia validada.

## Fora do escopo

- Criar, editar ou excluir livros avulsos.
- Criar, editar ou excluir series.
- Adicionar acao ao clicar em livros da lista compacta.
- Alterar regras de datas, autores, livros ou series.
- Busca, filtros, paginacao, capas, notas, avaliacoes ou importacao de plataformas externas.

## Expectativas de aceite

- A biblioteca apresenta pontos de entrada menos destacados para livros avulsos e series, mas ambos continuam acessiveis.
- A biblioteca mostra ate 10 livros do usuario autenticado em uma lista compacta.
- A lista mistura livros avulsos e livros de series.
- Cada item mostra somente titulo, autor e data de conclusao.
- Livros com data de conclusao aparecem primeiro, ordenados da conclusao mais recente para a mais antiga.
- Quando existirem menos de 10 livros concluidos, livros sem data de conclusao completam a lista por cadastro mais recente.
- Livros da lista compacta nao possuem acao de clique.
- A experiencia visual e validada em fase UX antes da integracao com dados reais.

## Conhecimento relacionado

- [Visao](../../conhecimento.md#visao): a biblioteca deve ajudar leitores a controlar leituras e series fora das plataformas da Amazon.
- [Livro](../../conhecimento.md#livro): define datas opcionais, data de conclusao e diferenca atual entre livros avulsos e livros de series.
- [Serie](../../conhecimento.md#serie): livros de series pertencem ao controle de leitura do usuario e devem participar da visao recente.
- [Privacidade](../../conhecimento.md#privacidade): livros, series e autores sao isolados por usuario.
- [Interface com Bulma](../../conhecimento.md#interface-com-bulma): a interface deve manter Bulma e componentes reutilizaveis existentes.
- [Rotas Fresh e handlers](../../conhecimento.md#rotas-fresh-e-handlers): paginas e handlers de rota devem ser preferidos quando
  suficientes.
- [Modelo de livros e autores](../../conhecimento.md#modelo-de-livros-e-autores): livros avulsos e livros de series compartilham a tabela
  `books`, com diferenca de associacao de autor ou serie.
- [TF-004 - Gerenciamento de livros avulsos](../004-gerenciamento-livros-avulsos/tarefa.md): fonte do comportamento atual de livros avulsos.
- [T-005 - Gerenciamento de series de livros](../005-gerenciamento-series-livros/tarefa.md): fonte do comportamento atual de series e livros
  vinculados.

## Avaliacao arquitetural

Impacto permanente identificado: sim.

A tarefa altera o recurso Biblioteca ao transformar a pagina inicial segura em uma visao resumida dos livros recentes do usuario. Tambem
exige uma leitura unificada de livros avulsos e livros de series, respeitando o isolamento por usuario e o modelo persistente ja definido.
Nao ha nova decisao arquitetural pendente; depois da entrega validada, o conhecimento permanente devera registrar a nova capacidade da
biblioteca.

## Decisoes pendentes

Nenhuma.

## Plano

**Revisao:** 1

### Estrategia

Comecar por uma fase UX para validar a nova hierarquia da biblioteca com dados mockados: entradas menos dominantes para livros e series e
lista compacta dos ultimos livros sem interacao nos itens. Depois, uma fase comum deve preservar o layout validado e substituir os mocks por
uma consulta real que una livros avulsos e livros de series, aplicando a ordenacao especificada e mantendo o isolamento por usuario.

## Controle de fases

| Fase | Estado    | Depende de | Resumo                                                                 | Arquivo                                                                                       |
| ---- | --------- | ---------- | ---------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| F01  | Concluida | Nenhuma    | Redesenhar a biblioteca com entradas reduzidas e lista recente mockada | [F01 - Biblioteca mockada com ultimos livros](fases/F01-biblioteca-mockada-ultimos-livros.md) |
| F02  | Concluida | F01        | Integrar a lista real unificada de ultimos livros na biblioteca        | [F02 - Lista real de ultimos livros](fases/F02-lista-real-ultimos-livros.md)                  |

## Resumo final da tarefa

### Fonte da verdade

A biblioteca foi atualizada para usar pontos de entrada compactos para livros avulsos e series e para exibir uma lista real dos ultimos
livros do usuario autenticado. A lista mistura livros avulsos e livros de series, mostra no maximo 10 itens, exibe somente titulo, autor e
data de conclusao, nao possui acao ao clicar no item e fica oculta quando nao ha livros ou series cadastrados.

Livros com data de conclusao aparecem primeiro, ordenados da conclusao mais recente para a mais antiga. Quando houver menos de 10 livros
concluidos, a lista e completada com livros sem data de conclusao por ordem decrescente de cadastro.

### Referencias

- [F01 - Biblioteca mockada com ultimos livros](fases/F01-biblioteca-mockada-ultimos-livros.md): layout validado com pontos de entrada
  compactos, tema escuro e lista sem acao nos itens.
- [F02 - Lista real de ultimos livros](fases/F02-lista-real-ultimos-livros.md): consulta real unificada, ordenacao, isolamento por usuario e
  estado vazio da biblioteca.

## Validacao final da tarefa

**Resultado:** Aprovado **Retorno:** Usuario informou que esta tudo ok e autorizou finalizar a tarefa em 2026-06-27.
