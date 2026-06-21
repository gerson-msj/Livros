# F04 - Edicao e exclusao mockadas de livro

**Tarefa:** [TF-004 - Gerenciamento de livros avulsos](../tarefa.md)

**Estado:** Planejada
**Depende de:** F03
**Tipo de fase:** UX
**Executor:** designer

## Objetivo tecnico

Criar o fluxo mockado de edicao e exclusao de livro avulso, validando titulo e autor somente leitura, edicao de datas, confirmacoes e
retorno para a lista.

## Contexto necessario

- [Imutabilidade dos cadastros](../../../conhecimento.md#imutabilidade-dos-cadastros): depois do cadastro, somente datas podem ser
  alteradas.
- [TF-004](../tarefa.md): exclusao deve pedir confirmacao contendo o titulo do livro.
- [F03](F03-inclusao-mockada-livro.md): define componentes e padroes do formulario mockado.

## Entrega esperada

- Tela mockada de edicao com titulo e autor somente leitura.
- Datas editaveis com o mesmo padrao validado no fluxo de inclusao.
- Simulacao de salvar, excluir, voltar sem alteracoes e voltar com alteracoes nao salvas.
- Confirmacao de exclusao mencionando o livro correto.

## Criterios de conclusao

- Usuario valida em navegador que titulo e autor parecem claramente nao editaveis.
- Alterar datas simula salvamento com confirmacao e retorno para a lista.
- Datas incoerentes simulam erro antes do salvamento.
- Excluir simula confirmacao, mensagem de sucesso e retorno para a lista.
- Voltar com alteracoes nao salvas simula pedido de confirmacao.

## Fora da fase

- Exclusao real no banco.
- Atualizacao real de datas.
- Mudanca de titulo ou autor depois do cadastro.
