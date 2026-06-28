# F07 - Inclusao real de livro

**Tarefa:** [TF-004 - Gerenciamento de livros avulsos](../tarefa.md)

**Estado:** Concluida **Depende de:** F03, F05 **Tipo de fase:** Comum

## Objetivo tecnico

Implementar a inclusao real de livro avulso com autor existente ou novo, validacoes de formulario, confirmacao de sucesso e retorno para a
lista.

## Contexto necessario

- [Autor](../../../conhecimento.md#autor): autores sao privados por usuario e podem ser reutilizados.
- [Livro](../../../conhecimento.md#livro): datas sao opcionais e titulo/autor definem o cadastro inicial.
- [F03](F03-inclusao-mockada-livro.md): experiencia UX validada para formulario, datas e autor.
- [F05](F05-dominio-persistencia-livros.md): regras e persistencia de autores e livros.

## Entrega esperada

- Rota real de inclusao de livro avulso.
- Carregamento de autores existentes do usuario para o componente de autor.
- Criacao de autor novo junto com o livro quando necessario.
- Validacao real de titulo, autor, datas e duplicidade.
- Confirmacao de sucesso e retorno para a lista.
- Alerta ao tentar voltar com alteracoes nao salvas.

## Criterios de conclusao

- Usuario consegue cadastrar livro com autor existente.
- Usuario consegue cadastrar livro com autor novo, que passa a estar disponivel para proximos cadastros.
- Autor de outro usuario nao aparece na selecao.
- Dados invalidos exibem mensagem adequada sem criar livro.
- Duplicidade por titulo e autor no mesmo usuario e recusada por codigo.
- Apos salvar livro valido, usuario recebe confirmacao e volta para a lista.

## Fora da fase

- Edicao de livro ja cadastrado.
- Exclusao de livro.
- Cadastro de series.

## Resultado

- Rota `/biblioteca/livros/novo` substituida pela inclusao real protegida por sessao, carregando autores do usuario autenticado no `GET` e
  criando livro avulso no `POST`.
- Criado `BookCreateForm` com dados reais, reaproveitando a experiencia visual validada para titulo, autor, datas opcionais, previa,
  confirmacao de sucesso e alerta de volta com alteracoes nao salvas.
- Criados componentes neutros `AuthorPicker` e `BookDateInput` para substituir os componentes mockados no fluxo real de inclusao.
- O salvamento usa `BooksService.createStandaloneBook`, criando autor novo quando necessario, reutilizando autor existente pelo dominio e
  propagando validacoes reais de titulo, autor, datas e duplicidade para mensagem em tela.
- Adicionados testes de rota para visitante sem sessao, carregamento de autores do usuario autenticado, criacao real de livro, erro de
  validacao e duplicidade.
- Ajustado `vite.config.ts` para ignorar tambem `livros.db` e arquivos auxiliares do SQLite/libSQL em minusculas, evitando recarga do Vite
  durante o salvamento local e preservando o popup de sucesso.
- Verificacoes realizadas: `deno fmt --check` nos arquivos tocados, `deno test -A routes\biblioteca_livros_novo_test.ts`, `deno test -A`,
  `deno lint .`, `deno check`, `deno task build` e validacao em navegador de inclusao com autor novo, popup de sucesso e retorno para a
  lista.
- Testes unitarios temporarios: nao criados.
- Riscos, limitacoes ou pendencias: a edicao e exclusao reais permanecem fora desta fase e continuam planejadas para F08.
- Validacao dos fontes: aprovada pelo usuario em 2026-06-23.
