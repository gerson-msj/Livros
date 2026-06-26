# F02 - Experiencia mockada de formulario de serie

**Tarefa:** [T-005 - Gerenciamento de series de livros](../tarefa.md)

**Estado:** Planejada
**Depende de:** F01
**Tipo de fase:** UX
**Executor:** designer

## Objetivo tecnico

Criar a experiencia visual e interativa mockada para incluir uma nova serie, editar datas de uma serie existente e confirmar exclusao.

## Contexto necessario

- [Serie](../../../conhecimento.md#serie): durante o cadastro, livros recebem ordem automatica e somente o ultimo pode ser removido.
- [Livro](../../../conhecimento.md#livro): datas sao opcionais e, depois do cadastro, somente datas podem ser alteradas.
- [Imutabilidade dos cadastros](../../../conhecimento.md#imutabilidade-dos-cadastros): nome, autor, livros e ordem da serie nao devem ser editaveis depois do cadastro.
- [Interface com Bulma](../../../conhecimento.md#interface-com-bulma): confirmacoes devem reaproveitar a experiencia de popup quando fizer sentido.

## Entrega esperada

- Tela mockada de nova serie com nome, autor existente ou novo e lista de livros.
- Interacao mockada para adicionar livros com ordem oculta e bloqueio de multiplos livros em branco.
- Interacao mockada para remover somente o ultimo livro, com confirmacao.
- Tela mockada de edicao exibindo nome, autor e titulos como somente leitura e permitindo alterar apenas datas.
- Confirmacao mockada de exclusao completa da serie.
- Mocks explicitos e isolados para substituicao posterior por handlers e dados reais.

## Criterios de conclusao

- Usuario valida em navegador os fluxos de inclusao, remocao do ultimo livro, edicao de datas e exclusao.
- A interface deixa claro que ordem e dados estruturais da serie nao sao editaveis depois do cadastro.
- O comportamento de alteracoes nao salvas e confirmacoes segue o padrao visual existente quando aplicavel.
- A fase nao adiciona persistencia, regras de dominio ou integracao real.

## Fora da fase

- Salvamento real de serie.
- Exclusao real de serie.
- Validacoes definitivas de backend.
- Alteracoes permanentes no modelo de dados.
