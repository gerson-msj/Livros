# F06 - Layout popup Bulma message

**Tarefa:** [TF-002 - Componentes de mensagem e titulo](../tarefa.md)

**Estado:** Concluida
**Depende de:** F05

## Objetivo tecnico

Refinar o visual do popup atual aproveitando a composicao Bulma `message` usada no componente antigo, sem alterar o contrato de chamada ou o
retorno assincrono.

## Contexto necessario

- [F05](F05-contraste-popup-tema-escuro.md): removeu a borda colorida do popup e ajustou a confirmacao de saida para tema escuro.
- Componente antigo informado pelo usuario: usar como referencia visual, especialmente a estrutura `message` e `message-body`, sem
  reaproveitar o controlador ou mudar o funcionamento atual.

## Entrega esperada

- Popup renderizado com aparencia mais proxima de um painel Bulma `message`.
- Confirmacao sem titulo continua compacta e legivel no tema escuro.
- Mensagens com quebras de linha continuam legiveis.
- Botoes mantem tamanho consistente, espacamento e cores de tema.

## Criterios de conclusao

- O popup deixa de usar visual de `modal-card` como estrutura principal.
- A estrutura visual usa Bulma `message` sem reintroduzir borda customizada no popup.
- Confirmar, cancelar, clique fora e `Esc` continuam funcionando.
- O comportamento relevante possui verificacao adequada.

## Fora da fase

- Alterar API publica do popup.
- Alterar regras de logout, sessao, cadastro ou navegacao.
- Trocar textos dos botoes por icones.

## Resultado

- O popup passou a usar um painel Bulma `message` dentro do modal, substituindo a estrutura visual baseada em `modal-card`.
- A mensagem usa `white-space: pre-wrap`, preservando quebras de linha sem montagem manual por linha.
- Os botoes ficam no corpo do painel, com tamanho minimo e espacamento preservados; em telas estreitas, passam a ocupar largura equivalente.
- A borda lateral padrao do `message-body` foi removida para manter o popup sem borda customizada.
- Verificacoes realizadas: `deno test islands\popup_message_test.ts islands\page_title_test.ts`, `deno lint islands\PopupMessage.tsx islands\popup_message_test.ts islands\PageTitle.tsx islands\page_title_test.ts`, `deno check islands\PopupMessage.tsx islands\PageTitle.tsx`, `deno test -A`, `deno lint .` e `deno check`.
- Validacao visual em navegador nao foi concluida nesta execucao porque nenhuma ferramenta de controle de browser estava disponivel na sessao.
