# F09 - Validacao integrada de livros

**Tarefa:** [TF-004 - Gerenciamento de livros avulsos](../tarefa.md)

**Estado:** Planejada
**Depende de:** F06, F07, F08
**Tipo de fase:** Comum

## Objetivo tecnico

Validar o gerenciamento de livros avulsos de ponta a ponta, ajustando inconsistencias de integracao, navegacao, estados visuais e cobertura
de regras antes do encerramento da tarefa.

## Contexto necessario

- [TF-004](../tarefa.md): expectativas de aceite completas da tarefa.
- [F06](F06-listagem-real-livros.md): listagem real e entrada pela biblioteca.
- [F07](F07-inclusao-real-livro.md): inclusao real.
- [F08](F08-edicao-exclusao-real-livro.md): edicao e exclusao reais.

## Entrega esperada

- Fluxo integrado validado em navegador.
- Verificacoes automatizadas completas para regras principais e rotas envolvidas.
- Ajustes finais de consistencia entre biblioteca, lista, inclusao, edicao e exclusao.
- Registro claro de qualquer limite conhecido que deva entrar no encerramento da tarefa.

## Criterios de conclusao

- Usuario consegue navegar da biblioteca para livros, incluir livro, voltar para a lista, editar datas, excluir livro e retornar a lista.
- Todos os fluxos preservam isolamento por usuario.
- Confirmacoes, alertas de alteracoes nao salvas e mensagens de erro aparecem nos pontos previstos.
- Layout aprovado nas fases UX permanece utilizavel em desktop e mobile.
- Verificacoes automatizadas relevantes passam.
- Nao ha pendencia conhecida que impeca o encerramento da TF-004.

## Fora da fase

- Novos recursos alem do escopo ja planejado.
- Consolidacao do conhecimento permanente.
- Encerramento formal da tarefa.
