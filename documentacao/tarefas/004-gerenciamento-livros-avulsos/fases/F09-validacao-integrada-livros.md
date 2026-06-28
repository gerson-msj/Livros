# F09 - Validacao integrada de livros

**Tarefa:** [TF-004 - Gerenciamento de livros avulsos](../tarefa.md)

**Estado:** Concluida **Depende de:** F06, F07, F08 **Tipo de fase:** Comum

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

## Resultado

- Adicionado teste integrado `routes/fluxo_livros_avulsos_test.ts` cobrindo cadastro com sessao, entrada pela biblioteca, lista vazia,
  inclusao real de livro com autor novo, recusa de duplicidade, mesmo titulo com autor diferente, reutilizacao de autores, edicao de datas,
  recusa de datas incoerentes, isolamento entre usuarios, bloqueio de edicao/exclusao de livro alheio, exclusao real e retorno da lista.
- Validado em navegador com banco temporario na porta `5181`: cadastro de usuario, entrada em `/biblioteca`, acesso a `/biblioteca/livros`,
  estado vazio, inclusao de `Duna`, popup de sucesso, retorno para lista, edicao de datas, alerta de alteracoes nao salvas, popup de
  salvamento, exclusao com confirmacao contendo o titulo do livro, popup de exclusao e retorno ao estado vazio.
- Validado em viewport mobile `390x844`: lista vazia, inclusao, lista com livro e edicao sem overflow horizontal observado (`scrollWidth`
  igual a `clientWidth`) e com acoes principais disponiveis.
- Verificacoes realizadas: `deno test -A routes\fluxo_livros_avulsos_test.ts`, `deno test -A`, `deno lint .`, `deno check` e
  `deno task build`.
- Testes unitarios temporarios: nao criados.
- Riscos, limitacoes ou pendencias: nenhuma pendencia conhecida que impeca o encerramento da TF-004.
- Validacao dos fontes: aprovada pelo usuario em 2026-06-23.
