# F01 - Base de autenticacao para login e redefinicao

**Tarefa:** [TF-003 - Login e redefinicao de senha](../tarefa.md)

**Estado:** Concluida
**Depende de:** Nenhuma

## Objetivo tecnico

Permitir que a base de autenticacao valide credenciais de login e redefina senha usando a chave de redefinicao existente, mantendo as
decisoes atuais de seguranca, hash e sessao.

## Contexto necessario

- [Usuario](../../../conhecimento.md#usuario): regras atuais de nome de usuario, senha, chave de redefinicao e sessao inicial.
- [Autenticacao e redefinicao de senha](../../../conhecimento.md#autenticacao-e-redefinicao-de-senha): senha e chave sao armazenadas como
  hashes; redefinicao deve invalidar a chave usada e gerar nova chave.
- [TF-001 - Cadastro de usuarios](../../001-cadastro-de-usuarios/tarefa.md): fonte da base atual de dominio, servico, repositorios, hasher e
  sessoes.

## Entrega esperada

- Autenticacao por nome de usuario e senha disponivel para o fluxo de login.
- Redefinicao de senha por nome de usuario, chave atual e nova senha disponivel para o fluxo de recuperacao.
- Nova chave de redefinicao gerada apos redefinicao bem-sucedida.
- Sessao criada apos login ou redefinicao bem-sucedidos, usando as regras atuais de cookie e validade.

## Criterios de conclusao

- Credenciais validas autenticam o usuario e produzem uma sessao.
- Credenciais invalidas nao autenticam o usuario.
- Redefinicao com nome de usuario, chave atual e nova senha validos atualiza a senha, invalida a chave usada e retorna uma nova chave.
- Redefinicao invalida nao altera senha nem chave.
- Senhas e chaves continuam sem armazenamento em texto puro.
- Comportamentos sensiveis possuem verificacao automatizada adequada.

## Cuidados de implementacao

- Reutilizar a direcao atual de DDD pragmatico, provider por request, repositorios libSQL e hasher existente.
- Preservar a regra atual de minimo de 5 caracteres depois de remover espacos ao redor para senhas novas, salvo decisao explicita em
  contrario.
- Evitar mensagens tecnicas ou diferenciadas nessa camada que induzam a interface a revelar se usuario, senha ou chave falharam.

## Fora da fase

- Tela de login.
- Tela de redefinicao de senha.
- Ajustes visuais dos formularios.
- Mudanca de redirecionamento da biblioteca.

## Resultado

- Resultado entregue: servico de autenticacao passou a autenticar usuario por nome e senha, redefinir senha com chave atual, gerar nova chave e criar sessao apos login ou redefinicao.
- Verificacoes realizadas: `deno test --allow-env --allow-read --allow-write --allow-ffi aplicacao/autenticacao_service_test.ts infraestrutura/auth_repositories_test.ts`.
- Riscos, limitacoes ou pendencias: telas e redirecionamentos permanecem para as fases seguintes.
