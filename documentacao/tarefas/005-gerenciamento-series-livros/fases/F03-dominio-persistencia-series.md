# F03 - Dominio e persistencia de series

**Tarefa:** [T-005 - Gerenciamento de series de livros](../tarefa.md)

**Estado:** Planejada
**Depende de:** F01, F02
**Tipo de fase:** Comum

## Objetivo tecnico

Implementar o suporte de dominio e persistencia para series de livros, com autores reutilizaveis, livros ordenados e isolamento por usuario.

## Contexto necessario

- [Autor](../../../conhecimento.md#autor): autores pertencem ao usuario e podem ser reutilizados em livros avulsos e series.
- [Livro](../../../conhecimento.md#livro): datas opcionais e edicao posterior limitada as datas.
- [Serie](../../../conhecimento.md#serie): serie agrupa livros por nome, autor e ordem.
- [Privacidade](../../../conhecimento.md#privacidade): dados de livros, series e autores sao isolados por usuario.
- [Modelo de livros e autores](../../../conhecimento.md#modelo-de-livros-e-autores): livros de series usam associacao a serie e ordem, sem autor direto.
- [Organizacao orientada a dominio](../../../conhecimento.md#organizacao-orientada-a-dominio): regras devem ficar separadas de interface e persistencia.

## Entrega esperada

- Estrutura persistente para series associadas ao usuario e ao autor.
- Reaproveitamento da estrutura de livros para livros vinculados a series.
- Operacoes de dominio e persistencia para criar serie, listar series com livros ordenados, consultar serie propria, atualizar datas e excluir serie.
- Validacoes de nome, autor, ao menos um livro, datas e duplicidades.
- Verificacoes automatizadas adequadas para regras de negocio e isolamento por usuario.

## Criterios de conclusao

- Serie so pode ser criada com nome, autor e ao menos um livro com titulo.
- Series duplicadas para o mesmo autor e usuario sao recusadas.
- Livros duplicados dentro da mesma serie sao recusados.
- Livros de series recebem ordem crescente e nao armazenam autor direto.
- Datas opcionais seguem a regra confirmada para livros avulsos.
- Exclusao de serie remove ou torna inacessiveis seus livros vinculados conforme a persistencia definida.
- Operacoes respeitam isolamento por usuario.

## Cuidados de implementacao

- Fechar no inicio da fase as decisoes pendentes registradas na tarefa: normalizacao de duplicidade e regra de datas.
- Preservar compatibilidade com livros avulsos existentes ao reaproveitar a tabela de livros.
- Evitar criar complexidade preventiva alem do necessario para o MVP e para as rotas previstas.

## Fora da fase

- Telas reais de series.
- Integracao com handlers Fresh.
- Ajustes visuais alem do necessario para testes de dominio ou persistencia.
