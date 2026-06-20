# F05 - Correcoes validacao telas autenticacao

**Tarefa:** [TF-003 - Login e redefinicao de senha](../tarefa.md)

**Estado:** Planejada
**Depende de:** F04

## Objetivo tecnico

Corrigir problemas encontrados na validacao manual das telas publicas de autenticacao, preservando o fluxo planejado de login, cadastro,
redefinicao e apresentacao da chave.

## Contexto necessario

- [F02 - Login como entrada principal](F02-login-entrada-principal.md): login, redirecionamentos e campo de senha com icone de olho.
- [F03 - Redefinicao de senha com nova chave](F03-redefinicao-senha-nova-chave.md): redefinicao, botao voltar e apresentacao de nova chave.
- [F04 - Consistencia componentes fluxo autenticacao](F04-consistencia-componentes-fluxo-autenticacao.md): componentes compartilhados de
  senha e chave.

## Entrega esperada

- O icone de olho alterna corretamente a visibilidade da senha nos formularios de login, cadastro e redefinicao.
- O botao de voltar usa apenas o icone de chevron, sem aparencia de botao Bulma, mantendo a mesma area ocupada e tamanho do icone estatico
  quando nao ha volta.
- A tela `/cadastro` tambem apresenta o botao de voltar para retornar ao login.
- Quando ocorre mensagem de erro, a senha digitada permanece no formulario para correcao imediata pelo usuario.
- Apos criar uma nova conta, o usuario permanece na tela de cadastro visualizando a chave de redefinicao e pode copia-la antes de seguir
  para `/biblioteca`.

## Criterios de conclusao

- O comportamento de alternar senha e preservacao de valores apos erro possui verificacao adequada.
- Cadastro, login e redefinicao mantem navegacao clara com o mesmo padrao de titulo e volta.
- Cadastro bem-sucedido continua criando sessao, mas nao redireciona automaticamente antes da chave ser apresentada.
- A chave de cadastro permanece visivel e copiavel com caminho manual para seguir a `/biblioteca`.
- Ajustes visuais dos icones sao verificados em desktop e mobile quando o navegador estiver disponivel.

## Cuidados de implementacao

- Preservar a sessao criada no cadastro para que o botao "Ir para biblioteca" continue funcionando sem novo login.
- Evitar depender de estado interno perdido pela hidratacao dos islands para os botoes de icone.
- Manter a aparencia do titulo consistente entre os modos com e sem volta.

## Fora da fase

- Redesenho completo das telas de autenticacao.
- Alteracao de regras de senha, chave ou duracao de sessao.
- Novos recursos de cadastro, perfil ou biblioteca.
