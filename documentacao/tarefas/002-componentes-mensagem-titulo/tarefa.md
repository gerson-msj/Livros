# TF-002 - Componentes de mensagem e titulo

**Estado:** Em desenvolvimento
**Tipo:** Nova capacidade

## Resumo

O sistema precisa de componentes reutilizaveis para apresentar mensagens em popup e padronizar o titulo das paginas. O objetivo e permitir
confirmacoes e avisos consistentes, alem de preparar uma estrutura comum de cabecalho para telas como cadastro de usuario e biblioteca.

## Escopo

- Criar um componente de mensagem em popup com chamada assincrona e retorno `ok` ou `cancel`.
- Permitir mensagem com quebras de linha.
- Permitir botao positivo, botao negativo, ambos, apenas um deles ou nenhum.
- Permitir textos configuraveis para os botoes.
- Tratar clique fora e tecla `Esc` como `cancel`, mesmo quando nenhum botao estiver visivel.
- Permitir escolher o tema visual entre os temas do Bulma adequados para avisos, alertas, erros e mensagens comuns.
- Posicionar o popup um pouco acima do centro visual, cerca de 100 a 150 px abaixo do topo quando houver espaco.
- Criar um componente de titulo reutilizavel com area esquerda, titulo alinhado a esquerda e botao direito opcional.
- Permitir que a area esquerda apresente um icone padrao sem acao ou um botao voltar.
- Fazer o botao voltar apenas informar a intencao de retorno para a pagina chamadora.
- Encapsular no componente de titulo o botao direito de saida, com confirmacao usando o componente de mensagem.
- Aplicar o novo componente de titulo na pagina de cadastro de usuario e na pagina biblioteca.

## Fora do escopo

- Criar fluxo novo de login ou autenticacao.
- Alterar regras de logout alem do necessario para acionar a saida pelo novo componente.
- Fazer o componente de titulo decidir sobre perda de dados nao salvos ao voltar.
- Implementar comportamento de formulario nao salvo fora das paginas que usam o botao voltar.

## Expectativas de aceite

- Um chamador consegue exibir uma mensagem em popup, configurar texto, botoes e tema, e aguardar o retorno `ok` ou `cancel`.
- Clique fora e `Esc` fecham a mensagem com retorno `cancel`.
- Mensagens com quebras de linha sao exibidas de forma legivel.
- O titulo padrao aparece nas paginas de cadastro de usuario e biblioteca.
- A pagina de biblioteca pode apresentar o botao de saida no titulo e confirmar a acao com o popup de mensagem.
- Uma pagina que use o botao voltar recebe apenas a intencao de retorno e continua responsavel por decidir o que fazer.

## Conhecimento relacionado

- [Interface com Bulma](../../conhecimento.md#interface-com-bulma): os novos componentes devem preservar Bulma como base visual do projeto.
- [Estado atual](../../conhecimento.md#estado-atual): cadastro de usuarios e biblioteca ja existem e serao as primeiras paginas a usar o
  componente de titulo.
- [Autenticacao e redefinicao de senha](../../conhecimento.md#autenticacao-e-redefinicao-de-senha): a biblioteca ja possui logout; o novo
  componente deve apenas acionar esse comportamento de forma padronizada.

## Avaliacao arquitetural

Impacto permanente identificado na camada de interface. O tarefa cria convencoes reutilizaveis para mensagens e titulos de paginas, mas
nao exige nova decisao arquitetural pesada. A direcao permanente afetada e o uso de Bulma e a padronizacao gradual da experiencia visual.

## Decisoes pendentes

Nenhuma.

## Plano

**Revisao:** 1
**Proxima acao:** Desenvolver fases

### Estrategia

Criar primeiro a base interativa do popup de mensagem, pois o titulo depende dela para confirmar a saida. Em seguida, criar o titulo
reutilizavel com areas configuraveis e, por fim, aplicar os componentes nas paginas existentes mantendo o logout atual da biblioteca como
mecanismo efetivo de saida. A verificacao deve cobrir comportamento assincrono, fechamento por `Esc` e clique fora, quebras de linha, temas
Bulma e integracao nas paginas.

## Controle de fases

| Fase | Estado | Depende de | Resumo | Arquivo |
|---|---|---|---|---|
| F01 | Concluida | Nenhuma | Criar mensagem popup assincrona configuravel. | [F01 - Mensagem popup assincrona](fases/F01-mensagem-popup-assincrona.md) |
| F02 | Concluida | F01 | Criar titulo padrao reutilizavel com confirmacao de saida. | [F02 - Titulo padrao reutilizavel](fases/F02-titulo-padrao-reutilizavel.md) |
| F03 | Planejada | F02 | Aplicar o titulo em cadastro e biblioteca mantendo logout funcional. | [F03 - Aplicacao em cadastro e biblioteca](fases/F03-aplicacao-cadastro-biblioteca.md) |

## Resumo final da tarefa

Aguardando encerramento.

### Fonte da verdade

Aguardando encerramento.

### Regras de negocio implementadas

Aguardando encerramento.

### Decisoes tecnicas importantes

Aguardando encerramento.

### Limites conhecidos

Aguardando encerramento.
