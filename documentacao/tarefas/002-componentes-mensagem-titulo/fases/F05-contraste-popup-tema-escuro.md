# F05 - Contraste popup tema escuro

**Tarefa:** [TF-002 - Componentes de mensagem e titulo](../tarefa.md)

**Estado:** Concluida
**Depende de:** F04

## Objetivo tecnico

Ajustar o popup de mensagem para ficar legivel e menos chamativo no tema escuro, conforme retorno da validacao visual no Chrome.

## Contexto necessario

- [F04](F04-ajuste-visual-titulo-popup.md): ajustou o layout do titulo e do popup, mas a validacao visual mostrou contraste ruim no popup em
  tema escuro.
- [TF-002](../tarefa.md): define que o popup deve manter chamada assincrona, retorno `ok` ou `cancel` e temas Bulma configuraveis.

## Entrega esperada

- Popup sem borda ou acento colorido no card.
- Texto do popup legivel no tema escuro.
- Confirmacao de saida usando botoes escuros quando aplicavel.
- Cores de tema mantidas apenas nos botoes do popup por enquanto.

## Criterios de conclusao

- Popup de confirmacao de saida fica sem borda colorida.
- Texto da mensagem fica legivel no tema escuro.
- Botoes do popup permanecem com mesmo tamanho e espacamento.
- Confirmar saida e cancelar por botao, clique fora ou `Esc` continuam funcionando.
- O comportamento relevante possui verificacao adequada.

## Fora da fase

- Alterar regras de cadastro, sessao ou logout.
- Redesenhar o popup alem do ajuste de contraste.

## Resultado

- Removida a borda colorida do card do popup.
- O texto do popup passou a herdar a cor do tema atual para manter legibilidade no tema escuro.
- A confirmacao de saida passou a usar tema `dark`, com botao positivo `is-dark` e botao negativo `is-dark is-outlined`.
- Verificacoes realizadas: `deno test islands\popup_message_test.ts islands\page_title_test.ts`, `deno lint islands\PageTitle.tsx islands\PopupMessage.tsx islands\popup_message_test.ts islands\page_title_test.ts`, `deno check islands\PageTitle.tsx islands\PopupMessage.tsx`, `deno test -A`, `deno lint .` e `deno check`.
- Validacao visual com `@chrome` nao foi concluida nesta execucao porque o plugin voltou a reportar a Codex Chrome Extension como desabilitada no perfil `Default`.
