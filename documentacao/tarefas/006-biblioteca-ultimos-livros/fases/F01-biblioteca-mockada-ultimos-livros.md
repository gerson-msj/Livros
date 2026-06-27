# F01 - Biblioteca mockada com ultimos livros

**Tarefa:** [T-006 - Biblioteca com ultimos livros](../tarefa.md)

**Estado:** Concluida **Depende de:** Nenhuma **Tipo de fase:** UX **Executor:** designer

**Objetivo tecnico** Redesenhar a pagina `/biblioteca` com dados mockados para validar a nova hierarquia visual: pontos de entrada reduzidos
para livros e series e lista compacta dos ultimos livros.

**Contexto necessario**

- [Interface com Bulma](../../../conhecimento.md#interface-com-bulma): manter a base visual do projeto e os componentes existentes.
- [Livro](../../../conhecimento.md#livro): a lista deve apresentar titulo, autor e data de conclusao.
- [Serie](../../../conhecimento.md#serie): livros pertencentes a series devem aparecer junto dos avulsos na visao recente.
- [Tarefa](../tarefa.md): contrato completo da mudanca, escopo e expectativas de aceite.

**Entrega esperada**

- Biblioteca renderizada com entradas de livros e series menos dominantes, mas ainda claras e acessiveis.
- Lista compacta mockada com ate 10 livros, misturando exemplos avulsos e de serie.
- Itens da lista sem comportamento de clique ou indicacao visual de acao.
- Dados mockados isolados para substituicao posterior pela fase comum.

**Criterios de conclusao**

- Usuario valida a tela renderizada em navegador.
- A lista mostra somente titulo, autor e data de conclusao.
- A hierarquia visual deixa a lista recente como conteudo principal e mantem livros e series como pontos de entrada secundarios.
- O layout se mantem legivel em viewport desktop e mobile.

**Fora da fase**

- Persistencia, consulta real, regras de dominio ou handlers reais.
- Alteracoes nos fluxos de listagem, inclusao, edicao ou exclusao de livros e series.

## Resultado

- `routes/biblioteca/index.tsx` (U)
  - `Biblioteca` (U)
    - Substituiu os cards grandes por pontos de entrada compactos para livros e series.
    - Criou lista compacta de ultimos livros com dados mockados isolados.
    - Manteve os itens da lista sem clique, link ou acao propria.
- `assets/styles.css` (U)
  - `.livros-library-shortcuts` (C)
    - Definiu atalhos compactos em tema escuro.
  - `.livros-library-recent*` (C)
    - Definiu a lista compacta em tema escuro, responsiva para desktop e mobile.

A tela foi validada visualmente pelo usuario em 2026-06-27. O comportamento visual aprovado deve ser preservado na integracao real da F02,
substituindo apenas os dados mockados pela consulta real.
