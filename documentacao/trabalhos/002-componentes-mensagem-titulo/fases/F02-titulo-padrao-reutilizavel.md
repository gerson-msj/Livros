# F02 - Titulo padrao reutilizavel

**Trabalho:** [TR-002 - Componentes de mensagem e titulo](../trabalho.md)

**Estado:** Planejada
**Depende de:** F01

## Objetivo tecnico

Criar um componente de titulo reutilizavel para paginas, com area esquerda configuravel, titulo alinhado a esquerda e botao de saida
opcional com confirmacao.

## Contexto necessario

- [TR-002](../trabalho.md): define estrutura do titulo, comportamento do botao voltar e saida encapsulada no componente.
- [Autenticacao e redefinicao de senha](../../../conhecimento.md#autenticacao-e-redefinicao-de-senha): o logout existente encerra sessao e
  limpa cookie.

## Entrega esperada

- Componente de titulo com tres areas: esquerda, titulo e direita.
- Area esquerda configuravel para icone padrao sem acao ou botao voltar.
- Botao voltar emitindo apenas a intencao de retorno para a pagina chamadora.
- Botao direito de saida opcional, exibido apenas quando o chamador solicitar.
- Confirmacao de saida usando o popup de mensagem da F01.
- Quando a saida for confirmada, o componente aciona o mecanismo de logout definido pela pagina ou pelo formulario existente.

## Criterios de conclusao

- O titulo renderiza corretamente com icone padrao, com botao voltar ou sem acao de retorno.
- O titulo renderiza corretamente com e sem botao de saida.
- Acionar voltar informa a intencao de retorno sem decidir navegacao diretamente.
- Acionar saida apresenta confirmacao e so prossegue quando o usuario confirma.
- Cancelar a confirmacao de saida mantem o usuario na pagina.
- O comportamento relevante possui verificacao adequada.

## Fora da fase

- Aplicar o titulo nas paginas existentes.
- Criar novo fluxo de autenticacao ou login.
- Implementar regras de formulario nao salvo.
