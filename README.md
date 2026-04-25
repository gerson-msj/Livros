# Livros

Aplicação web desenvolvida com Deno Fresh para gerenciamento pessoal de livros, séries e autores. Este projeto foi construído com foco em
aprendizado prático, explorando organização em camadas, autenticação, persistência com Deno KV, operações atômicas e uma abordagem própria
de inversão de controle e injeção de dependência.

## Visão Geral

O sistema permite cadastrar usuários, autenticar acessos, manter uma área protegida para usuários logados e organizar uma biblioteca pessoal
com livros e séries. A interface utiliza Bulma para composição visual e componentes próprios para modal, caixa de mensagens e exibição de
validações.

Além do aspecto funcional, o projeto também serve como laboratório de arquitetura, separando responsabilidades entre rotas, serviços,
repositórios, contexto de dados, modelos de domínio, validação e componentes de interface.

## Principais Destaques

- Projeto baseado em Deno Fresh, com renderização no servidor e uso de islands em Preact.
- Persistência em Deno KV, incluindo suporte a operações atômicas para fluxos transacionais.
- Service Provider customizado para inversão de controle e injeção de dependência.
- Backend organizado em camadas de services, repositories e data context.
- Autenticação com login, cadastro de usuário e recuperação simples de senha por chave.
- Controle de sessão por cookie HTTP-only e middleware para proteção de área autenticada.
- Senhas armazenadas com criptografia implementada no próprio projeto em TypeScript, sem biblioteca externa dedicada para esse fluxo.
- Componentes próprios de modal e mensagens para confirmação, alertas e feedback ao usuário.
- Validação de modelos tanto no fluxo de entrada quanto na experiência da interface.
- Testes automatizados cobrindo regras de serviço, com foco atual em operações de séries.

## Stack

- Deno
- Fresh 2
- Preact
- Vite via plugin do Fresh
- Deno KV
- Bulma
- TypeScript

## Recursos do Sistema

### Autenticação e Sessão

O projeto possui um fluxo completo de acesso com:

- login de usuário
- cadastro de novo usuário
- redefinição simples de senha via chave gerada pelo sistema
- criação e validação de sessão persistida em cookie
- redirecionamento para área segura quando o usuário já está autenticado
- bloqueio de acesso às rotas protegidas quando não há sessão válida

As sessões são armazenadas no Deno KV, possuem tempo de expiração configurável e são resolvidas via middleware.

### Biblioteca Pessoal

Na área autenticada, o usuário pode:

- visualizar resumo da biblioteca
- cadastrar e consultar livros
- registrar séries e seus volumes
- associar autores às obras
- acompanhar leituras concluídas por data

Há também indicadores simples no painel principal, como quantidade de livros cadastrados e livros lidos.

### Arquitetura em Camadas

O backend foi estruturado para separar responsabilidades de forma explícita:

- routes: entrada HTTP, validação de requisições, respostas e integração com cookies
- services: regras de negócio e orquestração de fluxos
- repositories: acesso ao Deno KV
- data-context: abertura do banco, controle de operação atômica e suporte ao commit transacional
- domain: modelos, dados de transporte, valores e validações

Essa organização torna o projeto interessante como referência de estudo para aplicações Deno com domínio mais estruturado do que um CRUD
básico.

### Injeção de Dependência

Um dos pontos mais interessantes do projeto é o Service Provider customizado, responsável por registrar e resolver dependências de contexto,
repositórios e serviços. Isso permite desacoplamento entre camadas e criação sob demanda de instâncias conforme o fluxo da requisição.

### Operações Atômicas com Deno KV

O projeto utiliza operações atômicas do Deno KV para manter consistência em fluxos que envolvem múltiplas gravações, como criação de usuário
com sessão inicial e atualizações relacionadas a séries e livros. Esse detalhe dá ao projeto um ganho arquitetural relevante para estudo de
persistência transacional em Deno.

### Componentes de Interface Reutilizáveis

Além das páginas e islands, o sistema conta com componentes próprios para:

- modal controlada por controller
- caixa de confirmação e mensagem personalizada
- entradas reutilizáveis
- pesquisa de autor
- listagem de erros de validação

Isso reforça a proposta de reaproveitamento e organização da interface sem depender apenas de componentes externos prontos.

## Estrutura do Projeto

```text
app/
	data-context/   contexto do Deno KV e operações atômicas
	domain/         modelos, valores, validações e DTOs
	repositories/   acesso aos dados
	services/       regras de negócio e service provider
components/       componentes reutilizáveis de UI
islands/          componentes interativos no cliente
routes/           rotas, middlewares e páginas
tests/            testes automatizados
assets/           estilos com Bulma e CSS adicional
static/           arquivos estáticos
```

## Diferenciais de Implementação

- Uso de middleware para configurar dependências por requisição.
- Resolução de serviços específicos do usuário autenticado apenas após validação da sessão.
- Separação entre modelo de entrada, dados de resposta e value objects do domínio.
- Criptografia implementada internamente com recursos nativos da linguagem e da Web Crypto API.
- Fluxo de feedback ao usuário com componentes próprios de confirmação e mensagens.

## Execução Local

### Pré-requisitos

- Deno instalado

Documentação oficial: https://docs.deno.com/runtime/getting_started/installation

### Rodando em desenvolvimento

```bash
deno task dev
```

### Build de produção

```bash
deno task build
```

### Inicialização da aplicação gerada

```bash
deno task start
```

### Verificações do projeto

```bash
deno task check
```

## Variáveis de Ambiente

O projeto usa variáveis de ambiente para configuração. Pelos pontos observados no código, as principais são:

- `DBPATH`: caminho do arquivo/banco usado pelo Deno KV
- `SESSION_MAX_AGE_MINUTES`: duração da sessão em minutos
- `TOKENRAWKEY`: chave bruta usada em rotinas internas de token

## Testes

Há teste automatizado cobrindo operações do serviço de séries, incluindo inclusão e atualização de livros relacionados.

Uma execução típica pode ser feita com:

```bash
deno test -A --unstable-kv
```

## Observação

Este repositório foi usado como projeto de aprendizado. Por isso, além de entregar funcionalidades reais, ele também destaca decisões
arquiteturais e implementações próprias que ajudam a estudar como montar uma aplicação web completa com Deno, Fresh, Deno KV e TypeScript.
