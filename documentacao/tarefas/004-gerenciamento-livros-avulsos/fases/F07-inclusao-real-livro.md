# F07 - Inclusao real de livro

**Tarefa:** [TF-004 - Gerenciamento de livros avulsos](../tarefa.md)

**Estado:** Planejada
**Depende de:** F03, F05
**Tipo de fase:** Comum

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
