# F04 - Edicao e exclusao mockadas de livro

**Tarefa:** [TF-004 - Gerenciamento de livros avulsos](../tarefa.md)

**Estado:** Concluida **Depende de:** F03 **Tipo de fase:** UX **Executor:** designer

## Objetivo tecnico

Criar o fluxo mockado de edicao e exclusao de livro avulso, validando titulo e autor somente leitura, edicao de datas, confirmacoes e
retorno para a lista.

## Contexto necessario

- [Imutabilidade dos cadastros](../../../conhecimento.md#imutabilidade-dos-cadastros): depois do cadastro, somente datas podem ser
  alteradas.
- [TF-004](../tarefa.md): exclusao deve pedir confirmacao contendo o titulo do livro.
- [F03](F03-inclusao-mockada-livro.md): define componentes e padroes do formulario mockado.

## Entrega esperada

- Tela mockada de edicao com titulo e autor somente leitura.
- Datas editaveis com o mesmo padrao validado no fluxo de inclusao.
- Simulacao de salvar, excluir, voltar sem alteracoes e voltar com alteracoes nao salvas.
- Confirmacao de exclusao mencionando o livro correto.

## Criterios de conclusao

- Usuario valida em navegador que titulo e autor parecem claramente nao editaveis.
- Alterar datas simula salvamento com confirmacao e retorno para a lista.
- Datas incoerentes simulam erro antes do salvamento.
- Excluir simula confirmacao, mensagem de sucesso e retorno para a lista.
- Voltar com alteracoes nao salvas simula pedido de confirmacao.

## Fora da fase

- Exclusao real no banco.
- Atualizacao real de datas.
- Mudanca de titulo ou autor depois do cadastro.

## Resultado

- Tela `/biblioteca/livros/:id` entregue como edicao/exclusao mockada protegida por sessao.
- A lista mockada passou a abrir a rota de edicao ao selecionar um livro.
- Titulo e autor aparecem em campos somente leitura com ajuda textual indicando que nao podem ser alterados depois do cadastro.
- Datas permanecem editaveis com o mesmo componente `MockBookDateInput` validado no fluxo de inclusao.
- Salvamento mockado valida data de inicio posterior a data de conclusao, exibe erro em tela e, quando valido, mostra popup de confirmacao e
  retorna para `/biblioteca/livros`.
- Voltar sem alteracoes retorna diretamente para a lista; voltar com alteracoes nao salvas mostra popup de confirmacao.
- Exclusao mockada usa icone de lixeira no header, pede confirmacao contendo o titulo do livro, mostra mensagem de sucesso e retorna para a
  lista.
- Validacoes visuais/interativas realizadas pelo usuario no navegador local; ajustes pedidos de acentuacao foram aplicados.
- Artefatos reutilizaveis para fases futuras: visual do fluxo de edicao, uso do icone de exclusao no header, campos somente leitura para
  titulo/autor, mensagens de confirmacao e validacao de datas.
- Artefatos temporarios de UX: dados mockados, validacoes simuladas, exclusao simulada e navegacao por `globalThis.location`; as fases
  comuns devem substituir por handlers, regras e persistencia reais.
- Verificacoes realizadas com `deno fmt`, `deno lint`, `deno check` nos arquivos tocados, alem de `deno check` e `deno task build` durante a
  implementacao da fase.
- Usuario aprovou a fase em 2026-06-22.
