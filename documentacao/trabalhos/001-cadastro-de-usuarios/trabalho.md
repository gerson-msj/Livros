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

**Revisao:** 6 **Proxima tarefa:** T05

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
Depois do retorno da validacao final, os ajustes de experiencia no formulario e na chave serao tratados em tarefas pequenas antes do
encerramento definitivo do trabalho.

### Historico do plano

- 2026-06-17: Revisao 6 reabre o TR-001 apos retorno de validacao final, adicionando T05 para limpar erro ao editar campo invalido e T06
  para copiar a chave de redefinicao.
- 2026-06-17: Checkpoint da T03 confirmado; T04 liberada para desenvolvimento.
- 2026-06-17: Todas as tarefas concluidas; TR-001 movido para encerramento.
- 2026-06-17: Conhecimento permanente consolidado apos conclusao das tarefas.
- 2026-06-17: T04 validada pelo usuario e confirmada como concluida.
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
| T04    | Concluida | T03        | Verificacao integrada e mapa final do fluxo                 | [T04 - Verificacao integrada e mapa final do fluxo](tarefas/T04-verificacao-integrada-mapa-final-fluxo.md)                              |
| T05    | Pronta    | T02        | Limpar erro do campo ao editar cadastro                     | [T05 - Limpar erro do campo ao editar cadastro](tarefas/T05-limpar-erro-campo-editar-cadastro.md)                                       |
| T06    | Planejada | T05        | Copiar chave de redefinicao para area de transferencia      | [T06 - Copiar chave de redefinicao para area de transferencia](tarefas/T06-copiar-chave-redefinicao-area-transferencia.md)              |

## Mapa de fluxo macro ate T04

**Fluxo agregado:** cadastro aberto, entrada direta na area segura e saida da sessao. **Resultado produzido:** usuario persistido com senha
e chave protegidas, sessao inicial em cookie HTTP, rota `/biblioteca` protegida e logout que encerra a sessao. **Exemplo acompanhado:** o
visitante informa `Gerson` e `senha-secreta` em `/cadastro`; o sistema grava `gerson`, mostra a chave UUID, cria o cookie `livros_session`,
libera `/biblioteca` e, ao acionar "Sair", encerra a sessao e redireciona para `/cadastro`.

### 1. Preparar autenticacao e persistencia

**Componentes principais:** dominio de autenticacao, `AuthenticationService`, hasher WebCrypto, repositorios libSQL e provider por request -
🟢 **Criado** / 🟡 **Modificado**

**Entra:** dados de cadastro e necessidade de sessao. **Faz:** normaliza nome, valida minimo de 5 caracteres, protege senha/chave por hash,
persiste usuario e sessao em libSQL e disponibiliza o servico para as rotas. **Sai:** base de autenticacao pronta para uso HTTP.

Detalhes: [T01 - Base de dominio e persistencia de autenticacao](tarefas/T01-base-dominio-persistencia-autenticacao.md).

### 2. Cadastrar usuario em `/cadastro`

**Componentes principais:** rota `/cadastro`, `CadastroForm`, painel da chave e helper de cookie - 🟢 **Criado**

**Entra:** nome e senha enviados pelo formulario. **Faz:** renderiza formulario Bulma, indica campos invalidos com `is-danger`, permite
mostrar a senha, cria usuario/sessao e grava cookie `livros_session` com `HttpOnly`, `SameSite=Lax`, `Path=/` e expiracao da sessao.
**Sai:** chave UUID exibida ao usuario e link para `/biblioteca`.

Detalhes: [T02 - Cadastro na rota /cadastro com handlers proprios](tarefas/T02-cadastro-rota-cadastro-handlers-proprios.md).

### 3. Proteger e encerrar a area segura

**Componentes principais:** rota `/biblioteca`, validacao de sessao, logout e limpeza de cookie - 🟢 **Criado** / 🟡 **Modificado**

**Entra:** acesso a `/biblioteca` com ou sem cookie de sessao. **Faz:** redireciona visitante sem sessao ativa para `/cadastro`, renderiza a
biblioteca minima para sessao valida e encerra a sessao no logout. **Sai:** area segura com somente a opcao "Sair" ou retorno a `/cadastro`
com cookie limpo.

Detalhes:
[T03 - Biblioteca segura na rota /biblioteca com handlers proprios](tarefas/T03-biblioteca-segura-rota-biblioteca-handlers-proprios.md).

### 4. Verificar o fluxo completo

**Componentes principais:** teste integrado, validacao HTTP local e inspecao do banco temporario - 🟢 **Criado**

**Entra:** fluxo completo de cadastro ate logout. **Faz:** confirma redirecionamentos, persistencia segura, expiracao de uma semana, cookie
HTTP, logout e recusa de sessao encerrada. **Sai:** evidencia integrada de que os criterios do TR-001 foram atendidos.

Detalhes: [T04 - Verificacao integrada e mapa final do fluxo](tarefas/T04-verificacao-integrada-mapa-final-fluxo.md).

| Estacao     | Componentes                    | Impacto                 | Entra -> Sai                         |
| ----------- | ------------------------------ | ----------------------- | ------------------------------------ |
| Base        | Dominio, servico, repositorios | 🟢/🟡 Criado/Modificado | Dados -> usuario/sessao persistidos  |
| Cadastro    | `/cadastro` + formulario       | 🟢 Criado               | Formulario -> chave e cookie         |
| Biblioteca  | `/biblioteca` + logout         | 🟢/🟡 Criado/Modificado | Cookie -> area segura ou saida       |
| Verificacao | Teste integrado + HTTP + banco | 🟢 Criado               | Fluxo completo -> evidencia validada |

## Resumo consolidado ate T04

### Fonte da verdade

O TR-001 implementou, ate a T04, o cadastro inicial de usuarios e a entrada direta na area segura. O sistema possui base persistente de
usuarios e sessoes, tela `/cadastro`, apresentacao de chave UUID de redefinicao, cookie de sessao HTTP, rota `/biblioteca` protegida e
logout. A revisao 6 adicionou ajustes de experiencia ainda pendentes antes do encerramento definitivo.

### Regras de negocio implementadas

- Nome de usuario e senha exigem ao menos 5 caracteres depois de remover espacos ao redor.
- Nome de usuario e armazenado em letras minusculas.
- Nome de usuario duplicado e recusado.
- Cadastro bem-sucedido gera uma chave UUID de redefinicao e a apresenta ao usuario.
- Senha e chave de redefinicao sao persistidas apenas como hashes, nunca em texto puro.
- Cadastro bem-sucedido cria uma sessao inicial com validade de uma semana.
- Usuario com sessao ativa que acessa `/cadastro` e redirecionado para `/biblioteca`.
- Visitante sem sessao ativa que acessa `/biblioteca` e redirecionado para `/cadastro`.
- Logout encerra a sessao persistida, limpa o cookie e impede novo acesso seguro com a mesma sessao.

### Decisoes tecnicas importantes

- A autenticacao usa DDD pragmatico: regras no dominio, coordenacao no servico de aplicacao, persistencia em repositorios libSQL e
  composicao em provider por request.
- Senha e chave usam PBKDF2 com SHA-256, salt aleatorio e 210000 iteracoes.
- As rotas `/cadastro` e `/biblioteca` concentram pagina e handlers `GET`/`POST`, sem APIs separadas.
- O cookie `livros_session` usa `HttpOnly`, `SameSite=Lax`, `Path=/` e expiracao alinhada a sessao.
- `Livros.db` e ignorado pelo watcher do Vite para evitar refresh durante uso local do banco.

### Limites conhecidos

- Login separado e redefinicao de senha permanecem planejados, mas nao foram implementados neste trabalho.
- A biblioteca ainda nao possui recursos de livros, autores ou series; a tela segura contem apenas a opcao de saida.
- `GET /biblioteca` redireciona sessao ausente, invalida, expirada ou encerrada para `/cadastro`, mas nao limpa cookies invalidos nessa
  resposta.
- A validacao visual real em Browser desktop/mobile nao foi executada porque o Browser interno nao estava disponivel; o fluxo foi validado
  por testes, HTTP local e estrutura responsiva Bulma.
- `deno task check` global ainda falha por formatacao preexistente fora do escopo do trabalho; verificacoes focadas dos arquivos afetados
  passaram.

### Como validar

- Executar o teste integrado `deno test -A routes\fluxo_cadastro_biblioteca_test.ts`.
- Executar a suite focada de autenticacao, cadastro e biblioteca registrada na T04.
- Em servidor local, abrir `/cadastro`, criar usuario valido, guardar a chave, seguir para `/biblioteca`, acionar "Sair" e confirmar retorno
  para `/cadastro`.

### Referencias

- [T01 - Base de dominio e persistencia de autenticacao](tarefas/T01-base-dominio-persistencia-autenticacao.md): dominio, servico,
  persistencia, hasher, provider e Vite.
- [T02 - Cadastro na rota /cadastro com handlers proprios](tarefas/T02-cadastro-rota-cadastro-handlers-proprios.md): formulario, handlers,
  cookie e exibicao da chave.
- [T03 - Biblioteca segura na rota /biblioteca com handlers proprios](tarefas/T03-biblioteca-segura-rota-biblioteca-handlers-proprios.md):
  protecao da rota e logout.
- [T04 - Verificacao integrada e mapa final do fluxo](tarefas/T04-verificacao-integrada-mapa-final-fluxo.md): verificacao integrada e mapa
  final do fluxo.

## Consolidacao arquitetural ate T04

**Modo:** Consolidar **Impacto permanente:** Sim

**Conhecimento afetado**

- [Conhecimento do projeto](../../conhecimento.md): recursos existentes, dominio de usuario, autenticacao, sessoes, persistencia local e
  estado do trabalho.

**Atualizacoes**

- Cadastro de usuarios, sessao inicial, `/biblioteca` protegida e logout foram registrados como capacidades existentes.
- Login separado, redefinicao de senha e recursos de livros/autores/series permaneceram registrados como planejados.
- Regras de senha, chave UUID, hash, cookie HTTP e validade de sessao foram consolidadas como estado atual.

**Decisoes pendentes**

- Nenhuma.

**Riscos ou inconsistencias**

- Nenhum bloqueante. Permanece registrado que login separado e redefinicao de senha ainda nao foram implementados.
