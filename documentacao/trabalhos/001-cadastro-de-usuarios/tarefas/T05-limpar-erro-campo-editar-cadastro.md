# T05 - Limpar erro do campo ao editar cadastro

**Trabalho:** [TR-001 - Cadastro de usuarios](../trabalho.md)

**Estado:** Pronta **Depende de:** T02

**Objetivo tecnico**

Melhorar a experiencia do formulario de cadastro para que o estado visual de erro de um campo seja limpo quando o usuario comeca a digitar
um novo valor naquele campo.

**Contexto necessario**

- [T02 - Cadastro na rota /cadastro com handlers proprios](T02-cadastro-rota-cadastro-handlers-proprios.md): formulario, validacao visual e
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

**Fora da tarefa**

- Alterar regras de validacao de nome de usuario ou senha.
- Alterar mensagens de erro retornadas pelo servidor.
- Alterar o fluxo de cadastro bem-sucedido ou a tela da chave.
- Implementar copia da chave de redefinicao.

**Evolucao**

- Planejada e liberada para desenvolvimento em 2026-06-17 apos retorno de validacao final do TR-001.
