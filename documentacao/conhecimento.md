# Conhecimento do projeto

Livros e um MVP para controlar leituras e organizar series de livros. O projeto esta apenas inicializado com o esqueleto padrao do Fresh e
com a base visual configurada; os recursos do produto e o banco de dados ainda nao foram implementados.

## Visao

O sistema existe para qualquer usuario registrar livros em leitura ou ja lidos. Seu publico inicial inclui leitores de ebooks, Kindle e
Audible.

O problema central e a falta de uma forma simples, nas plataformas da Amazon, de controlar o que ja foi lido e organizar livros pertencentes
a series.

O primeiro objetivo e entregar um MVP simples. Expansoes serao consideradas depois que os recursos essenciais estiverem funcionando.

## Dominios

### Usuario

Pessoa que se cadastra no sistema com nome de usuario e senha e mantem seu proprio controle de leitura.

No cadastro, o sistema gera uma chave de redefinicao que deve ser anotada pelo usuario. Depois da apresentacao dessa chave, o usuario entra
diretamente na area segura, sem precisar realizar um novo login.

O login exige nome de usuario e senha. A redefinicao de senha exige nome de usuario, chave de redefinicao e uma nova senha. Depois da
redefinicao, o sistema invalida a chave utilizada e apresenta uma nova chave para redefinicoes futuras.

Os dados de livros, series e autores pertencem somente ao usuario que os cadastrou. Nao existe compartilhamento entre usuarios.

### Autor

Pessoa associada a livros avulsos e series. Cada autor pertence ao usuario que o cadastrou e pode ser reutilizado nos dois tipos de
cadastro.

Ao cadastrar um livro avulso ou uma serie, o usuario pode escolher um autor que ja tenha cadastrado. Autores nao sao compartilhados entre
usuarios.

### Livro

Obra registrada por um usuario como livro avulso ou como parte de uma serie. No MVP, possui:

- titulo;
- autor;
- data de inicio da leitura;
- data de fim ou conclusao da leitura.

As datas sao opcionais. Depois do cadastro, somente as datas podem ser alteradas. Caso outro dado esteja incorreto, o usuario deve excluir o
livro e cadastra-lo novamente.

O MVP nao armazena um estado de leitura separado. Quando necessario, a situacao da leitura deve ser inferida pelas datas registradas.

Livros avulsos e livros de series nao possuem uma relacao direta no comportamento do MVP. A possibilidade de usar um cadastro unico de
livros, indicando se cada livro e avulso ou pertence a uma serie, deve ser avaliada durante a definicao do modelo de dados.

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
- Pagina, contador e rotas de API de exemplo do template Fresh.
- Nenhum recurso de negocio implementado.
- Nenhum banco de dados configurado.

### Escopo inicial planejado

- Cadastro de usuarios aberto a qualquer pessoa.
- Login com nome de usuario e senha.
- Redefinicao de senha com nome de usuario, chave de redefinicao e nova senha.
- Cadastro de livros.
- Cadastro e reutilizacao de autores em livros avulsos e series.
- Registro de titulo, autor e datas de inicio e conclusao da leitura.
- Cadastro e organizacao de series de livros.

O modelo de dados concreto, incluindo a representacao unificada ou separada de livros avulsos e livros de series, ainda precisa ser
definido.

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

### Autenticacao e redefinicao de senha

O sistema nao exige email. Cada conta usa nome de usuario e senha.

No cadastro, uma chave de redefinicao e gerada e apresentada ao usuario. Essa chave, junto do nome de usuario, permite definir uma nova
senha. Depois do cadastro, o usuario entra diretamente na area segura.

Cada redefinicao de senha invalida a chave utilizada e gera uma nova chave de redefinicao, que deve ser apresentada ao usuario para uso
futuro.

Os requisitos de armazenamento seguro de senhas e chaves, formato da chave, limites de tentativas e gerenciamento de sessao devem ser
tratados na definicao tecnica da autenticacao.

### Privacidade

Livros, series e autores sao privados e isolados por usuario. O MVP nao funciona como rede social e nao oferece compartilhamento desses
registros.

Dentro dos dados de um mesmo usuario, autores sao compartilhados entre livros avulsos e series e podem ser selecionados em novos cadastros.

### Imutabilidade dos cadastros

Depois do cadastro, o usuario pode alterar somente as datas dos livros avulsos e dos livros pertencentes a series.

Erros em outros dados de um livro avulso exigem sua exclusao e um novo cadastro. Uma serie nao permite alterar nome, autor, livros ou ordem
depois de cadastrada; ela pode ser excluida integralmente.

### Interface com Bulma

Bulma foi escolhido como biblioteca de interface e seu CSS local e importado por `client.ts`. O projeto tambem disponibiliza o CSS local do
Font Awesome em `static/css/all.min.css`, referenciado globalmente por `routes/_app.tsx`.

### Rotas Fresh e handlers

As rotas devem concentrar a pagina e seus handlers sempre que isso for suficiente para o comportamento esperado. A propria pagina deve
preferir carregar dados com `GET` e processar formularios com `POST` em seus handlers de rota.

Rotas de API separadas devem ser usadas somente quando houver necessidade real de um endpoint fora da pagina em questao, como integracoes,
consumo por componentes interativos ou reutilizacao entre fluxos.

### Organizacao orientada a dominio

O projeto deve favorecer DDD de forma pragmatica para o MVP. Regras de negocio e conceitos do dominio devem ficar separados de detalhes de
interface, framework e persistencia, sem criar complexidade preventiva.

Essa diretriz e permanente e deve orientar novos trabalhos por padrao, sem precisar ser redefinida em cada proposta ou plano.

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

## Estado do trabalho

A inicializacao do projeto Fresh esta concluida. O trabalho ativo registrado e o
[TR-001 - Cadastro de usuarios](trabalhos/001-cadastro-de-usuarios/trabalho.md).
