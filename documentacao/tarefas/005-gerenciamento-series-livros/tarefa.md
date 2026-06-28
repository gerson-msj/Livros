# T-005 - Gerenciamento de series de livros

**Estado:** Concluida

**Tipo:** Nova capacidade

## Resumo

O produto ja permite gerenciar livros avulsos, mas ainda nao entrega o recurso central de organizar livros pertencentes a series.

O objetivo e permitir que o usuario autenticado cadastre, visualize, edite datas e exclua series de livros, mantendo autores reutilizaveis,
livros ordenados e isolamento por usuario.

O resultado esperado e que, na area segura, o usuario consiga acessar series pela biblioteca, ver uma lista de series, criar uma serie com
autor e ao menos um livro, abrir uma serie existente para alterar somente datas dos livros e excluir a serie completa apos confirmacao.

## Escopo

- Entrada de series na biblioteca deixando de ser apenas recurso futuro.
- Listagem de series por cadastro mais recente, com nome, autor e sublista de livros em ordem crescente.
- Tela de inclusao de serie com nome, autor existente ou novo, e sublista de livros.
- Adicao incremental de livros na nova serie, com ordem oculta ao usuario.
- Bloqueio para adicionar varios livros em branco.
- Remocao apenas do ultimo livro durante a inclusao, com confirmacao.
- Tela de edicao permitindo alterar somente datas dos livros da serie.
- Exclusao completa da serie e seus livros vinculados, com confirmacao explicita.
- Validacoes de nome, autor, ao menos um livro, datas e duplicidades.
- Persistencia em libSQL reaproveitando a estrutura de livros ja planejada.
- Fases UX para fluxo, layout, estados de erro, confirmacoes e consistencia visual com Bulma.

## Fora do escopo

- Reordenar livros de uma serie depois do cadastro.
- Adicionar ou remover livros na edicao de serie.
- Editar nome da serie, autor ou titulos de livros depois do cadastro.
- Relacionar livros avulsos existentes a uma serie.
- Compartilhamento entre usuarios.
- Busca, filtros avancados, capas, notas, avaliacoes ou integracao com Amazon, Kindle ou Audible.

## Expectativas de aceite

- A biblioteca oferece acesso ao gerenciamento de series como recurso disponivel.
- O usuario autenticado ve somente suas proprias series, ordenadas da mais recente para a mais antiga.
- Cada serie listada mostra nome, autor e livros vinculados na ordem correta.
- O usuario consegue cadastrar uma serie com nome, autor existente ou novo e ao menos um livro com titulo.
- Durante a inclusao, novos livros recebem ordem automaticamente e a interface impede multiplos livros em branco.
- Durante a inclusao, apenas o ultimo livro adicionado pode ser removido e a remocao exige confirmacao.
- Depois do cadastro, o usuario consegue alterar somente as datas dos livros da serie.
- O usuario consegue excluir uma serie inteira, com seus livros vinculados, apos confirmacao explicita.
- O sistema recusa series duplicadas para o mesmo autor e livros duplicados dentro da mesma serie.
- As telas de series mantem experiencia visual coerente com livros avulsos e com os componentes existentes.

## Conhecimento relacionado

- [Visao](../../conhecimento.md#visao): series fazem parte do problema central do produto.
- [Serie](../../conhecimento.md#serie): descreve o agrupamento de livros relacionados e as restricoes planejadas.
- [Livro](../../conhecimento.md#livro): define datas opcionais, imutabilidade parcial e diferenca entre livros avulsos e livros de series.
- [Autor](../../conhecimento.md#autor): autores pertencem ao usuario e devem ser reutilizaveis em livros avulsos e series.
- [Privacidade](../../conhecimento.md#privacidade): dados de livros, series e autores sao isolados por usuario.
- [Imutabilidade dos cadastros](../../conhecimento.md#imutabilidade-dos-cadastros): depois do cadastro, somente datas devem ser editaveis.
- [Modelo de livros e autores](../../conhecimento.md#modelo-de-livros-e-autores): livros de series devem reaproveitar a tabela de livros com
  associacao a serie e ordem.
- [Interface com Bulma](../../conhecimento.md#interface-com-bulma): a interface deve manter Bulma e componentes reutilizaveis existentes.
- [Rotas Fresh e handlers](../../conhecimento.md#rotas-fresh-e-handlers): paginas e handlers de rota devem ser preferidos quando
  suficientes.
- [Organizacao orientada a dominio](../../conhecimento.md#organizacao-orientada-a-dominio): regras de negocio devem ficar separadas de
  detalhes de interface e persistencia.

## Avaliacao arquitetural

Impacto permanente identificado: sim.

A tarefa afeta o dominio de Serie, o dominio de Livro, recursos existentes e decisoes sobre persistencia libSQL, imutabilidade dos
cadastros, privacidade e organizacao orientada a dominio. Depois da entrega validada, o conhecimento permanente devera ser consolidado para
registrar series como recurso existente e as regras efetivamente implementadas.

## Decisoes pendentes

Nenhuma. Na F03, a duplicidade de series e de livros da serie passou a usar a mesma normalizacao ja aplicada aos livros avulsos. As datas de
livros de serie passaram a seguir a mesma regra de livros avulsos: opcionais e com inicio nao posterior a conclusao.

Durante a validacao dos fontes, foi confirmado que a tabela `books` permanece compartilhada entre livros avulsos e livros de series, mas as
camadas de dominio, servico e repositorio devem ficar separadas entre autores, livros avulsos e series. Autores podem ser dependencia de
livros e series; series tambem podem depender de conceitos de livro, sem concentrar regras de series no servico de livros.

## Plano

**Revisao:** 1 **Proxima acao:** Tarefa concluida.

### Estrategia

Comecar pelas fases UX para validar, com dados mockados, a entrada de series, a listagem, o cadastro com livros incrementais e a edicao de
datas. Essas fases devem produzir artefatos visuais reutilizaveis, com mocks isolados para serem removidos ou substituidos depois.

As fases comuns devem preservar o comportamento visual e interativo validado, substituindo os mocks por dominio, persistencia libSQL e
handlers reais. A entrega deve manter o MVP simples, reaproveitar autores e livros conforme as decisoes existentes e verificar isolamento
por usuario, duplicidades, datas opcionais e exclusao em cascata.

As decisoes pendentes sobre normalizacao e datas devem ser fechadas durante a primeira fase comum antes de consolidar as regras no dominio.

## Controle de fases

| Fase | Estado    | Depende de | Resumo                                                                     | Arquivo                                                                                               |
| ---- | --------- | ---------- | -------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| F01  | Concluida | Nenhuma    | Criar experiencia mockada da listagem e entrada de series na biblioteca    | [F01 - Experiencia mockada de listagem de series](fases/F01-experiencia-mockada-listagem-series.md)   |
| F02  | Concluida | F01        | Criar experiencia mockada de inclusao, edicao de datas e exclusao de serie | [F02 - Experiencia mockada de formulario de serie](fases/F02-experiencia-mockada-formulario-serie.md) |
| F03  | Concluida | F01, F02   | Implementar dominio e persistencia de series com livros ordenados          | [F03 - Dominio e persistencia de series](fases/F03-dominio-persistencia-series.md)                    |
| F04  | Concluida | F03        | Integrar biblioteca, listagem e inclusao de series com dados reais         | [F04 - Listagem e inclusao reais de series](fases/F04-listagem-inclusao-reais-series.md)              |
| F05  | Concluida | F04        | Integrar edicao de datas e exclusao real de series                         | [F05 - Edicao e exclusao reais de series](fases/F05-edicao-exclusao-reais-series.md)                  |

## Resumo final da tarefa

### Fonte da verdade

O gerenciamento de series de livros foi implementado e validado. A biblioteca oferece acesso a `/biblioteca/series`, onde o usuario
autenticado lista somente suas series, cria series com autor existente ou novo e livros ordenados, edita somente datas dos livros vinculados
e exclui a serie completa apos confirmacao.

### Referencias

- [F01 - Experiencia mockada de listagem de series](fases/F01-experiencia-mockada-listagem-series.md): entrada e listagem validadas com
  dados mockados.
- [F02 - Experiencia mockada de formulario de serie](fases/F02-experiencia-mockada-formulario-serie.md): inclusao, edicao, exclusao e
  confirmacoes validadas com dados mockados.
- [F03 - Dominio e persistencia de series](fases/F03-dominio-persistencia-series.md): dominio, service, repositorio libSQL, validacoes,
  isolamento por usuario e exclusao da serie com livros vinculados.
- [F04 - Listagem e inclusao reais de series](fases/F04-listagem-inclusao-reais-series.md): listagem e cadastro reais integrados a autores e
  series persistidos.
- [F05 - Edicao e exclusao reais de series](fases/F05-edicao-exclusao-reais-series.md): edicao real de datas e exclusao real de series.

### Regras de negocio implementadas

- Series exigem nome, autor e ao menos um livro com titulo.
- Series duplicadas para o mesmo usuario e autor sao recusadas com normalizacao por codigo.
- Livros duplicados dentro da mesma serie sao recusados com a mesma normalizacao.
- Livros da serie recebem ordem crescente automaticamente no cadastro.
- Depois do cadastro, somente datas dos livros da serie podem ser alteradas.
- Datas sao opcionais; quando informadas, a data de inicio nao pode ser posterior a conclusao.
- Series, livros e autores permanecem isolados por usuario.

### Decisoes tecnicas importantes

- Autores foram separados em dominio, service e repositorio proprios para serem reutilizados por livros avulsos e series.
- Series usam tabela `series`; livros vinculados a series continuam na tabela `books` com `series_id` e `series_order`, sem autor direto.
- A area segura `/biblioteca` passou a usar middleware aninhado para centralizar a validacao da sessao e expor a sessao autenticada em
  `ctx.state`.

### Limites conhecidos

- O MVP nao permite reordenar livros, adicionar ou remover livros de uma serie existente, editar nome da serie, autor ou titulos depois do
  cadastro.
- O ambiente local de producao ainda exige a dependencia nativa opcional do libSQL para subir o servidor gerado no Windows.

## Validacao final da tarefa

**Resultado:** Aprovado **Retorno:** Usuario informou que esta tudo ok com a tarefa 5 e autorizou finalizar.
