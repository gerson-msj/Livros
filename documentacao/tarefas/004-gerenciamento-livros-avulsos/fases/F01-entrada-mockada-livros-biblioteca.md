# F01 - Entrada mockada de livros na biblioteca

**Tarefa:** [TF-004 - Gerenciamento de livros avulsos](../tarefa.md)

**Estado:** Planejada
**Depende de:** Nenhuma
**Tipo de fase:** UX
**Executor:** designer

## Objetivo tecnico

Criar a experiencia visual inicial da biblioteca com uma entrada para livros, deixando claro como o usuario acessa o gerenciamento de
livros avulsos e como a futura entrada de series podera coexistir sem ser implementada agora.

## Contexto necessario

- [Estado atual](../../../conhecimento.md#estado-atual): `/biblioteca` existe como area segura minima com opcao de saida.
- [Interface com Bulma](../../../conhecimento.md#interface-com-bulma): a interface deve manter Bulma, titulo padrao e popup reutilizavel
  quando aplicavel.
- [TF-004](../tarefa.md): a biblioteca deve oferecer um botao para entrada nos livros e prever botao futuro de series.

## Entrega esperada

- Tela da biblioteca renderizavel com dados ou acoes mockadas para acessar livros.
- Entrada de livros visualmente clara e compativel com uma futura entrada de series.
- Navegacao simulada para a tela mockada de lista de livros.

## Criterios de conclusao

- Usuario valida em navegador a organizacao visual da biblioteca.
- A entrada de livros e facil de identificar em desktop e mobile.
- A presenca futura de series fica acomodada sem implementar fluxo de series.
- Fica claro para a fase comum posterior quais elementos visuais devem ser integrados ao comportamento real.

## Fora da fase

- Persistencia, regras de dominio e handlers reais de livros.
- Implementacao de series.
- Alteracao real do modelo de dados.
