# F05 - Dominio e persistencia de livros

**Tarefa:** [TF-004 - Gerenciamento de livros avulsos](../tarefa.md)

**Estado:** Concluida **Depende de:** F01, F04 **Tipo de fase:** Comum

## Objetivo tecnico

Criar a base de dominio e persistencia local para autores e livros avulsos privados por usuario, permitindo que os fluxos reais consultem,
criem, validem, atualizem datas e excluam registros.

## Contexto necessario

- [Autor](../../../conhecimento.md#autor): autores pertencem ao usuario e podem ser reutilizados.
- [Livro](../../../conhecimento.md#livro): livro avulso possui titulo, autor e datas opcionais.
- [Privacidade](../../../conhecimento.md#privacidade): livros e autores nao sao compartilhados entre usuarios.
- [Persistencia com libSQL e Turso](../../../conhecimento.md#persistencia-com-libsql-e-turso): persistencia inicial deve usar libSQL local.
- [Organizacao orientada a dominio](../../../conhecimento.md#organizacao-orientada-a-dominio): regras de negocio devem ficar separadas de
  interface e persistencia.
- [Composicao e injecao de dependencias](../../../conhecimento.md#composicao-e-injecao-de-dependencias): usar o provider por request ja
  adotado quando houver novas dependencias.

## Entrega esperada

- Modelo persistente local para autores e livros avulsos associados ao usuario.
- Operacoes necessarias para listar livros, consultar livro por usuario, criar autor quando necessario, criar livro, atualizar datas e
  excluir livro.
- Validacoes de dominio para titulo, autor, datas e duplicidade por par titulo/autor dentro do mesmo usuario.
- Verificacao automatizada adequada para regras e persistencia.

## Criterios de conclusao

- Autor e livro ficam associados ao usuario autenticado.
- Usuario nao consegue consultar, alterar ou excluir livro de outro usuario.
- Usuario nao consegue ver autores de outro usuario.
- O mesmo usuario nao consegue cadastrar dois livros avulsos com o mesmo par titulo e autor.
- O mesmo titulo e aceito para autores diferentes.
- Datas em branco sao aceitas e data de inicio posterior a data de conclusao e recusada.
- A referencia de autor no banco permanece compativel com a necessidade futura de ser opcional para livros de series.

## Cuidados de implementacao

- A obrigatoriedade de autor e regra de negocio do livro avulso; nao transformar isso em uma restricao que bloqueie o modelo futuro de
  livros de series.
- Validar duplicidade por codigo, considerando o escopo do usuario.
- Preservar o MVP simples e evitar modelagem de series nesta fase.

## Fora da fase

- Telas reais de listagem, inclusao, edicao ou exclusao.
- Cadastro ou comportamento de series.
- Integracao com Turso remoto.

## Resultado

- Criado dominio de livros avulsos com normalizacao de titulo/autor, validacao de tamanho minimo, datas opcionais completas e bloqueio de
  data de inicio posterior a data de conclusao.
- Criado `BooksService` com operacoes para listar autores, listar livros avulsos, consultar livro por usuario, criar autor quando
  necessario, criar livro, atualizar somente datas e excluir livro.
- Criados reposititorios libSQL para autores e livros avulsos, associados ao usuario e com consultas, atualizacoes e exclusoes sempre
  escopadas por `user_id`.
- Adicionadas tabelas `authors` e `books`; `books` e uma tabela unica para livros avulsos e futuros livros de serie.
- Um livro avulso e representado por `author_id` preenchido, `series_id` vazio e `series_order` vazia.
- Um futuro livro de serie devera ser representado por `series_id` e `series_order` preenchidos, `author_id` vazio, herdando o autor da
  serie.
- A referencia de autor permanece opcional no banco para compatibilidade com livros de series, enquanto o servico mantem autor obrigatorio
  para livro avulso.
- A duplicidade do par titulo/autor e validada por codigo no escopo do usuario; o mesmo titulo e aceito com autor diferente e o mesmo par e
  aceito para outro usuario.
- Provider por request passou a expor `books`, reutilizando o cliente libSQL, gerador de UUID e relogio ja usados na composicao existente.
- Verificacoes realizadas: `deno fmt --check` nos arquivos tocados, `deno lint` nos arquivos tocados, `deno check` nos arquivos tocados,
  `deno test -A aplicacao\livros_service_test.ts`, `deno test -A`, `deno lint .` e `deno check`.
- `deno task check` nao concluiu porque o `deno fmt --check .` encontrou formatacao preexistente fora do escopo da fase, incluindo arquivos
  base e assets; nenhuma alteracao ampla de formatacao foi aplicada para evitar misturar escopos.
- Ajuste solicitado na validacao dos fontes: substituida a tabela especifica `standalone_books` pela tabela unica `books`, com classificacao
  derivada de `author_id`, `series_id` e `series_order`.
