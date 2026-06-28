# F02 - Experiencia mockada de formulario de serie

**Tarefa:** [T-005 - Gerenciamento de series de livros](../tarefa.md)

**Estado:** Concluida

**Depende de:** F01

**Tipo de fase:** UX

**Executor:** designer

## Objetivo tecnico

Criar a experiencia visual e interativa mockada para incluir uma nova serie, editar datas de uma serie existente e confirmar exclusao.

## Contexto necessario

- [Serie](../../../conhecimento.md#serie): durante o cadastro, livros recebem ordem automatica e somente o ultimo pode ser removido.
- [Livro](../../../conhecimento.md#livro): datas sao opcionais e, depois do cadastro, somente datas podem ser alteradas.
- [Imutabilidade dos cadastros](../../../conhecimento.md#imutabilidade-dos-cadastros): nome, autor, livros e ordem da serie nao devem ser
  editaveis depois do cadastro.
- [Interface com Bulma](../../../conhecimento.md#interface-com-bulma): confirmacoes devem reaproveitar a experiencia de popup quando fizer
  sentido.

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

## Resultado

- Tela `/biblioteca/series/nova` criada com formulario mockado de nova serie, usando nome, autor existente ou novo e lista de livros.
- Tela `/biblioteca/series/:id` criada com formulario mockado de edicao, exibindo serie, autor e titulos como somente leitura.
- Inclusao de livros na nova serie validada com livros adicionados ao final da lista, rolagem automatica para o novo livro e controles da
  lista posicionados no rodape.
- Alerta de ultimo livro sem titulo validado como mensagem no cabecalho fixo da pagina, mantendo o contexto visivel durante a rolagem.
- Remocao do ultimo livro validada com confirmacao por popup.
- Edicao de datas validada como unico comportamento editavel depois do cadastro.
- Exclusao de serie validada como fluxo mockado com confirmacao explicita por popup.
- Rotas e islands foram criados com nomes e caminhos finais esperados para reaproveitamento na integracao real.
- Dados, autores e respostas de salvamento/exclusao permanecem mockados e devem ser substituidos por handlers e servicos reais nas fases
  comuns.
- Validacao tecnica realizada com `deno task build`.
- Validacao visual/interativa aprovada pelo usuario em 26/06/2026.
