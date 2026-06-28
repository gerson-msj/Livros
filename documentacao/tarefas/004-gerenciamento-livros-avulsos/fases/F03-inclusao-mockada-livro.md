# F03 - Inclusao mockada de livro

**Tarefa:** [TF-004 - Gerenciamento de livros avulsos](../tarefa.md)

**Estado:** Concluida **Depende de:** F02 **Tipo de fase:** UX **Executor:** designer

## Objetivo tecnico

Criar o fluxo mockado de inclusao de livro avulso, validando formulario, componente de data, componente de selecao/criacao de autor,
confirmacoes e alerta de volta com alteracoes nao salvas.

## Contexto necessario

- [Autor](../../../conhecimento.md#autor): autores pertencem ao usuario e podem ser reutilizados em livros avulsos e series.
- [Livro](../../../conhecimento.md#livro): datas sao opcionais e somente datas podem ser alteradas depois do cadastro.
- [TF-004](../tarefa.md): usuario fornecera modelos de componente de data e autor durante as fases UX.
- [F02](F02-lista-mockada-livros.md): define a lista para onde o fluxo deve retornar.

## Entrega esperada

- Tela mockada de inclusao com campos de titulo, autor, data de inicio e data de conclusao.
- Componente mockado de data validado visualmente com o modelo fornecido pelo usuario.
- Componente mockado de autor com lista de autores existentes, filtro e criacao de novo nome.
- Mensagens ou estados simulados para salvamento, erro de validacao e retorno com alteracoes nao salvas.

## Criterios de conclusao

- Usuario valida em navegador a usabilidade do componente de data.
- Usuario valida em navegador a usabilidade do componente de selecao/criacao de autor.
- O fluxo simula salvamento com confirmacao e retorno para a lista.
- O fluxo simula recusas para titulo ou autor curto, datas incompletas, datas incoerentes e duplicidade de titulo/autor.
- Ao tentar voltar com alteracoes nao salvas, a interface simula pedido de confirmacao.

## Fora da fase

- Criacao real de autores ou livros.
- Consulta real de autores do usuario.
- Regras persistentes de duplicidade.

## Resultado

- Tela `/biblioteca/livros/novo` entregue como inclusao mockada protegida por sessao, com formulario pequeno em fluxo normal, sem topo fixo.
- Componentes UX temporarios criados: `MockBookCreateForm`, `MockBookDateInput` e `MockAuthorPicker`.
- `MockBookDateInput` segue o modelo fornecido: `input[type=date]`, indicador nativo escondido, botao de calendario via `showPicker` e
  classe `is-placeholder` quando o campo esta vazio ou incompleto.
- `MockAuthorPicker` segue o modelo fornecido: campo somente leitura, modal com pesquisa, lista rolavel, selecao de autor existente e
  criacao de novo nome; a opcao `Criar "autor"` aparece no inicio da lista filtrada.
- Validacoes simuladas de salvamento cobrem titulo curto, autor curto e duplicidade de titulo/autor; erros de titulo e autor aparecem juntos
  no message em tela, sem popup de erro.
- Datas incompletas ficam tratadas como ausencia de data na UX mockada.
- Salvamento valido usa popup de confirmacao e retorna para `/biblioteca/livros`.
- Retorno com alteracoes nao salvas usa popup com mensagem em cor padrao, botoes abaixo da mensagem e alinhados a direita; `Permanecer` e a
  acao principal e `Voltar sem salvar` e a acao secundaria.
- `PopupMessage` foi ajustado para manter titulo e corpo com cores padrao do tema e aplicar a cor semantica somente ao botao principal.
- Artefatos temporarios de UX: dados mockados, validacoes simuladas e navegacao por `globalThis.location`; as fases comuns devem substituir
  por handlers e integracao real quando implementarem persistencia.
- Artefatos reutilizaveis para fases futuras: visual dos componentes `MockBookDateInput` e `MockAuthorPicker`, fluxo de mensagem em tela
  para erro de formulario, popup de alteracoes nao salvas e ajuste do `PopupMessage`.
- Validacoes realizadas com `deno check`, `deno test islands\popup_message_test.ts`, `deno task build` e validacao visual/interativa do
  usuario em navegador.
- Usuario aprovou a fase em 2026-06-22. A F04 sera iniciada em outro momento.
