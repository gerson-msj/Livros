# F05 - Edicao e exclusao reais de series

**Tarefa:** [T-005 - Gerenciamento de series de livros](../tarefa.md)

**Estado:** Concluida

**Depende de:** F04

**Tipo de fase:** Comum

## Objetivo tecnico

Integrar a edicao de datas e a exclusao de series aos dados reais, concluindo o gerenciamento de series do usuario.

## Contexto necessario

- [Serie](../../../conhecimento.md#serie): depois do cadastro, somente datas dos livros podem ser alteradas e a serie pode ser excluida
  inteira.
- [Imutabilidade dos cadastros](../../../conhecimento.md#imutabilidade-dos-cadastros): nome, autor, livros e ordem nao devem ser editaveis.
- [Privacidade](../../../conhecimento.md#privacidade): usuario autenticado deve acessar somente seus proprios dados.
- [F02 - Experiencia mockada de formulario de serie](F02-experiencia-mockada-formulario-serie.md): base visual da edicao e exclusao.
- [F03 - Dominio e persistencia de series](F03-dominio-persistencia-series.md): operacoes reais de atualizacao de datas e exclusao.

## Entrega esperada

- Tela real de detalhe/edicao de serie propria.
- Nome da serie, autor, titulos e ordem exibidos como dados nao editaveis.
- Edicao real somente das datas de inicio e conclusao dos livros vinculados.
- Exclusao real da serie completa apos confirmacao explicita.
- Substituicao ou remocao dos mocks remanescentes da edicao e exclusao.

## Criterios de conclusao

- Usuario consegue abrir uma serie propria e alterar somente datas dos livros.
- Usuario nao consegue adicionar, remover, reordenar ou alterar titulos pela edicao.
- Validacoes de datas sao aplicadas e comunicadas ao usuario.
- Usuario consegue excluir a serie inteira apos confirmacao explicita.
- Series de outros usuarios nao podem ser vistas, editadas ou excluidas.
- Fluxo real preserva a experiencia visual e interativa validada nas fases UX.

## Cuidados de implementacao

- Confirmacoes e protecao contra alteracoes nao salvas devem seguir o padrao validado e os componentes existentes quando aplicavel.
- A exclusao deve cobrir a serie e os livros vinculados sem afetar autores ou livros avulsos.

## Fora da fase

- Inclusao de novos livros em serie existente.
- Edicao de nome da serie, autor, titulos ou ordem.
- Encerramento e consolidacao permanente da tarefa.

## Resultado

- Resultado entregue: `/biblioteca/series/:id` passou a carregar somente serie propria, salvar apenas datas dos livros vinculados e excluir
  a serie completa com seus livros apos confirmacao na interface.
- Mocks substituidos: serie temporaria, resposta mockada de salvamento e resposta mockada de exclusao foram removidas ou trocadas por
  handlers reais.
- Ajuste de validacao aplicado: rota de edicao e exclusao passou a operar via `SeriesService`.
- Verificacoes realizadas: `deno task build`.
- Testes unitarios temporarios: removidos conforme solicitacao do usuario; nenhum novo teste foi criado.
- Riscos, limitacoes ou pendencias: nenhum apos validacao final pelo usuario.
