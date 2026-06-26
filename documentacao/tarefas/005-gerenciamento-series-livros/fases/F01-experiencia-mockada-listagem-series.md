# F01 - Experiencia mockada de listagem de series

**Tarefa:** [T-005 - Gerenciamento de series de livros](../tarefa.md)

**Estado:** Concluida

**Depende de:** Nenhuma

**Tipo de fase:** UX

**Executor:** designer

## Objetivo tecnico

Criar a experiencia visual e navegavel da entrada de series na biblioteca e da listagem de series usando dados mockados.

## Contexto necessario

- [Visao](../../../conhecimento.md#visao): series fazem parte do problema central do produto.
- [Serie](../../../conhecimento.md#serie): agrupamento identificado por nome e autor, com livros ordenados.
- [Interface com Bulma](../../../conhecimento.md#interface-com-bulma): telas devem manter Bulma e componentes reutilizaveis existentes.

## Entrega esperada

- Entrada de series visivelmente disponivel na biblioteca, ainda com comportamento mockado quando necessario.
- Tela navegavel de listagem de series com nome, autor e sublista de livros.
- Acao para iniciar nova serie posicionada acima da lista.
- Clique em uma serie simulando a navegacao para a experiencia de edicao.
- Mocks explicitos e isolados para facilitar substituicao por dados reais.

## Criterios de conclusao

- Usuario valida em navegador a entrada de series e a tela de listagem renderizada.
- Series mockadas aparecem da mais recente para a mais antiga.
- Livros dentro de cada serie aparecem em ordem crescente.
- Layout se mantem coerente com a listagem de livros avulsos, incluindo topo e rolagem da pagina.
- A fase nao adiciona persistencia, regras de dominio ou integracao real.

## Fora da fase

- Cadastro real de series.
- Persistencia em libSQL.
- Validacoes reais de duplicidade, autor, titulo ou datas.
- Edicao real de series.

## Resultado

- Entrada de series liberada na biblioteca, apontando para `/biblioteca/series`.
- Tela `/biblioteca/series` criada com dados mockados explicitos e isolados na propria rota.
- Island `SeriesList` criada com nome e estrutura esperados para reutilizacao na integracao real.
- Listagem mockada apresenta nome da serie, autor e sublista de livros em ordem crescente, sem exibir numero de ordem ao usuario.
- Acao `Nova serie` aponta para `/biblioteca/series/nova` e clique em uma serie aponta para `/biblioteca/series/:id`, ambos ainda como
  navegacao prevista para fases seguintes.
- Validacao tecnica realizada com `deno task build`.
- Validacao visual/interativa aprovada pelo usuario em 26/06/2026.
- A tela aprovada se torna referencia visual e interativa para as fases comuns; os dados mockados da rota devem ser substituidos por dados
  reais na integracao.
