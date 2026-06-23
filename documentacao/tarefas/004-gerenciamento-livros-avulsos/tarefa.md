# TF-004 - Gerenciamento de livros avulsos

**Estado:** Em desenvolvimento **Tipo:** Nova capacidade

## Resumo

A area segura `/biblioteca` existe, mas ainda nao permite ao usuario registrar os livros que esta lendo ou ja leu. A tarefa deve criar o
gerenciamento de livros avulsos do usuario autenticado, permitindo listar, incluir, editar datas e excluir livros proprios, com autores
privados por usuario e reutilizaveis em cadastros futuros.

O resultado esperado e que o usuario acesse seus livros a partir da biblioteca, visualize sua lista, cadastre livros com autor existente ou
novo, altere somente datas depois do cadastro e exclua livros quando necessario, recebendo confirmacoes e alertas nos fluxos criticos.

## Escopo

- Adicionar na tela `/biblioteca` uma entrada para o gerenciamento de livros.
- Prever que a tela `/biblioteca` tera futuramente tambem uma entrada para series, sem implementar series nesta tarefa.
- Criar a rota de listagem de livros avulsos do usuario autenticado.
- Criar a rota de inclusao de livro avulso.
- Criar a rota de edicao de livro avulso.
- Avaliar como direcao inicial as rotas `/biblioteca/livros`, `/biblioteca/livros/novo` e `/biblioteca/livros/:id`.
- Listar somente livros do usuario autenticado.
- Ordenar a lista de livros por inclusao, com cadastros mais recentes no inicio.
- Exibir na lista titulo, autor, data de inicio de leitura e data de conclusao.
- Abrir a edicao de um livro ao selecionar um item da lista.
- Manter header e botoes fixos no topo da tela de livros, com rolagem apenas da lista.
- Tratar o layout fixo e a experiencia da lista em fases UX assistidas com a skill designer.
- Permitir incluir livro informando titulo, autor e datas opcionais.
- Permitir selecionar autor ja cadastrado pelo usuario ou digitar um novo autor durante a inclusao do livro.
- Criar o novo autor junto com o livro quando o nome digitado ainda nao existir para o usuario.
- Manter autores privados por usuario, sem misturar autores de usuarios diferentes.
- Reutilizar autores do usuario em cadastros futuros de livros e series.
- Validar por codigo que nao exista outro livro avulso do mesmo usuario com o mesmo par titulo e autor.
- Permitir o mesmo titulo quando o autor for diferente.
- Exigir titulo e autor com ao menos dois caracteres na inclusao.
- Aceitar datas em branco ou completas.
- Validar que a data de inicio nao seja posterior a data de conclusao.
- Permitir, depois do cadastro, editar somente as datas do livro.
- Manter titulo e autor somente leitura na edicao.
- Permitir salvar alteracoes de datas com confirmacao e retorno para a lista.
- Alertar o usuario ao tentar voltar da edicao ou inclusao com alteracoes nao salvas.
- Permitir excluir livro com confirmacao contendo o titulo do livro, mensagem de exclusao e retorno para a lista.
- Criar componentes ou islands pequenos para data e selecao/criacao de autores quando isso for necessario para a experiencia.
- Usar modelos fornecidos pelo usuario para orientar os componentes de data e autor durante as fases UX.
- Comecar por fases UX com dados mockados, validacao assistida e rodadas com a skill designer antes da implementacao real.
- Implementar depois a persistencia local em libSQL, preservando a direcao futura de Turso.
- Associar livros e autores ao usuario autenticado.
- Manter autor obrigatorio na regra de negocio de livro avulso, mas permitir que a coluna ou referencia de autor seja opcional no banco para
  compatibilidade futura com livros de series.

## Fora do escopo

- Cadastro, organizacao ou edicao de series de livros.
- Livros pertencentes a series.
- Importacao de Kindle, Audible ou outras plataformas.
- Compartilhamento de livros, autores ou listas entre usuarios.
- Edicao de titulo ou autor depois do cadastro do livro.
- Estado de leitura separado das datas.
- Busca, filtros avancados ou paginacao na lista de livros, salvo se forem definidos em fase futura desta tarefa.
- Perfil de usuario ou alteracoes no fluxo de autenticacao.
- Integracao com Turso em producao.

## Expectativas de aceite

- A tela `/biblioteca` apresenta uma entrada clara para acessar livros.
- Um usuario autenticado acessa a lista de livros avulsos e ve somente seus proprios cadastros.
- A lista mostra titulo, autor, data de inicio e data de conclusao, ordenada com livros mais recentes primeiro.
- Header e botoes da tela de livros permanecem fixos no topo enquanto apenas a lista rola.
- Um usuario consegue incluir livro com titulo, autor e datas opcionais.
- O autor pode ser selecionado entre autores existentes do usuario ou criado durante a inclusao do livro.
- Autores e livros de outros usuarios nao aparecem nem interferem em listagens, selecoes ou validacoes.
- O sistema recusa, por validacao de codigo, duplicidade do mesmo par titulo e autor para o mesmo usuario.
- O mesmo titulo pode ser cadastrado para autores diferentes.
- Titulo e autor com menos de dois caracteres sao recusados.
- Datas incompletas ou incoerentes sao recusadas quando informadas.
- Depois do cadastro, a edicao permite alterar somente datas.
- Ao salvar inclusao ou edicao valida, o usuario recebe confirmacao e retorna para a lista.
- Ao tentar voltar com alteracoes nao salvas, o usuario recebe alerta de confirmacao.
- Ao excluir um livro, o usuario confirma a exclusao do livro correto, recebe confirmacao e retorna para a lista.
- A experiencia das telas e componentes e validada em fases UX assistidas antes da implementacao real.

## Conhecimento relacionado

- [Livro](../../conhecimento.md#livro): define os dados do livro no MVP, a edicao limitada as datas e a inferencia da situacao pelas datas.
- [Autor](../../conhecimento.md#autor): autores pertencem ao usuario e devem ser reutilizaveis em livros avulsos e series.
- [Privacidade](../../conhecimento.md#privacidade): livros, series e autores sao privados e isolados por usuario.
- [Imutabilidade dos cadastros](../../conhecimento.md#imutabilidade-dos-cadastros): depois do cadastro, somente datas podem ser alteradas.
- [Interface com Bulma](../../conhecimento.md#interface-com-bulma): a interface deve usar Bulma e componentes pequenos quando houver estado
  no cliente.
- [Rotas Fresh e handlers](../../conhecimento.md#rotas-fresh-e-handlers): paginas e handlers devem ficar nas rotas quando isso for
  suficiente.
- [Persistencia com libSQL e Turso](../../conhecimento.md#persistencia-com-libsql-e-turso): a persistencia inicial deve usar libSQL local.
- [Organizacao orientada a dominio](../../conhecimento.md#organizacao-orientada-a-dominio): regras de negocio devem ficar separadas de
  interface e persistencia, sem complexidade preventiva.
- [TF-002 - Componentes de mensagem e titulo](../002-componentes-mensagem-titulo/tarefa.md): fonte do popup de mensagem, titulo padrao,
  intencao de voltar e confirmacoes reutilizaveis.
- [TF-003 - Login e redefinicao de senha](../003-login-redefinicao-senha/tarefa.md): fonte do comportamento atual de autenticacao, sessao
  unica e acesso seguro a `/biblioteca`.

## Avaliacao arquitetural

Impacto permanente identificado: sim. A tarefa transforma livros avulsos e autores de escopo planejado em recurso do produto, define a
primeira persistencia do dominio de leitura e amplia a area segura `/biblioteca`. Tambem exige decisoes de modelo de dados para livros e
autores privados por usuario, mantendo autor obrigatorio no comportamento de livro avulso, mas opcional na estrutura do banco para acomodar
futuros livros de series.

Quando a entrega for validada, o conhecimento permanente devera ser atualizado para refletir a capacidade existente de gerenciar livros
avulsos, a forma consolidada das rotas, o modelo de dados adotado e os limites conhecidos para series.

## Decisoes pendentes

- Confirmar a estrutura final das rotas de livros avulsos.
- Definir o modelo de dados concreto para livros avulsos e autores, incluindo a referencia opcional de autor no banco.
- Definir a forma final do componente de data a partir do modelo que sera fornecido pelo usuario.
- Definir a forma final do componente de selecao/criacao de autor a partir do modelo que sera fornecido pelo usuario.
- Validar o layout reutilizavel `FixedHeaderPage` criado na F02 em telas futuras com topo fixo e rolagem da pagina.

## Plano

**Revisao:** 1 **Proxima acao:** Fechar TF-004 com a skill desenvolvedor

### Estrategia

Entregar primeiro a experiencia visual com dados mockados, para validar com o usuario a entrada pela biblioteca, a lista com topo fixo, o
fluxo de inclusao, os componentes de data e autor e a edicao/exclusao sem envolver persistencia real. Depois das telas UX aprovadas, as
fases comuns implementam o dominio, a persistencia local em libSQL e integram cada fluxo real em fatias verticais pequenas.

As rotas `/biblioteca/livros`, `/biblioteca/livros/novo` e `/biblioteca/livros/:id` serao usadas como direcao inicial e confirmadas durante
a execucao. A regra de livro avulso exige autor, mas o modelo persistente deve preservar a decisao de manter a referencia de autor opcional
no banco para acomodar livros de series futuramente. A verificacao completa da tarefa deve cobrir isolamento por usuario, duplicidade por
codigo, validacao das datas, comportamento visual em navegador e retorno correto para a lista.

## Controle de fases

| Fase | Estado    | Depende de    | Resumo                                                  | Arquivo                                                                                   |
| ---- | --------- | ------------- | ------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| F01  | Concluida | Nenhuma       | Entrada mockada de livros na biblioteca.                | [F01 - Entrada mockada livros biblioteca](fases/F01-entrada-mockada-livros-biblioteca.md) |
| F02  | Concluida | F01           | Lista mockada de livros com topo fixo e rolagem.        | [F02 - Lista mockada livros](fases/F02-lista-mockada-livros.md)                           |
| F03  | Concluida | F02           | Inclusao mockada com componentes de data e autor.       | [F03 - Inclusao mockada livro](fases/F03-inclusao-mockada-livro.md)                       |
| F04  | Concluida | F03           | Edicao e exclusao mockadas de livro.                    | [F04 - Edicao exclusao mockadas livro](fases/F04-edicao-exclusao-mockadas-livro.md)       |
| F05  | Concluida | F01, F04      | Dominio e persistencia de autores e livros avulsos.     | [F05 - Dominio persistencia livros](fases/F05-dominio-persistencia-livros.md)             |
| F06  | Concluida | F05           | Listagem real de livros e entrada pela biblioteca.      | [F06 - Listagem real livros](fases/F06-listagem-real-livros.md)                           |
| F07  | Concluida | F03, F05      | Inclusao real de livro com autor existente ou novo.     | [F07 - Inclusao real livro](fases/F07-inclusao-real-livro.md)                             |
| F08  | Concluida | F04, F05      | Edicao de datas e exclusao real de livro.               | [F08 - Edicao exclusao real livro](fases/F08-edicao-exclusao-real-livro.md)               |
| F09  | Concluida | F06, F07, F08 | Validacao integrada do gerenciamento de livros avulsos. | [F09 - Validacao integrada livros](fases/F09-validacao-integrada-livros.md)               |

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
