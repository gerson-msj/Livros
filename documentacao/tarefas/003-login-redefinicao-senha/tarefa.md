# TF-003 - Login e redefinicao de senha

**Estado:** Em desenvolvimento
**Tipo:** Nova capacidade

## Resumo

O sistema ja permite cadastro de usuarios e sessao inicial, mas ainda nao possui uma tela de entrada propria nem usa a chave de redefinicao
para recuperar o acesso. A tarefa deve transformar o login na entrada principal do sistema, permitir redefinir senha com a chave existente e
manter os caminhos entre login, cadastro, redefinicao e biblioteca claros para o usuario.

## Escopo

- Criar a tela publica de login como entrada principal do sistema.
- Solicitar nome de usuario e senha no login.
- Permitir visualizar ou ocultar a senha com icone de olho dentro do campo de senha.
- Apresentar mensagens amigaveis explicando que o usuario pode entrar, criar conta ou redefinir a senha.
- Permitir navegar do login para o cadastro existente.
- Permitir navegar do login para a nova tela de redefinicao de senha.
- Usar o titulo padrao nas telas publicas envolvidas, com opcao de voltar quando aplicavel.
- Encaminhar login bem-sucedido para `/biblioteca`.
- Criar a tela de redefinicao de senha com nome de usuario, chave de redefinicao e nova senha.
- Permitir visualizar ou ocultar a nova senha com icone de olho dentro do campo.
- Validar a redefinicao usando nome de usuario, chave atual e nova senha.
- Ao redefinir a senha com sucesso, invalidar a chave usada, gerar uma nova chave de redefinicao e apresenta-la ao usuario.
- Apresentar a nova chave de redefinicao em campo com icone de copiar dentro da propria caixa de texto.
- Permitir que o usuario prossiga para `/biblioteca` depois de visualizar a nova chave, sem depender exclusivamente do sucesso da Clipboard
  API.
- Criar sessao para o usuario apos login ou redefinicao de senha bem-sucedidos.
- Redirecionar visitantes sem sessao ativa de `/biblioteca` para o login.
- Redirecionar o usuario para o login depois do logout da biblioteca.
- Redirecionar usuario ja logado que acessar login, cadastro ou redefinicao de senha para `/biblioteca`.
- Extrair componentes reutilizaveis pequenos para os campos e controles repetidos quando isso reduzir duplicacao imediata entre login,
  cadastro e redefinicao, sem criar uma biblioteca generica de formularios.

## Fora do escopo

- Recuperacao de senha por email.
- Perfil de usuario ou edicao de conta.
- Alteracao de nome de usuario.
- Politica avancada de senha alem das regras atuais do projeto.
- Bloqueio por tentativas, captcha, segundo fator ou mecanismos anti-abuso.
- Funcao de lembrar usuario ou alterar a duracao atual da sessao.
- Cadastro, edicao ou listagem de livros, autores e series.
- Redesenho profundo da tela de cadastro alem da navegacao e de reutilizacoes pequenas justificadas pela duplicacao real.

## Expectativas de aceite

- Um visitante sem sessao que acessa `/biblioteca` e levado para a tela de login.
- Um usuario consegue entrar com nome de usuario e senha validos e e levado para `/biblioteca`.
- Tentativa invalida de login apresenta mensagem amigavel e generica, sem revelar se o usuario existe ou se a senha esta incorreta.
- A tela de login apresenta caminhos claros para criar conta ou redefinir senha.
- A tela de cadastro existente continua acessivel a partir do login.
- As telas publicas envolvidas usam o titulo padrao e o comportamento de voltar quando aplicavel.
- Um usuario consegue redefinir a senha informando nome de usuario, chave de redefinicao atual e nova senha validos.
- Tentativa invalida de redefinicao apresenta mensagem amigavel e generica, sem revelar qual dado falhou.
- Apos redefinir a senha, a chave usada deixa de funcionar e uma nova chave e apresentada ao usuario.
- A nova chave pode ser copiada quando o navegador suporta a Clipboard API e permanece visivel para copia manual quando a copia automatica
  falha ou nao esta disponivel.
- Depois de visualizar a nova chave, o usuario consegue prosseguir para `/biblioteca` autenticado.
- Logout encerra a sessao e retorna para a tela de login.
- Usuario ja logado que acessa login, cadastro ou redefinicao de senha e redirecionado para `/biblioteca`.
- Campos de senha apresentam o icone de olho a direita dentro da caixa de texto.
- O campo de chave apresentada ao usuario mostra o icone de copiar a direita dentro da caixa de texto.
- A interface permanece utilizavel em desktop e mobile.

## Conhecimento relacionado

- [Usuario](../../conhecimento.md#usuario): login e redefinicao de senha completam o ciclo minimo de acesso das contas existentes.
- [Autenticacao e redefinicao de senha](../../conhecimento.md#autenticacao-e-redefinicao-de-senha): a tarefa concretiza a redefinicao
  planejada e altera a entrada principal do sistema.
- [Estado atual](../../conhecimento.md#estado-atual): cadastro, sessao inicial, biblioteca segura minima, logout, popup e titulo padrao ja
  existem e devem ser preservados.
- [Interface com Bulma](../../conhecimento.md#interface-com-bulma): os novos formularios e componentes devem manter Bulma como base visual.
- [TF-001 - Cadastro de usuarios](../001-cadastro-de-usuarios/tarefa.md): fonte do comportamento atual de cadastro, sessao, chave de
  redefinicao e biblioteca segura.
- [TF-002 - Componentes de mensagem e titulo](../002-componentes-mensagem-titulo/tarefa.md): fonte do titulo padrao, popup de mensagem e
  comportamento de voltar.

## Avaliacao arquitetural

Impacto permanente identificado: sim. A tarefa transforma login e redefinicao de senha de capacidades planejadas em recursos existentes,
altera a rota publica principal do fluxo de autenticacao, ajusta redirecionamentos de sessao e pode consolidar componentes reutilizaveis
pequenos para formularios de autenticacao. Quando a entrega for validada, o conhecimento permanente devera ser atualizado para refletir o
novo estado atual da autenticacao.

## Decisoes pendentes

Nenhuma. A proposta assume que a redefinicao de senha bem-sucedida cria uma sessao e leva o usuario para `/biblioteca` depois que a nova
chave for apresentada.

## Plano

**Revisao:** 2
**Proxima acao:** Aguardar confirmacao para desenvolver F05

### Estrategia

Entregar o fluxo em fatias verticais pequenas, preservando a autenticacao existente e trocando gradualmente a entrada publica principal de
`/cadastro` para login. Primeiro, a base de dominio e aplicacao deve passar a autenticar com senha e redefinir senha com chave, mantendo
hashes e sessoes. Depois, o login assume os redirecionamentos principais e o logout passa a retornar para ele. Em seguida, a redefinicao de
senha completa o uso da chave e apresenta uma nova chave ao usuario. Por fim, as telas publicas de autenticacao sao alinhadas com
componentes pequenos e verificacao integrada, sem criar uma biblioteca generica de formularios.

### Cuidados gerais

- Mensagens de falha de login e redefinicao devem ser amigaveis e genericas, sem revelar se usuario, senha ou chave foram o dado incorreto.
- A nova chave de redefinicao deve continuar visivel para copia manual mesmo quando a Clipboard API falhar ou nao estiver disponivel.
- Componentes reutilizaveis devem nascer da duplicacao real entre as telas, mantendo o MVP simples.

### Historico do plano

- 2026-06-20: registrada revisao 2 apos validacao do projeto para corrigir interacoes dos icones, navegacao de volta, preservacao de senha
  em erro e permanencia na tela de chave apos cadastro.

## Controle de fases

| Fase | Estado             | Depende de | Resumo                                                          | Arquivo                                                                                                       |
| ---- | ------------------ | ---------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| F01  | Concluida          | Nenhuma    | Base de autenticacao para login e redefinicao.                  | [F01 - Base de autenticacao para login e redefinicao](fases/F01-base-autenticacao-login-redefinicao.md)       |
| F02  | Concluida          | F01        | Login como entrada principal do sistema.                        | [F02 - Login como entrada principal](fases/F02-login-entrada-principal.md)                                    |
| F03  | Concluida          | F01, F02   | Redefinicao de senha com apresentacao de nova chave.            | [F03 - Redefinicao de senha com nova chave](fases/F03-redefinicao-senha-nova-chave.md)                        |
| F04  | Concluida          | F02, F03   | Consistencia dos componentes e fluxo integrado de autenticacao. | [F04 - Consistencia componentes fluxo autenticacao](fases/F04-consistencia-componentes-fluxo-autenticacao.md) |
| F05  | Planejada          | F04        | Correcoes de validacao das telas publicas de autenticacao.      | [F05 - Correcoes validacao telas autenticacao](fases/F05-correcoes-validacao-telas-autenticacao.md)           |

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
