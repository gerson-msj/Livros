# TR-001 - Cadastro de usuarios

**Estado:** Em desenvolvimento **Tipo:** Nova capacidade

## Resumo

O projeto precisa permitir que qualquer usuario crie uma conta inicial e entre diretamente na area segura. O trabalho deve entregar a rota
`/cadastro`, criar a sessao inicial apos cadastro bem-sucedido, apresentar a chave de redefinicao de senha e proteger a rota `/biblioteca`.

## Escopo

- Criar a tela `/cadastro` com nome de usuario e senha.
- Permitir visualizar a senha digitada, sem caixa de confirmacao.
- Validar nome de usuario e senha com minimo de 5 caracteres apos remover espacos ao redor.
- Armazenar o nome de usuario em letras minusculas.
- Usar `is-danger` do Bulma quando o valor de um campo estiver invalido.
- Gerar chave de redefinicao de senha em formato UUID.
- Apresentar a chave de redefinicao ao usuario apos cadastro bem-sucedido.
- Criptografar senha e chave de redefinicao no banco.
- Criar uma sessao imediatamente apos cadastro bem-sucedido usando cookie HTTP.
- Registrar a sessao no banco com validade de uma semana.
- Encaminhar o usuario para `/biblioteca` depois que ele visualizar a chave.
- Proteger `/biblioteca`, redirecionando visitantes sem sessao para `/cadastro`.
- Redirecionar usuarios ja logados de `/cadastro` para `/biblioteca`.
- Criar `/biblioteca` como area segura contendo somente a opcao de saida.
- Permitir sair da sessao a partir da biblioteca.
- Garantir funcionamento da tela em desktop e mobile.

## Fora do escopo

- Login separado.
- Redefinicao de senha usando a chave gerada.
- Cadastro, edicao ou listagem de livros, autores e series.
- Perfil de usuario ou edicao de conta.
- Confirmacao de senha no cadastro.

## Expectativas de aceite

- Um visitante consegue se cadastrar em `/cadastro` informando nome de usuario e senha validos.
- Apos cadastro bem-sucedido, o usuario visualiza uma chave UUID de redefinicao de senha.
- Depois de visualizar a chave, o usuario e levado para `/biblioteca` ja logado.
- Uma sessao valida permite acessar `/biblioteca`.
- Acesso direto a `/biblioteca` sem sessao redireciona para `/cadastro`.
- Acesso a `/cadastro` com sessao valida redireciona para `/biblioteca`.
- A biblioteca permite sair da sessao.
- Senha e chave de redefinicao nao ficam armazenadas em texto puro no banco.
- Nome de usuario e senha com menos de 5 caracteres sao recusados depois de remover espacos ao redor.
- O nome de usuario fica armazenado em letras minusculas.
- Campos invalidos sao indicados visualmente com `is-danger`.
- A interface permanece utilizavel em desktop e mobile.

## Conhecimento relacionado

- [Usuario](../../conhecimento.md#usuario): cadastro, chave de redefinicao e entrada direta na area segura ja fazem parte do dominio
  planejado.
- [Autenticacao e redefinicao de senha](../../conhecimento.md#autenticacao-e-redefinicao-de-senha): o trabalho concretiza a primeira parte
  da autenticacao sem email.
- [Persistencia com libSQL e Turso](../../conhecimento.md#persistencia-com-libsql-e-turso): sessoes e credenciais exigem persistencia local
  inicial.
- [Interface com Bulma](../../conhecimento.md#interface-com-bulma): a tela deve usar os recursos visuais ja escolhidos para o projeto.

## Avaliacao arquitetural

Impacto permanente identificado: sim. O trabalho transforma parte do dominio de usuario e autenticacao planejados em recurso existente,
introduz persistencia de usuarios e sessoes e define detalhes tecnicos de seguranca para senha, chave de redefinicao e cookie de sessao.

Quando a entrega for validada, o conhecimento permanente devera ser atualizado para diferenciar os recursos implementados dos recursos ainda
planejados.

## Decisoes pendentes

Nenhuma.

## Plano

**Revisao:** 4 **Proxima tarefa:** Aguardando checkpoint da T03

### Estrategia

Entregar o cadastro em fatias verticais, mantendo todas as tarefas restantes visiveis para validacao humana antes de liberar o proximo
desenvolvimento. A execucao continuara faseada: cada tarefa sera desenvolvida, auditada e validada separadamente.

A implementacao deve seguir DDD de forma pragmatica, separando regras de usuario e sessao dos detalhes de Fresh, cookies e banco. As rotas
Fresh devem preferir pagina e handlers proprios: `/cadastro` usando `GET` e `POST` da propria rota, e `/biblioteca` fazendo o mesmo para
acesso seguro e saida.

O banco local sera `Livros.db`, com libSQL como direcao da aplicacao. O `sqlite3.exe` disponivel no diretorio do projeto pode ser usado como
apoio de verificacao direta da base, sem virar dependencia da aplicacao. O Vite deve ignorar alteracoes em `Livros.db` para evitar refresh
durante o desenvolvimento.

Ao final das tarefas funcionais, a verificacao integrada deve consolidar um mapa de fluxo completo do cadastro ate a saida da area segura.

### Historico do plano

- 2026-06-17: T03 e T04 validadas pelo usuario; T03 liberada e iniciada para desenvolvimento.
- 2026-06-17: Revisao 3 adapta o TR-001 ao formato com `trabalho.md` central e arquivos proprios por tarefa.
- 2026-06-16: Revisao 2 reorganiza o plano para manter T02, T03 e T04 escritas em bloco antes da validacao e registra que o mapa completo
  sera consolidado ao final do trabalho.
- 2026-06-16: Plano restante aprovado pelo usuario; T02 liberada para desenvolvimento futuro, sem inicio imediato da execucao.

## Controle de tarefas

| Tarefa | Estado    | Depende de | Resumo                                                      | Arquivo                                                                                                                                 |
| ------ | --------- | ---------- | ----------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| T01    | Concluida | Nenhuma    | Base de dominio e persistencia de autenticacao              | [T01 - Base de dominio e persistencia de autenticacao](tarefas/T01-base-dominio-persistencia-autenticacao.md)                           |
| T02    | Concluida | T01        | Cadastro na rota /cadastro com handlers proprios            | [T02 - Cadastro na rota /cadastro com handlers proprios](tarefas/T02-cadastro-rota-cadastro-handlers-proprios.md)                       |
| T03    | Concluida | T02        | Biblioteca segura na rota /biblioteca com handlers proprios | [T03 - Biblioteca segura na rota /biblioteca com handlers proprios](tarefas/T03-biblioteca-segura-rota-biblioteca-handlers-proprios.md) |
| T04    | Planejada | T03        | Verificacao integrada e mapa final do fluxo                 | [T04 - Verificacao integrada e mapa final do fluxo](tarefas/T04-verificacao-integrada-mapa-final-fluxo.md)                              |
