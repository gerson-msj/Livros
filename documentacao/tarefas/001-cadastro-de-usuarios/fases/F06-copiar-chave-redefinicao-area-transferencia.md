# F06 - Copiar chave de redefinicao para area de transferencia

**Tarefa:** [TF-001 - Cadastro de usuarios](../tarefa.md)

**Estado:** Concluida **Depende de:** F05

**Objetivo tecnico**

Adicionar ao painel de chave de redefinicao uma acao para copiar a chave UUID para a area de transferencia.

**Contexto necessario**

- [F02 - Cadastro na rota /cadastro com handlers proprios](F02-cadastro-rota-cadastro-handlers-proprios.md): exibicao da chave de
  redefinicao apos cadastro bem-sucedido.
- [Interface com Bulma](../../../conhecimento.md#interface-com-bulma): manter a interface simples e coerente com os controles existentes.

**Entrega esperada**

- A chave de redefinicao continua visivel em campo somente leitura apos cadastro bem-sucedido.
- O painel da chave possui botao claro para copiar a chave.
- Ao acionar o botao em ambiente com Clipboard API disponivel, a chave e enviada para a area de transferencia.
- A interface informa o sucesso da copia de forma discreta.
- Quando a copia automatica nao estiver disponivel ou falhar, a chave permanece acessivel para copia manual.

**Criterios de conclusao**

- Cadastro bem-sucedido continua apresentando uma chave UUID de redefinicao.
- Botao de copia envia a chave exibida para a area de transferencia quando suportado.
- Falha ou ausencia da Clipboard API nao impede o usuario de visualizar e copiar manualmente a chave.
- Comportamento relevante possui verificacao automatizada ou validacao manual registrada.
- A tela permanece utilizavel em desktop e mobile.

**Fora da fase**

- Alterar geracao, armazenamento ou formato da chave de redefinicao.
- Implementar redefinicao de senha.
- Alterar regras de sessao ou redirecionamento para `/biblioteca`.
- Alterar a limpeza de erros do formulario de cadastro.

**Evolucao**

- Planejada em 2026-06-17 apos retorno de validacao final do TF-001.
- Liberada em 2026-06-17 para desenvolvimento conjunto com F05 por aprovacao explicita do usuario.
- Iniciada em 2026-06-17 em desenvolvimento conjunto com F05.
- Implementada com island dedicada para o painel da chave e acao de copia via Clipboard API.
- Verificacao focada concluida com testes automatizados, lint e check.
- Enviada para auditoria tecnica.
- Validada pelo usuario em 2026-06-18.
- Conclusao confirmada pela auditoria em 2026-06-18.

## Evidencias da F06

### Mapa de fluxo - F06

**Fluxo:** copia da chave de redefinicao apos cadastro. **Resultado produzido:** o painel da chave passa a oferecer botao "Copiar chave"
antes da acao de seguir para `/biblioteca`. **Exemplo acompanhado:** depois do cadastro, a chave UUID exibida no campo somente leitura e
enviada para a area de transferencia ao acionar o botao. **Resumo:** a rota passa a renderizar uma island para o painel da chave; a island
usa a Clipboard API quando disponivel e mantem a chave visivel para copia manual quando nao for possivel copiar automaticamente.

### 1. Renderizar painel interativo da chave

**Componente:** [Rota de cadastro](../../../../routes/cadastro.tsx:92) e [ResetKeyPanel](../../../../islands/ResetKeyPanel.tsx:9) - 🟡
**Modificado** / 🟢 **Criado**

**Entra:** `resetKey` retornada pelo cadastro bem-sucedido. **Faz:** renderiza o campo somente leitura com a chave, o botao "Copiar chave" e
o link "Ir para biblioteca". **Sai:** usuario visualiza a chave e possui acao direta para copia.

### 2. Copiar para a area de transferencia

**Componente:** [Acao de copia](../../../../islands/ResetKeyPanel.tsx:12) e [copyResetKey](../../../../islands/ResetKeyPanel.tsx:58) - 🟢
**Criado**

**Entra:** clique no botao e chave UUID exibida. **Faz:** chama `navigator.clipboard.writeText(resetKey)` quando a Clipboard API esta
disponivel. **Sai:** estado `copied` e mensagem discreta "Chave copiada.".

### 3. Preservar copia manual em falha

**Componente:** [copyResetKey](../../../../islands/ResetKeyPanel.tsx:58) - 🟢 **Criado**

**Entra:** ambiente sem Clipboard API ou erro ao chamar `writeText`. **Faz:** retorna `unavailable` ou `failed` sem ocultar o campo da
chave. **Sai:** usuario recebe orientacao para copiar manualmente e a chave continua acessivel.

| Estacao | Componente        | Impacto   | Entra -> Sai                             |
| ------- | ----------------- | --------- | ---------------------------------------- |
| Painel  | `ResetKeyPanel`   | 🟢 Criado | Chave -> campo, copiar e seguir          |
| Copiar  | Clipboard API     | 🟢 Criado | Clique -> chave na area de transferencia |
| Falha   | Fallback de copia | 🟢 Criado | Sem suporte/falha -> copia manual        |

Aspectos relevantes:

- A F06 nao altera a geracao, o formato nem a persistencia da chave de redefinicao.
- A chave continua visivel em campo somente leitura, entao o usuario nao fica bloqueado se o navegador negar acesso ao clipboard.

## Verificacoes - F06

- `deno test -A islands\cadastro_interactions_test.ts routes\cadastro_test.ts`: testes de copia e cadastro aprovados.
- `deno test -A islands\cadastro_interactions_test.ts routes\cadastro_test.ts routes\fluxo_cadastro_biblioteca_test.ts`: 7 testes aprovados.
- `deno lint` focado em islands de cadastro, rota e testes relacionados: aprovado.
- `deno check` focado em islands de cadastro, rota e testes relacionados: aprovado.

## Auditoria - F06

**Resultado:** Aprovada

### Achados

- Nenhum.

### Verificacoes

- Revisado `routes/cadastro.tsx`, confirmando que o painel de chave passou a usar a island `ResetKeyPanel`.
- Revisado `islands/ResetKeyPanel.tsx`, confirmando botao de copia, uso da Clipboard API e fallback sem ocultar a chave.
- Revisado `islands/cadastro_interactions_test.ts`, confirmando cobertura para copia com sucesso, indisponibilidade e falha.
- Confirmado que geracao, formato, persistencia da chave e fluxo para `/biblioteca` nao foram alterados.
- `deno test -A islands\cadastro_interactions_test.ts routes\cadastro_test.ts routes\fluxo_cadastro_biblioteca_test.ts`: aprovado.
- `deno lint` e `deno check` focados em islands, rota e testes relacionados: aprovados.

### Mapa de fluxo

- Correto para a F06.

## Validacao humana - F06

**Resultado:** Aprovado **Retorno:** Tudo ok, pode finalizar tudo, realizar o commit e o push.

## Confirmacao de conclusao - F06

**Resultado:** Conclusao confirmada

### Verificacoes

- Auditoria tecnica aprovada sem achados.
- Validacao humana registrada como aprovada.
- Mapa, verificacoes e evolucao estao atualizados.
- Tabela de controle em `tarefa.md` sincronizada com o estado `Concluida`.
- Nenhuma falha conhecida relacionada a F06 permanece aberta.
