# F03 - Redefinicao de senha com nova chave

**Tarefa:** [TF-003 - Login e redefinicao de senha](../tarefa.md)

**Estado:** Concluida
**Depende de:** F01, F02

## Objetivo tecnico

Criar a tela de redefinicao de senha usando nome de usuario, chave atual e nova senha, apresentando uma nova chave antes de encaminhar o
usuario autenticado para a biblioteca.

## Contexto necessario

- [Usuario](../../../conhecimento.md#usuario): redefinicao planejada exige nome de usuario, chave de redefinicao e nova senha.
- [Autenticacao e redefinicao de senha](../../../conhecimento.md#autenticacao-e-redefinicao-de-senha): a chave usada deve ser invalidada e
  substituida por nova chave apresentada ao usuario.
- [TF-001 - Cadastro de usuarios](../../001-cadastro-de-usuarios/tarefa.md): cadastro ja apresenta chave UUID, permite copia e possui
  fallback manual.
- [TF-002 - Componentes de mensagem e titulo](../../002-componentes-mensagem-titulo/tarefa.md): titulo padrao e comportamento de voltar
  devem orientar a navegacao da tela publica.

## Entrega esperada

- Tela de redefinicao com nome de usuario, chave de redefinicao e nova senha.
- Nova senha com icone de olho dentro do campo para alternar visualizacao.
- Redefinicao valida atualiza a senha, invalida a chave usada, gera nova chave e cria sessao.
- Redefinicao invalida apresenta mensagem generica e amigavel.
- Nova chave apresentada ao usuario em campo com icone de copiar dentro da caixa.
- Usuario consegue prosseguir para `/biblioteca` apos visualizar a nova chave, mesmo se a copia automatica falhar.
- Usuario ja logado que acessa redefinicao e redirecionado para `/biblioteca`.

## Criterios de conclusao

- Um usuario consegue redefinir a senha com nome, chave atual e nova senha validos.
- A chave antiga deixa de funcionar apos a redefinicao.
- A nova senha passa a autenticar no login.
- Tentativa invalida de redefinicao nao troca senha nem chave.
- A nova chave pode ser copiada quando a Clipboard API esta disponivel e permanece visivel para copia manual.
- A tela oferece voltar para o login por meio do titulo padrao ou comportamento equivalente definido para a pagina.
- O usuario autenticado chega a `/biblioteca` depois de confirmar que visualizou a nova chave.
- O fluxo possui verificacao automatizada adequada e permanece utilizavel em desktop e mobile.

## Cuidados de implementacao

- Nao depender exclusivamente da Clipboard API para liberar o prosseguimento do usuario.
- Evitar diferenciar mensagens de erro entre usuario inexistente, chave incorreta e nova senha invalida, exceto validacoes locais de campos
  vazios ou curtos quando ja forem padrao da interface.

## Fora da fase

- Recuperacao por email.
- Politica avancada de senha.
- Bloqueio por tentativas.
- Refatoracao ampla dos componentes compartilhados alem do necessario para esta tela funcionar.

## Resultado

- Resultado entregue: rota `/redefinir-senha` criada com formulario de usuario, chave atual e nova senha, alternancia de visualizacao da nova senha, redefinicao com geracao de nova chave, criacao de sessao e painel para copiar a nova chave dentro do campo antes de seguir para `/biblioteca`.
- Verificacoes realizadas: `deno test --allow-env routes/redefinir_senha_test.ts islands/page_title_test.ts islands/cadastro_interactions_test.ts`; `deno task build`.
- Riscos, limitacoes ou pendencias: consistencia visual compartilhada entre cadastro, login e redefinicao permanece para a F04.
