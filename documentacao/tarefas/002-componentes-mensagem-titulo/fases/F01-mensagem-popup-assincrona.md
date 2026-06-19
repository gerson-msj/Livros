# F01 - Mensagem popup assincrona

**Tarefa:** [TF-002 - Componentes de mensagem e titulo](../tarefa.md)

**Estado:** Planejada
**Depende de:** Nenhuma

## Objetivo tecnico

Permitir que componentes interativos exibam um popup de mensagem configuravel e aguardem assincronamente a escolha do usuario.

## Contexto necessario

- [Interface com Bulma](../../../conhecimento.md#interface-com-bulma): o popup deve usar Bulma como base visual.
- [TF-002](../tarefa.md): define retorno `ok` ou `cancel`, botoes opcionais, temas, quebras de linha e cancelamento por clique fora ou
  `Esc`.

## Entrega esperada

- Componente interativo reutilizavel para abrir mensagens em popup.
- API de chamada assincrona que resolve `ok` ou `cancel`.
- Configuracao de mensagem, tema visual e textos dos botoes positivo e negativo.
- Suporte a exibir ambos os botoes, apenas um deles ou nenhum.
- Fechamento por clique fora e tecla `Esc` sempre resolvendo `cancel`.
- Exibicao legivel de mensagens com quebras de linha, sem interpretar a mensagem como HTML livre.
- Posicionamento visual do popup um pouco acima do centro quando houver espaco.

## Criterios de conclusao

- Um chamador consegue abrir o popup, aguardar o resultado e receber `ok` ao acionar o botao positivo.
- Um chamador recebe `cancel` ao acionar o botao negativo, clicar fora ou pressionar `Esc`.
- O popup funciona quando nenhum botao e exibido.
- O texto preserva quebras de linha de forma legivel.
- Os temas Bulma previstos podem ser aplicados visualmente.
- O comportamento relevante possui verificacao adequada.

## Fora da fase

- Criar o componente de titulo.
- Aplicar o popup nas paginas de cadastro e biblioteca.
- Alterar fluxo de logout.
