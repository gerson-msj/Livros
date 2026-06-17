# T06 - Copiar chave de redefinicao para area de transferencia

**Trabalho:** [TR-001 - Cadastro de usuarios](../trabalho.md)

**Estado:** Planejada **Depende de:** T05

**Objetivo tecnico**

Adicionar ao painel de chave de redefinicao uma acao para copiar a chave UUID para a area de transferencia.

**Contexto necessario**

- [T02 - Cadastro na rota /cadastro com handlers proprios](T02-cadastro-rota-cadastro-handlers-proprios.md): exibicao da chave de
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

**Fora da tarefa**

- Alterar geracao, armazenamento ou formato da chave de redefinicao.
- Implementar redefinicao de senha.
- Alterar regras de sessao ou redirecionamento para `/biblioteca`.
- Alterar a limpeza de erros do formulario de cadastro.

**Evolucao**

- Planejada em 2026-06-17 apos retorno de validacao final do TR-001; aguarda conclusao da T05.
