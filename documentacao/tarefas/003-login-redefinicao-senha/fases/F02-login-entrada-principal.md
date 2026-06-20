# F02 - Login como entrada principal

**Tarefa:** [TF-003 - Login e redefinicao de senha](../tarefa.md)

**Estado:** Planejada
**Depende de:** F01

## Objetivo tecnico

Criar o fluxo publico de login e fazer dele a entrada principal do sistema para visitantes sem sessao ativa.

## Contexto necessario

- [Estado atual](../../../conhecimento.md#estado-atual): hoje visitantes sem sessao em `/biblioteca` sao redirecionados para `/cadastro` e
  logout retorna ao cadastro.
- [Interface com Bulma](../../../conhecimento.md#interface-com-bulma): formularios e interacoes devem manter Bulma, Font Awesome e islands
  pequenas quando houver estado no cliente.
- [TF-002 - Componentes de mensagem e titulo](../../002-componentes-mensagem-titulo/tarefa.md): titulo padrao, popup e evento de voltar ja
  existem.

## Entrega esperada

- Tela de login com nome de usuario, senha e mensagem amigavel sobre entrar, criar conta ou redefinir senha.
- Senha do login com icone de olho dentro do campo para alternar visualizacao.
- Login valido cria sessao e encaminha para `/biblioteca`.
- Login invalido apresenta mensagem generica e amigavel.
- Visitante sem sessao que acessa `/biblioteca` e redirecionado para o login.
- Logout da biblioteca encerra a sessao e retorna para o login.
- Usuario ja logado que acessa login ou cadastro e redirecionado para `/biblioteca`.
- Login oferece caminho para cadastro existente e para a tela de redefinicao de senha.

## Criterios de conclusao

- Usuario existente consegue entrar pelo login e acessar `/biblioteca`.
- Login invalido nao cria sessao e exibe uma mensagem generica.
- Acesso sem sessao a `/biblioteca` retorna para o login.
- Logout retorna para o login e impede reutilizacao da sessao encerrada.
- A tela de cadastro segue acessivel a partir do login.
- Usuarios ja autenticados nao permanecem em login ou cadastro.
- A senha do login pode ser mostrada e escondida pelo icone dentro do campo.
- O fluxo possui verificacao automatizada adequada e permanece utilizavel em desktop e mobile.

## Cuidados de implementacao

- Manter rotas Fresh com pagina e handlers proprios quando isso for suficiente.
- Evitar que o login redirecione para cadastro como fallback principal; a nova entrada publica padrao deve ser o login.

## Fora da fase

- Redefinir senha com a chave.
- Apresentar nova chave de redefinicao.
- Refatoracao ampla do cadastro.
