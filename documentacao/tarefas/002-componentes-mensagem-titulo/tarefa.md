# TF-002 - Componentes de mensagem e titulo

**Estado:** Concluida
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

**Revisao:** 4
**Proxima acao:** checkpoint final

### Estrategia

Criar primeiro a base interativa do popup de mensagem, pois o titulo depende dela para confirmar a saida. Em seguida, criar o titulo
reutilizavel com areas configuraveis e, por fim, aplicar os componentes nas paginas existentes mantendo o logout atual da biblioteca como
mecanismo efetivo de saida. Depois da validacao visual, ajustar a apresentacao do titulo e do popup para alinhar os icones, simplificar a
saida e melhorar a legibilidade da confirmacao. A verificacao deve cobrir comportamento assincrono, fechamento por `Esc` e clique fora,
quebras de linha, temas Bulma e integracao nas paginas.

### Historico do plano

- 2026-06-19: revisao 2 adiciona F04 para ajustes visuais solicitados na validacao do titulo e do popup.
- 2026-06-19: revisao 3 adiciona F05 para corrigir contraste do popup no tema escuro apos validacao com Chrome.
- 2026-06-19: revisao 4 adiciona F06 para aproveitar o layout Bulma `message` do componente antigo no popup atual.

## Controle de fases

| Fase | Estado | Depende de | Resumo | Arquivo |
|---|---|---|---|---|
| F01 | Concluida | Nenhuma | Criar mensagem popup assincrona configuravel. | [F01 - Mensagem popup assincrona](fases/F01-mensagem-popup-assincrona.md) |
| F02 | Concluida | F01 | Criar titulo padrao reutilizavel com confirmacao de saida. | [F02 - Titulo padrao reutilizavel](fases/F02-titulo-padrao-reutilizavel.md) |
| F03 | Concluida | F02 | Aplicar o titulo em cadastro e biblioteca mantendo logout funcional. | [F03 - Aplicacao em cadastro e biblioteca](fases/F03-aplicacao-cadastro-biblioteca.md) |
| F04 | Concluida | F03 | Ajustar layout visual do titulo e do popup apos validacao. | [F04 - Ajuste visual titulo popup](fases/F04-ajuste-visual-titulo-popup.md) |
| F05 | Concluida | F04 | Ajustar contraste do popup no tema escuro. | [F05 - Contraste popup tema escuro](fases/F05-contraste-popup-tema-escuro.md) |
| F06 | Concluida | F05 | Refinar layout do popup com painel Bulma message. | [F06 - Layout popup bulma message](fases/F06-layout-popup-bulma-message.md) |

## Resumo final da tarefa

### Fonte da verdade

O TF-002 implementou componentes reutilizaveis de interface para mensagens em popup e titulo padrao de paginas. O sistema possui popup
assincrono configuravel com retorno `ok` ou `cancel`, painel visual baseado em Bulma `message`, suporte a quebras de linha, botoes
opcionais e temas Bulma. Tambem possui titulo padrao com area esquerda configuravel, evento de intencao de voltar e acao de saida com
confirmacao. As paginas `/cadastro` e `/biblioteca` usam o novo titulo, e a biblioteca confirma a saida antes de executar o logout
existente.

### Regras de negocio implementadas

- Um chamador consegue abrir uma mensagem em popup, configurar texto, tema e botoes, e aguardar retorno `ok` ou `cancel`.
- Clique fora do popup e tecla `Esc` sempre cancelam a mensagem com retorno `cancel`, mesmo sem botoes visiveis.
- Mensagens com quebras de linha sao exibidas como texto legivel, sem interpretar a mensagem como HTML livre.
- O titulo padrao pode exibir icone esquerdo, botao voltar ou area esquerda vazia.
- O botao voltar apenas emite a intencao de retorno para a pagina chamadora, sem decidir navegacao.
- A acao de saida do titulo confirma a intencao antes de submeter o formulario de logout configurado.
- A pagina de cadastro exibe o titulo padrao sem alterar o fluxo de cadastro.
- A pagina de biblioteca exibe o titulo padrao com icone de saida e mantem o logout existente.

### Decisoes tecnicas importantes

- O popup foi entregue como hook `usePopupMessage`, mantendo a chamada assincrona dentro de islands Preact.
- O visual final do popup usa composicao Bulma `message` e `message-body`, evitando estrutura principal baseada em `modal-card`.
- Os temas do popup sao aplicados por classes Bulma nos botoes e no painel `message`, com confirmacao de saida usando tema `dark`.
- O titulo foi entregue como island `PageTitle`, com evento customizado `livros:page-title-back-intent` para comunicar a intencao de voltar.
- O logout permanece responsabilidade da pagina que contem o formulario; o titulo apenas confirma e submete o formulario indicado.

### Limites conhecidos

- O popup e o titulo nao criam novos fluxos de autenticacao, login ou redefinicao de senha.
- O botao voltar nao implementa regra de perda de dados nao salvos; paginas chamadoras continuam responsaveis por decidir a navegacao.
- Validacoes visuais em browser foram limitadas pela indisponibilidade intermitente das ferramentas de navegador; os ajustes visuais foram
  verificados por testes, lint, typecheck e retornos de validacao humana.
- `deno task check` global ainda possui historico de falha de formatacao preexistente fora do escopo da tarefa, mas as verificacoes focadas
  e os comandos globais de lint, typecheck e testes passaram nas fases finais.

### Como validar

- Executar `deno test islands\popup_message_test.ts islands\page_title_test.ts`.
- Executar `deno test routes\cadastro_test.ts routes\biblioteca_test.ts routes\fluxo_cadastro_biblioteca_test.ts -A`.
- Em servidor local, abrir `/cadastro` e confirmar o titulo "Criar conta"; abrir `/biblioteca` autenticado, acionar o icone de saida,
  cancelar a confirmacao por botao, clique fora ou `Esc`, e confirmar que a sessao permanece ativa; confirmar a saida e verificar retorno
  para `/cadastro`.

### Referencias

- [F01 - Mensagem popup assincrona](fases/F01-mensagem-popup-assincrona.md): hook, retorno assincrono, botoes opcionais, temas e
  cancelamento.
- [F02 - Titulo padrao reutilizavel](fases/F02-titulo-padrao-reutilizavel.md): titulo, evento de voltar e confirmacao de saida.
- [F03 - Aplicacao em cadastro e biblioteca](fases/F03-aplicacao-cadastro-biblioteca.md): uso inicial nas paginas existentes.
- [F04 - Ajuste visual titulo popup](fases/F04-ajuste-visual-titulo-popup.md): refinamentos de alinhamento, acao de saida e posicao do
  popup.
- [F05 - Contraste popup tema escuro](fases/F05-contraste-popup-tema-escuro.md): legibilidade no tema escuro.
- [F06 - Layout popup Bulma message](fases/F06-layout-popup-bulma-message.md): painel final baseado em Bulma `message`.

## Consolidacao arquitetural

**Modo:** Consolidar **Impacto permanente:** Sim

**Conhecimento afetado**

- [Conhecimento do projeto](../../conhecimento.md): recursos existentes e direcao de interface com Bulma.

**Atualizacoes**

- Popup de mensagem assincrono e titulo padrao foram registrados como capacidades existentes de interface.
- Aplicacao do titulo em `/cadastro` e `/biblioteca`, incluindo confirmacao de saida da biblioteca, foi registrada como estado atual.
- O uso de islands Preact pequenas para interacoes reutilizaveis de interface foi registrado na decisao de interface.

**Decisoes pendentes**

- Nenhuma.

**Riscos ou inconsistencias**

- Nenhum bloqueante. Permanece registrado que o botao voltar apenas informa intencao e nao decide navegacao ou perda de dados.

## Validacao final da tarefa

**Resultado:** Aprovado
**Retorno:** Pode finalizar a tarefa vigente.

## Auditoria de encerramento

**Resultado:** Encerramento confirmado

### Verificacoes

- Todas as fases estao em estado terminal `Concluida`.
- Expectativas de aceite da tarefa foram atendidas por fases, resultados e verificacoes registradas.
- Validacao humana final da tarefa foi registrada.
- Resumo final representa o comportamento implementado, incluindo ajustes visuais de F04, F05 e F06.
- Conhecimento permanente foi consolidado em `documentacao/conhecimento.md`.
- Nao existem pendencias bloqueantes conhecidas relacionadas ao TF-002.
