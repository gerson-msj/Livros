# F05 - Limpar erro do campo ao editar cadastro

**Tarefa:** [TF-001 - Cadastro de usuarios](../tarefa.md)

**Estado:** Concluida **Depende de:** F02

**Objetivo tecnico**

Melhorar a experiencia do formulario de cadastro para que o estado visual de erro de um campo seja limpo quando o usuario comeca a digitar
um novo valor naquele campo.

**Contexto necessario**

- [F02 - Cadastro na rota /cadastro com handlers proprios](F02-cadastro-rota-cadastro-handlers-proprios.md): formulario, validacao visual e
  mensagens de erro existentes.
- [Interface com Bulma](../../../conhecimento.md#interface-com-bulma): campos invalidos usam `is-danger`.

**Entrega esperada**

- Depois de uma tentativa invalida, as mensagens e classes de erro continuam aparecendo nos campos rejeitados.
- Ao usuario editar o nome de usuario, o erro visual e a mensagem do nome de usuario somem sem afetar o erro de senha.
- Ao usuario editar a senha, o erro visual e a mensagem da senha somem sem afetar o erro do nome de usuario.
- Erros gerais que nao pertencem a um campo permanecem visiveis ate nova submissao ou tratamento explicito.

**Criterios de conclusao**

- Campo invalido continua usando `is-danger` apos resposta invalida do cadastro.
- Iniciar digitacao em um campo invalido remove `is-danger` e a mensagem apenas daquele campo.
- Limpar o erro no cliente nao altera as regras de validacao do `POST /cadastro`.
- Comportamento relevante possui verificacao automatizada ou validacao manual registrada.
- A tela permanece utilizavel em desktop e mobile.

**Fora da fase**

- Alterar regras de validacao de nome de usuario ou senha.
- Alterar mensagens de erro retornadas pelo servidor.
- Alterar o fluxo de cadastro bem-sucedido ou a tela da chave.
- Implementar copia da chave de redefinicao.

**Evolucao**

- Planejada e liberada para desenvolvimento em 2026-06-17 apos retorno de validacao final do TF-001.
- Iniciada em 2026-06-17 em desenvolvimento conjunto com F06.
- Implementada com estado local de erros visiveis no formulario de cadastro.
- Verificacao focada concluida com testes automatizados, lint e check.
- Enviada para auditoria tecnica.
- Validada pelo usuario em 2026-06-18.
- Conclusao confirmada pela auditoria em 2026-06-18.

## Evidencias da F05

### Mapa de fluxo - F05

**Fluxo:** limpeza do erro visual durante edicao do cadastro. **Resultado produzido:** erro de um campo invalido some assim que o usuario
volta a digitar naquele campo, sem limpar erros de outros campos. **Exemplo acompanhado:** apos `abc` e `1234` serem rejeitados, o usuario
digita novamente no nome; o erro do nome some, mas o erro da senha continua ate a senha tambem ser editada. **Resumo:** o formulario guarda
uma copia local dos erros visiveis e remove apenas o erro do campo que recebeu nova entrada.

### 1. Receber erros do servidor

**Componente:** [Formulario de cadastro](../../../../islands/CadastroForm.tsx:16) - 🟡 **Modificado**

**Entra:** `errors.username` e/ou `errors.password` retornados pelo `POST /cadastro`. **Faz:** inicializa e sincroniza o estado local
`visibleErrors` com os erros recebidos. **Sai:** campos invalidos continuam marcados com `is-danger` apos a resposta invalida.

### 2. Editar nome de usuario invalido

**Componente:** [Entrada de nome de usuario](../../../../islands/CadastroForm.tsx:40) e
[clearFieldError](../../../../islands/CadastroForm.tsx:92) - 🟡 **Modificado**

**Entra:** digitacao no campo `username`. **Faz:** remove apenas `errors.username` da copia local de erros. **Sai:** o nome deixa de exibir
`is-danger` e mensagem, mantendo erros de senha ou gerais.

### 3. Editar senha invalida

**Componente:** [Entrada de senha](../../../../islands/CadastroForm.tsx:60) e [clearFieldError](../../../../islands/CadastroForm.tsx:92) -
🟡 **Modificado**

**Entra:** digitacao no campo `password`. **Faz:** remove apenas `errors.password` da copia local de erros. **Sai:** a senha deixa de exibir
`is-danger` e mensagem, mantendo erros de usuario ou gerais.

| Estacao | Componente       | Impacto       | Entra -> Sai                        |
| ------- | ---------------- | ------------- | ----------------------------------- |
| Erros   | `CadastroForm`   | 🟡 Modificado | Erros do servidor -> erros visiveis |
| Nome    | `username` input | 🟡 Modificado | Digitacao -> erro do nome removido  |
| Senha   | `password` input | 🟡 Modificado | Digitacao -> erro da senha removido |

Aspectos relevantes:

- A limpeza e apenas visual e local ao formulario; o `POST /cadastro` continua aplicando as mesmas regras de dominio.
- Erros gerais permanecem visiveis porque nao pertencem a um campo especifico.

## Verificacoes - F05

- `deno test -A islands\cadastro_interactions_test.ts routes\cadastro_test.ts`: testes de interacao e cadastro aprovados.
- `deno test -A islands\cadastro_interactions_test.ts routes\cadastro_test.ts routes\fluxo_cadastro_biblioteca_test.ts`: 7 testes aprovados.
- `deno lint` focado em islands de cadastro, rota e testes relacionados: aprovado.
- `deno check` focado em islands de cadastro, rota e testes relacionados: aprovado.

## Auditoria - F05

**Resultado:** Aprovada

### Achados

- Nenhum.

### Verificacoes

- Revisado `islands/CadastroForm.tsx`, confirmando que a limpeza de erro acontece apenas no campo editado.
- Revisado `islands/cadastro_interactions_test.ts`, confirmando cobertura para preservacao dos demais erros.
- Confirmado que o `POST /cadastro` e as regras de dominio nao foram alterados.
- `deno test -A islands\cadastro_interactions_test.ts routes\cadastro_test.ts routes\fluxo_cadastro_biblioteca_test.ts`: aprovado.
- `deno lint` e `deno check` focados em islands, rota e testes relacionados: aprovados.

### Mapa de fluxo

- Correto para a F05.

## Validacao humana - F05

**Resultado:** Aprovado **Retorno:** Tudo ok, pode finalizar tudo, realizar o commit e o push.

## Confirmacao de conclusao - F05

**Resultado:** Conclusao confirmada

### Verificacoes

- Auditoria tecnica aprovada sem achados.
- Validacao humana registrada como aprovada.
- Mapa, verificacoes e evolucao estao atualizados.
- Tabela de controle em `tarefa.md` sincronizada com o estado `Concluida`.
- Nenhuma falha conhecida relacionada a F05 permanece aberta.
