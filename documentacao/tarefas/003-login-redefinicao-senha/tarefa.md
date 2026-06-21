# TF-003 - Login e redefinicao de senha

**Estado:** Concluida
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

**Revisao:** 3
**Proxima acao:** Tarefa concluida

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
- 2026-06-20: registrada revisao 3 apos validacao do projeto para corrigir limpeza persistente da sessao no logout e garantir no maximo uma
  sessao ativa por usuario.

## Controle de fases

| Fase | Estado             | Depende de | Resumo                                                          | Arquivo                                                                                                       |
| ---- | ------------------ | ---------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| F01  | Concluida          | Nenhuma    | Base de autenticacao para login e redefinicao.                  | [F01 - Base de autenticacao para login e redefinicao](fases/F01-base-autenticacao-login-redefinicao.md)       |
| F02  | Concluida          | F01        | Login como entrada principal do sistema.                        | [F02 - Login como entrada principal](fases/F02-login-entrada-principal.md)                                    |
| F03  | Concluida          | F01, F02   | Redefinicao de senha com apresentacao de nova chave.            | [F03 - Redefinicao de senha com nova chave](fases/F03-redefinicao-senha-nova-chave.md)                        |
| F04  | Concluida          | F02, F03   | Consistencia dos componentes e fluxo integrado de autenticacao. | [F04 - Consistencia componentes fluxo autenticacao](fases/F04-consistencia-componentes-fluxo-autenticacao.md) |
| F05  | Concluida          | F04        | Correcoes de validacao das telas publicas de autenticacao.      | [F05 - Correcoes validacao telas autenticacao](fases/F05-correcoes-validacao-telas-autenticacao.md)           |
| F06  | Concluida          | F05        | Sessao unica por usuario e limpeza persistente no logout.       | [F06 - Sessao unica por usuario e logout persistente](fases/F06-sessao-unica-usuario-logout-persistente.md)   |

## Resumo final da tarefa

### Fonte da verdade

A TF-003 implementou o login como entrada principal do sistema, a redefinicao de senha com chave de recuperacao, o alinhamento das telas
publicas de autenticacao e a regra de sessao unica por usuario. Visitantes sem sessao ativa agora sao direcionados para `/login`; usuarios
autenticados entram na biblioteca; cadastro e redefinicao apresentam a chave antes de permitir seguir autenticado para `/biblioteca`.

### Regras de negocio implementadas

- Login usa nome de usuario e senha, normalizando o nome de usuario e recusando credenciais invalidas com mensagem generica.
- Visitantes sem sessao ativa em `/biblioteca` sao redirecionados para `/login`.
- Usuario ja autenticado que acessa login, cadastro ou redefinicao de senha e redirecionado para `/biblioteca`.
- Redefinicao de senha exige nome de usuario, chave atual e nova senha validos; a chave usada deixa de funcionar e uma nova chave UUID e
  apresentada ao usuario.
- Login, cadastro e redefinicao bem-sucedidos criam sessao autenticada com validade de uma semana.
- O sistema mantem no maximo uma sessao persistida por usuario: criar nova sessao remove sessoes anteriores do mesmo usuario.
- Logout remove a sessao persistida do cookie atual, limpa o cookie HTTP e redireciona para `/login`.
- Um dispositivo antigo com cookie de sessao substituida perde acesso quando a sessao for validada e e redirecionado para `/login`.
- Campos de senha preservam o valor em erros de formulario e permitem alternar visibilidade por icone de olho.
- As chaves de redefinicao apresentadas em cadastro e redefinicao ficam visiveis para copia manual e usam acao de copiar quando o navegador
  suporta a Clipboard API.

### Decisoes tecnicas importantes

- A autenticacao continuou centralizada em `AuthenticationService`, repositorios libSQL e provider por request.
- Senhas e chaves de redefinicao seguem persistidas apenas como hashes PBKDF2 com SHA-256, salt aleatorio e 210000 iteracoes.
- A regra de sessao unica foi aplicada no ponto comum de criacao de sessao, antes da insercao da nova sessao.
- Sessoes substituidas ou encerradas sao removidas da tabela `sessions`; a coluna `ended_at` permanece no schema por compatibilidade.
- Login, cadastro, redefinicao e biblioteca continuam concentrando pagina e handlers `GET`/`POST` nas rotas Fresh correspondentes.
- Componentes pequenos compartilhados foram usados para campos de senha e apresentacao/copia de chave, sem criar biblioteca generica de
  formularios.

### Limites conhecidos

- Nao ha gestao de dispositivos, listagem de sessoes ou opcao de manter varias sessoes simultaneas.
- Nao foram implementados email, segundo fator, captcha, bloqueio por tentativas, perfil de usuario ou alteracao de nome.
- A coluna `ended_at` ainda existe no banco, embora o fluxo atual remova linhas de sessao em logout e substituicao de sessao.
- A biblioteca segue como area segura minima; livros, autores e series permanecem para tarefas futuras.

### Como validar

- Executar
  `deno test --allow-env --allow-read --allow-write --allow-ffi aplicacao/autenticacao_service_test.ts infraestrutura/auth_repositories_test.ts routes/biblioteca_test.ts routes/login_test.ts routes/cadastro_test.ts routes/redefinir_senha_test.ts routes/fluxo_cadastro_biblioteca_test.ts`.
- Executar `deno task build`.
- Em navegador, validar login, cadastro com exibicao de chave, redefinicao com nova chave, logout e substituicao da sessao ao entrar em outro
  dispositivo.

### Referencias

- [F01 - Base de autenticacao para login e redefinicao](fases/F01-base-autenticacao-login-redefinicao.md): servico de autenticacao,
  credenciais e repositorios.
- [F02 - Login como entrada principal](fases/F02-login-entrada-principal.md): rota `/login`, redirecionamentos e entrada autenticada.
- [F03 - Redefinicao de senha com nova chave](fases/F03-redefinicao-senha-nova-chave.md): uso da chave, geracao de nova chave e sessao apos
  redefinicao.
- [F04 - Consistencia componentes fluxo autenticacao](fases/F04-consistencia-componentes-fluxo-autenticacao.md): componentes
  compartilhados e verificacao integrada.
- [F05 - Correcoes validacao telas autenticacao](fases/F05-correcoes-validacao-telas-autenticacao.md): ajustes de validacao visual e
  interacao das telas publicas.
- [F06 - Sessao unica por usuario e logout persistente](fases/F06-sessao-unica-usuario-logout-persistente.md): regra de sessao unica e
  remocao persistente no logout.

## Consolidacao arquitetural

**Modo:** Consolidar
**Impacto permanente:** Sim

**Conhecimento afetado**

- [Conhecimento do projeto](../../conhecimento.md): dominio de usuario, estado atual, autenticacao e estado da tarefa.

**Atualizacoes**

- Login e redefinicao de senha foram registrados como capacidades existentes.
- Redirecionamentos publicos passaram a apontar para `/login`.
- Sessao unica por usuario, remocao persistente no logout e substituicao de sessao por novo login foram registrados como comportamento
  atual.
- Limites ainda nao implementados, como livros, autores, series, perfil, email e segundo fator, permaneceram diferenciados do estado atual.

**Decisoes pendentes**

- Nenhuma.

**Riscos ou inconsistencias**

- Nenhum bloqueante. A coluna `ended_at` permanece no schema apesar de o comportamento atual remover sessoes em vez de apenas marca-las como
  encerradas.

## Validacao final da tarefa

**Resultado:** Aprovado
**Retorno:** Tudo ok com a TF-003; pode finalizar a tarefa atual.

## Auditoria de encerramento

**Resultado:** Encerramento confirmado

### Verificacoes

- Todas as fases F01 a F06 estao `Concluida`.
- Expectativas de aceite foram cobertas por fases, testes e validacao do usuario.
- O resumo final representa o comportamento implementado.
- O conhecimento permanente foi consolidado em `documentacao/conhecimento.md`.
- Nao existem pendencias bloqueantes conhecidas relacionadas a TF-003.
