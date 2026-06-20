# F04 - Consistencia componentes fluxo autenticacao

**Tarefa:** [TF-003 - Login e redefinicao de senha](../tarefa.md)

**Estado:** Planejada
**Depende de:** F02, F03

## Objetivo tecnico

Alinhar login, cadastro e redefinicao de senha com componentes pequenos de autenticacao e verificar o fluxo completo de entrada, saida e
recuperacao de acesso.

## Contexto necessario

- [Interface com Bulma](../../../conhecimento.md#interface-com-bulma): interacoes reutilizaveis podem ser islands Preact pequenas quando
  exigirem estado no cliente.
- [TF-001 - Cadastro de usuarios](../../001-cadastro-de-usuarios/tarefa.md): cadastro ja possui senha visualizavel, chave copiavel e limpeza
  local de erros.
- [TF-002 - Componentes de mensagem e titulo](../../002-componentes-mensagem-titulo/tarefa.md): titulo padrao ja encapsula apresentacao,
  intencao de voltar e confirmacao de saida.

## Entrega esperada

- Campos de senha com visualizacao por icone de olho usam um componente ou padrao pequeno e compartilhado quando houver duplicacao real.
- Exibicao de chave com acao de copiar dentro do campo usa um componente ou padrao pequeno e compartilhado quando houver duplicacao real.
- Cadastro, login e redefinicao mantem navegacao clara entre si sem redesenho profundo do cadastro.
- O fluxo completo cadastro, logout, login, redefinicao e retorno a biblioteca fica coberto por verificacao integrada.
- Ajustes visuais necessarios para desktop e mobile sao tratados dentro do escopo das telas de autenticacao.

## Criterios de conclusao

- Login, cadastro e redefinicao apresentam controles de senha e chave consistentes.
- A reutilizacao criada reduz duplicacao imediata sem introduzir componente generico excessivo.
- Cadastro continua funcionando com suas regras atuais e passa a se integrar ao login como tela alternativa de criacao de conta.
- O fluxo integrado confirma redirecionamentos de visitante, usuario logado, logout, login valido e redefinicao valida.
- A interface das tres telas publicas de autenticacao permanece utilizavel em desktop e mobile.
- Verificacoes automatizadas focadas e integradas cobrem o comportamento essencial da tarefa.

## Cuidados de implementacao

- Priorizar componentes concretos do dominio de autenticacao, como campo de senha com olho e campo de chave copiavel, em vez de uma
  abstracao generica de formulario.
- Preservar comportamento ja validado do cadastro, principalmente apresentacao e copia da chave, limpeza de erros e sessao inicial.

## Fora da fase

- Novas regras de autenticacao.
- Mudancas de dominio ou persistencia nao exigidas pelas telas.
- Redesenho completo do cadastro.
