# F04 - Ajuste visual titulo popup

**Tarefa:** [TF-002 - Componentes de mensagem e titulo](../tarefa.md)

**Estado:** Concluida
**Depende de:** F03

## Objetivo tecnico

Ajustar a apresentacao visual do titulo padrao e do popup de mensagem conforme retorno de validacao, preservando os comportamentos ja
entregues.

## Contexto necessario

- [TF-002](../tarefa.md): define o componente de mensagem, o titulo reutilizavel e a aplicacao inicial em cadastro e biblioteca.
- [F01](F01-mensagem-popup-assincrona.md): entrega o popup assincrono que deve continuar retornando `ok` ou `cancel`.
- [F02](F02-titulo-padrao-reutilizavel.md): entrega o titulo reutilizavel que deve manter o botao de saida opcional e o evento de voltar.
- [F03](F03-aplicacao-cadastro-biblioteca.md): aplica os componentes nas paginas existentes.

## Entrega esperada

- Icone esquerdo do titulo alinhado ao texto e com altura visual equivalente a altura do titulo.
- Acao de sair exibida somente como icone, sem contorno visual de botao, mantendo acessibilidade e confirmacao antes do logout.
- Popup de mensagem sem titulo visual na confirmacao de saida.
- Botoes do popup com mesmo tamanho e espaco entre eles.
- Popup posicionado acima do centro visual conforme a expectativa original.
- Destaque visual do popup aplicado preferencialmente na borda ou acento, evitando que a mensagem inteira use a cor forte do Bulma.

## Criterios de conclusao

- Cadastro e biblioteca exibem o titulo com icone esquerdo alinhado e proporcional ao texto.
- Biblioteca exibe a saida como icone sem contorno de botao e ainda permite confirmar logout.
- Popup de confirmacao de saida aparece sem titulo visual, com botoes de mesmo tamanho e espaco perceptivel entre eles.
- O popup fica visualmente acima do centro da tela quando ha espaco.
- A cor de destaque do popup aparece como borda ou acento, com corpo visualmente mais neutro e legivel.
- Confirmar saida encerra a sessao e cancelar por botao, clique fora ou `Esc` mantem a pagina atual.
- O comportamento relevante possui verificacao adequada.

## Fora da fase

- Alterar regras de cadastro, sessao ou logout.
- Criar novas paginas ou novos fluxos.
- Redefinir a API publica dos componentes alem do necessario para o ajuste visual.

## Resultado

- Ajustado o titulo para alinhar o icone esquerdo ao texto e deixar a acao de saida como icone sem contorno visual de botao.
- Ajustada a confirmacao de saida para abrir o popup sem titulo visual, com corpo neutro, destaque por borda colorida, posicao acima do centro e botoes com mesmo tamanho e espacamento.
- O comportamento de confirmacao, cancelamento por botao, clique fora ou `Esc` e submissao do formulario de logout foi preservado.
- Verificacoes realizadas: `deno test islands\page_title_test.ts islands\popup_message_test.ts`, `deno lint islands\PageTitle.tsx islands\PopupMessage.tsx islands\page_title_test.ts islands\popup_message_test.ts routes\cadastro.tsx routes\biblioteca.tsx`, `deno check islands\PageTitle.tsx islands\PopupMessage.tsx routes\cadastro.tsx routes\biblioteca.tsx`, `deno test -A`, `deno lint .` e `deno check`.
- Validacao visual em navegador nao foi concluida nesta sessao porque o navegador interno nao estava disponivel e o servidor local nao respondeu na tentativa de conferencia.
