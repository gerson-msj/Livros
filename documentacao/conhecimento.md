# Conhecimento do projeto

Livros e um MVP para controlar leituras e organizar series de livros. O projeto usa Fresh, Deno e Bulma, possui cadastro, login, redefinicao
de senha, sessao HTTP persistida em libSQL local e biblioteca com gerenciamento de livros avulsos, series e lista compacta de ultimos livros
na area segura `/biblioteca`.

## Visao

O sistema existe para qualquer usuario registrar livros em leitura ou ja lidos. Seu publico inicial inclui leitores de ebooks, Kindle e
Audible.

O problema central e a falta de uma forma simples, nas plataformas da Amazon, de controlar o que ja foi lido e organizar livros pertencentes
a series.

O primeiro objetivo e entregar um MVP simples. Expansoes serao consideradas depois que os recursos essenciais estiverem funcionando.

## Dominios

### Usuario

Pessoa que se cadastra no sistema com nome de usuario e senha e mantem seu proprio controle de leitura.

No cadastro existente, o sistema remove espacos ao redor do nome de usuario e da senha, exige ao menos 5 caracteres para ambos, armazena o
nome de usuario em minusculas e recusa nomes duplicados. Depois de um cadastro valido, gera uma chave UUID de redefinicao que deve ser
anotada pelo usuario, cria uma sessao com validade de uma semana e permite entrada direta na area segura depois que a chave for apresentada.

O login usa nome de usuario e senha e funciona como entrada principal do sistema. A redefinicao de senha exige nome de usuario, chave de
redefinicao atual e nova senha; quando concluida, invalida a chave usada, apresenta uma nova chave para uso futuro e cria uma sessao.

Cada usuario pode ter no maximo uma sessao ativa persistida. Quando uma nova sessao e criada por cadastro, login ou redefinicao de senha,
sessoes anteriores do mesmo usuario sao removidas. Um navegador que mantenha cookie de uma sessao substituida deixa de acessar a area segura
quando a sessao for validada e e direcionado ao login.

Os dados de livros, series e autores pertencem somente ao usuario que os cadastrou. Nao existe compartilhamento entre usuarios.

### Autor

Pessoa associada a livros avulsos e series. Cada autor pertence ao usuario que o cadastrou e pode ser reutilizado nos dois tipos de
cadastro.

Ao cadastrar um livro avulso ou uma serie, o usuario pode escolher um autor que ja tenha cadastrado. Autores nao sao compartilhados entre
usuarios.

No gerenciamento de livros avulsos, o usuario pode escolher um autor existente ou digitar um novo autor durante a inclusao. Quando o nome
digitado ainda nao existe para o usuario, o autor e criado junto com o livro e passa a ficar disponivel em proximos cadastros.

### Livro

Obra registrada por um usuario como livro avulso ou como parte de uma serie. No MVP, possui:

- titulo;
- autor;
- data de inicio da leitura;
- data de fim ou conclusao da leitura.

As datas sao opcionais. Depois do cadastro, somente as datas podem ser alteradas. Caso outro dado esteja incorreto, o usuario deve excluir o
livro e cadastra-lo novamente.

Livro avulso exige titulo e autor com ao menos dois caracteres. O mesmo usuario nao pode cadastrar outro livro avulso com o mesmo par titulo
e autor, considerando a comparacao normalizada por codigo. O mesmo titulo e permitido quando o autor e diferente, e o mesmo par titulo/autor
e permitido para usuarios diferentes.

Datas em branco sao aceitas. Quando informadas, devem ser datas completas, e a data de inicio nao pode ser posterior a data de conclusao.

O MVP nao armazena um estado de leitura separado. Quando necessario, a situacao da leitura deve ser inferida pelas datas registradas.

Livros avulsos e livros de series aparecem juntos na lista compacta de ultimos livros da biblioteca. Essa lista prioriza livros com data de
conclusao em ordem decrescente e, quando houver menos de 10 concluidos, completa com livros sem data de conclusao por ordem decrescente de
cadastro.

### Serie

Agrupamento de livros relacionados, identificado por nome e autor da serie.

Durante o cadastro, o usuario inclui livros informando titulo e datas opcionais. Cada novo livro recebe automaticamente a proxima ordem da
serie. Antes de concluir o cadastro, o usuario pode remover somente o ultimo livro adicionado.

Depois do cadastro, somente as datas dos livros podem ser alteradas. Os demais dados nao podem ser editados, e o usuario pode excluir a
serie inteira.

## Recursos

### Estado atual

- Projeto Fresh inicializado com Deno, Vite e Preact.
- Bulma e Font Awesome configurados para a interface.
- Cadastro de usuarios em `/cadastro` com nome de usuario, senha, visualizacao opcional da senha digitada, indicacao `is-danger` para campos
  invalidos e limpeza do erro visual de um campo quando o usuario volta a digitar nele.
- Login em `/login` com nome de usuario e senha, mensagens genericas para credenciais invalidas e caminhos para cadastro e redefinicao de
  senha.
- Cadastro bem-sucedido apresenta uma chave UUID de redefinicao, permite copiar a chave para a area de transferencia quando o navegador
  suporta a Clipboard API, cria uma sessao inicial por cookie HTTP e mantem a chave visivel antes de seguir para `/biblioteca`.
- Redefinicao de senha em `/redefinir-senha` com nome de usuario, chave atual e nova senha, invalidando a chave usada, apresentando uma nova
  chave e criando sessao autenticada.
- Persistencia local com libSQL em `Livros.db` para usuarios, sessoes, autores, livros e series.
- Senhas e chaves de redefinicao sao armazenadas por hash, nao em texto puro.
- Sessoes tem validade de uma semana e ha no maximo uma sessao persistida por usuario.
- `/biblioteca` existe como area segura com opcao de saida, pontos de entrada compactos para livros avulsos e series, e lista compacta dos
  ultimos livros do usuario autenticado.
- A lista compacta da biblioteca mistura livros avulsos e livros de series, mostra no maximo 10 itens, exibe somente titulo, autor e data de
  conclusao, nao possui acao ao clicar no livro, e fica oculta quando nao ha livros ou series cadastrados.
- Visitantes sem sessao ativa sao redirecionados de `/biblioteca` para `/login`; usuarios ja logados sao redirecionados de `/login`,
  `/cadastro` e `/redefinir-senha` para `/biblioteca`.
- Logout remove a sessao persistida, limpa o cookie, redireciona para `/login` e impede novo acesso seguro com a mesma sessao.
- `/biblioteca/livros` lista livros avulsos do usuario autenticado, ordenados por inclusao com cadastros mais recentes no inicio, exibindo
  titulo, autor, data de inicio e data de conclusao.
- `/biblioteca/livros/novo` permite incluir livro avulso com titulo, autor existente ou novo e datas opcionais. Ao salvar com sucesso,
  apresenta confirmacao e retorna para a lista.
- `/biblioteca/livros/:id` permite abrir livro avulso proprio para editar somente datas ou excluir o livro. Titulo e autor ficam somente
  leitura; a exclusao exige confirmacao contendo o titulo do livro e retorna para a lista apos sucesso.
- `/biblioteca/series` lista series do usuario autenticado, ordenadas por inclusao com cadastros mais recentes no inicio, exibindo nome,
  autor e livros vinculados em ordem.
- `/biblioteca/series/nova` permite incluir serie com nome, autor existente ou novo, e um ou mais livros com datas opcionais. Ao salvar com
  sucesso, apresenta confirmacao e retorna para a lista.
- `/biblioteca/series/:id` permite abrir serie propria para editar somente datas dos livros vinculados ou excluir a serie completa. Nome,
  autor e titulos ficam somente leitura; a exclusao exige confirmacao e retorna para a lista apos sucesso.
- Os fluxos de inclusao e edicao alertam o usuario ao tentar voltar com alteracoes nao salvas.
- Visitantes sem sessao ativa nao acessam as rotas de livros ou series; usuarios autenticados veem, editam e excluem somente seus proprios
  registros.
- Popup de mensagem reutilizavel como island Preact, com chamada assincrona, retorno `ok` ou `cancel`, temas Bulma, botoes opcionais,
  quebras de linha legiveis e cancelamento por clique fora ou tecla `Esc`.
- Titulo padrao reutilizavel como island Preact, com area esquerda configuravel, titulo alinhado a esquerda, intencao de voltar emitida por
  evento e acao opcional de saida com confirmacao por popup.
- As paginas `/login`, `/cadastro`, `/redefinir-senha` e `/biblioteca` usam o titulo padrao; a biblioteca confirma a saida antes de executar
  o logout existente.
- Alteracoes em `Livros.db` sao ignoradas pelo watcher do Vite para evitar refresh durante o desenvolvimento local.

## Decisoes

### Deno e Fresh

O sistema usa Deno e Fresh. A escolha considera a hospedagem gratuita oferecida pelo ecossistema Deno e o interesse tecnico no framework
Fresh.

O esqueleto atual usa Fresh 2.3.3, Vite e Preact.

### Persistencia com libSQL e Turso

A persistencia deve usar libSQL inicialmente de forma local. Posteriormente, o banco deve usar Turso por sua gratuidade, simplicidade e
compatibilidade com SQLite.

SQLite foi preferido ao Deno KV por ser mais abrangente para o dominio esperado. libSQL foi escolhido por permitir trabalhar tanto
localmente quanto com Turso.

O schema do banco possui scripts SQL versionados em `infraestrutura/migrations`. A criacao inicial no Turso deve ser feita manualmente a
partir desses scripts, e futuras alteracoes de schema devem adicionar novas migrations numeradas. O projeto mantem um helper local
`deno task db:migrate` para aplicar as migrations quando conveniente, mas migrations de producao continuam sendo uma acao manual.

Para usuarios no Brasil, a regiao inicial recomendada para o banco Turso e Virginia entre as opcoes disponiveis avaliadas, por ficar na
costa leste dos Estados Unidos e tender a ter melhor latencia que Ohio, Oregon, Ireland, Mumbai ou Tokyo. Antes da criacao definitiva do
banco, a CLI do Turso pode ser usada para confirmar latencias reais da conexao local.

O banco Turso inicial do projeto usa a URL `libsql://livros-gerson-msj.aws-us-east-1.turso.io`. O token de acesso nao deve ser registrado na
documentacao ou no repositorio; ele deve permanecer armazenado separadamente e ser configurado por variavel de ambiente.

### Autenticacao e redefinicao de senha

O sistema nao exige email. Cada conta usa nome de usuario e senha.

No cadastro implementado, uma chave de redefinicao em formato UUID e gerada e apresentada ao usuario. A tela permite copiar a chave para a
area de transferencia quando o navegador suporta a Clipboard API e mantem a chave visivel para copia manual quando a copia automatica falha
ou nao esta disponivel. Depois do cadastro, o usuario pode seguir para a area segura por uma sessao inicial registrada no banco e
representada no navegador pelo cookie `livros_session`.

Senha e chave de redefinicao sao persistidas somente como hashes PBKDF2 com SHA-256, salt aleatorio e 210000 iteracoes. A chave em texto
claro aparece apenas no resultado do cadastro.

Login separado em `/login` usa nome de usuario e senha e mostra mensagem generica quando as credenciais sao invalidas. Redefinicao de senha
em `/redefinir-senha` usa nome de usuario, chave atual e nova senha; em caso de sucesso, invalida a chave usada, gera uma nova chave e a
apresenta ao usuario para uso futuro.

Cada sessao tem validade de uma semana. O cookie de sessao usa `HttpOnly`, `SameSite=Lax`, `Path=/` e expiracao alinhada a sessao
persistida. Ao criar uma nova sessao para um usuario, sessoes anteriores do mesmo usuario sao removidas para manter no maximo uma sessao
persistida por usuario. O logout remove a sessao no banco e limpa o cookie.

### Privacidade

Livros, series e autores sao privados e isolados por usuario. O MVP nao funciona como rede social e nao oferece compartilhamento desses
registros.

Dentro dos dados de um mesmo usuario, autores sao compartilhados entre livros avulsos e series e podem ser selecionados em novos cadastros.

O isolamento tambem se aplica a listagens, selecoes, validacoes de duplicidade, edicao e exclusao de livros avulsos e series.

### Imutabilidade dos cadastros

Depois do cadastro, o usuario pode alterar somente as datas dos livros avulsos e dos livros pertencentes a series.

Erros em outros dados de um livro avulso exigem sua exclusao e um novo cadastro. Uma serie nao permite alterar nome, autor, livros ou ordem
depois de cadastrada; ela pode ser excluida integralmente.

### Modelo de livros e autores

Autores, livros e series sao persistidos em tabelas `authors`, `books` e `series`, sempre associados ao usuario. A tabela `books` e unica
para livros avulsos e livros de series.

Um livro avulso e identificado por `author_id` preenchido, `series_id` vazio e `series_order` vazia. Um livro de serie usa `series_id` e
`series_order` preenchidos, com `author_id` vazio, herdando o autor da serie.

A referencia de autor permanece opcional no banco para compatibilidade com livros de series, mas o servico mantem autor obrigatorio na regra
de negocio de livro avulso.

### Interface com Bulma

Bulma foi escolhido como biblioteca de interface e seu CSS local e importado por `client.ts`. O projeto tambem disponibiliza o CSS local do
Font Awesome em `static/css/all.min.css`, referenciado globalmente por `routes/_app.tsx`.

Interacoes reutilizaveis de interface podem ser entregues como islands Preact pequenas quando exigirem estado no cliente. O popup de
mensagem usa composicao Bulma `message` e `message-body`, preserva texto com quebras de linha sem interpretar HTML livre e resolve a escolha
do usuario de forma assincrona. O titulo padrao encapsula apresentacao, intencao de voltar e confirmacao de saida, mas deixa a navegacao e o
logout efetivo sob responsabilidade da pagina chamadora.

### Rotas Fresh e handlers

As rotas devem concentrar a pagina e seus handlers sempre que isso for suficiente para o comportamento esperado. A propria pagina deve
preferir carregar dados com `GET` e processar formularios com `POST` em seus handlers de rota.

Rotas de API separadas devem ser usadas somente quando houver necessidade real de um endpoint fora da pagina em questao, como integracoes,
consumo por componentes interativos ou reutilizacao entre fluxos.

As rotas de livros avulsos confirmadas sao `/biblioteca/livros`, `/biblioteca/livros/novo` e `/biblioteca/livros/:id`. A rota de edicao usa
`GET` para carregar a pagina, `POST` para salvar datas e `DELETE` para excluir por chamada do componente interativo.

A area segura `/biblioteca` usa middleware aninhado em `routes/biblioteca/_middleware.ts` para validar a sessao e disponibiliza-la em
`ctx.state.authenticatedSession`. A pagina raiz da biblioteca fica em `routes/biblioteca/index.tsx` para participar da mesma arvore de
middleware. Requisicoes de pagina sem sessao ativa redirecionam para `/login`; requisicoes que pedem JSON recebem `401`.

### Organizacao orientada a dominio

O projeto deve favorecer DDD de forma pragmatica para o MVP. Regras de negocio e conceitos do dominio devem ficar separados de detalhes de
interface, framework e persistencia, sem criar complexidade preventiva.

Essa diretriz e permanente e deve orientar novos tarefas por padrao, sem precisar ser redefinida em cada proposta ou plano.

### Formatacao do codigo

O projeto define em `deno.json` seu padrao de formatacao para o `deno fmt`, com linhas de ate 140 caracteres, indentacao de quatro espacos,
sem ponto e virgula, sem virgulas finais e com a opcao `spaceAround` desativada.

### Desenvolvimento AI First

O projeto e desenvolvido prioritariamente por agentes de IA. O codigo deve favorecer simplicidade, clareza e verificacao automatizada, sem
adicionar protecoes destinadas apenas a evitar erros de autoria pouco provaveis.

Essa preferencia nao remove validacoes necessarias para regras de negocio, seguranca, integridade dos dados, concorrencia ou entradas
externas. Protecoes devem existir quando reduzirem um risco real do sistema, e nao apenas por precaucao generica.

### Composicao e injecao de dependencias

Quando a primeira dependencia de infraestrutura, repository ou service for implementada, o projeto deve adotar um service provider simples
para centralizar a composicao e permitir a substituicao de dependencias em testes.

Um novo provider deve ser criado por request em middleware e disponibilizado por `ctx.state`. Suas instancias devem ser resolvidas sob
demanda e reutilizadas durante o request. Recursos realmente globais podem ser criados fora do provider e registrados como instancias em
cada escopo.

Classes de negocio devem receber diretamente suas dependencias pelo construtor, sem receber o service provider. O provider deve permanecer
restrito a composicao e aos pontos de entrada da aplicacao.

O mecanismo deve permanecer pequeno, tipado e sem bibliotecas externas, decorators ou reflexao. Registros duplicados nao exigem validacao
defensiva; uma nova configuracao para a mesma chave pode substituir a anterior.

### Estrategia de entrega

O projeto comeca como um MVP simples. Novos recursos e complexidade devem ser adicionados somente quando houver necessidade validada.

## Estado da tarefa

A inicializacao do projeto Fresh esta concluida. A tarefa [TF-001 - Cadastro de usuarios](tarefas/001-cadastro-de-usuarios/tarefa.md) esta
concluida apos implementar e validar cadastro, sessao inicial, biblioteca segura minima e ajustes de experiencia do cadastro. A tarefa
[TF-002 - Componentes de mensagem e titulo](tarefas/002-componentes-mensagem-titulo/tarefa.md) esta concluida apos implementar e validar
popup de mensagem, titulo padrao, aplicacao em cadastro e biblioteca e confirmacao de saida. A tarefa
[TF-003 - Login e redefinicao de senha](tarefas/003-login-redefinicao-senha/tarefa.md) esta concluida apos implementar e validar login,
redefinicao de senha com nova chave, redirecionamentos para login, componentes de autenticacao e sessao unica por usuario. A tarefa
[TF-004 - Gerenciamento de livros avulsos](tarefas/004-gerenciamento-livros-avulsos/tarefa.md) esta concluida apos implementar e validar
entrada pela biblioteca, listagem, inclusao, edicao de datas, exclusao, autores privados reutilizaveis, persistencia libSQL e isolamento por
usuario. A tarefa [T-005 - Gerenciamento de series de livros](tarefas/005-gerenciamento-series-livros/tarefa.md) esta concluida apos
implementar e validar listagem, inclusao, edicao de datas e exclusao de series, com autores reutilizaveis, livros ordenados, persistencia
libSQL e isolamento por usuario. A tarefa [T-006 - Biblioteca com ultimos livros](tarefas/006-biblioteca-ultimos-livros/tarefa.md) esta
concluida apos alterar a biblioteca para pontos de entrada compactos e uma lista real dos ultimos livros, unificando livros avulsos e livros
de series com isolamento por usuario.
