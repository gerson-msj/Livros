# F03 - Inclusao mockada de livro

**Tarefa:** [TF-004 - Gerenciamento de livros avulsos](../tarefa.md)

**Estado:** Planejada
**Depende de:** F02
**Tipo de fase:** UX
**Executor:** designer

## Objetivo tecnico

Criar o fluxo mockado de inclusao de livro avulso, validando formulario, componente de data, componente de selecao/criacao de autor,
confirmacoes e alerta de volta com alteracoes nao salvas.

## Contexto necessario

- [Autor](../../../conhecimento.md#autor): autores pertencem ao usuario e podem ser reutilizados em livros avulsos e series.
- [Livro](../../../conhecimento.md#livro): datas sao opcionais e somente datas podem ser alteradas depois do cadastro.
- [TF-004](../tarefa.md): usuario fornecera modelos de componente de data e autor durante as fases UX.
- [F02](F02-lista-mockada-livros.md): define a lista para onde o fluxo deve retornar.

## Entrega esperada

- Tela mockada de inclusao com campos de titulo, autor, data de inicio e data de conclusao.
- Componente mockado de data validado visualmente com o modelo fornecido pelo usuario.
- Componente mockado de autor com lista de autores existentes, filtro e criacao de novo nome.
- Mensagens ou estados simulados para salvamento, erro de validacao e retorno com alteracoes nao salvas.

## Criterios de conclusao

- Usuario valida em navegador a usabilidade do componente de data.
- Usuario valida em navegador a usabilidade do componente de selecao/criacao de autor.
- O fluxo simula salvamento com confirmacao e retorno para a lista.
- O fluxo simula recusas para titulo ou autor curto, datas incompletas, datas incoerentes e duplicidade de titulo/autor.
- Ao tentar voltar com alteracoes nao salvas, a interface simula pedido de confirmacao.

## Fora da fase

- Criacao real de autores ou livros.
- Consulta real de autores do usuario.
- Regras persistentes de duplicidade.
