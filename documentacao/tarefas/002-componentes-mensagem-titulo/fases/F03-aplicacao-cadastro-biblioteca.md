# F03 - Aplicacao em cadastro e biblioteca

**Tarefa:** [TF-002 - Componentes de mensagem e titulo](../tarefa.md)

**Estado:** Concluida
**Depende de:** F02

## Objetivo tecnico

Aplicar o componente de titulo nas paginas de cadastro de usuario e biblioteca, mantendo os comportamentos existentes dessas paginas.

## Contexto necessario

- [Estado atual](../../../conhecimento.md#estado-atual): cadastro de usuarios e biblioteca segura minima ja existem.
- [TF-002](../tarefa.md): define que cadastro e biblioteca devem usar o novo titulo.
- [F02](F02-titulo-padrao-reutilizavel.md): entrega o componente de titulo reutilizavel.

## Entrega esperada

- Pagina de cadastro usando o titulo padrao com icone esquerdo padrao e sem botao de saida.
- Pagina de biblioteca usando o titulo padrao com botao de saida.
- Confirmacao de saida na biblioteca antes de executar o logout.
- Logout da biblioteca preservando o comportamento atual de encerrar sessao, limpar cookie e redirecionar para cadastro.
- Layout das duas paginas mantendo Bulma e permanecendo adequado para o MVP.

## Criterios de conclusao

- O cadastro apresenta o titulo padronizado e continua permitindo criar usuario como antes.
- A biblioteca apresenta o titulo padronizado com botao de saida.
- Confirmar saida na biblioteca encerra a sessao e redireciona para cadastro.
- Cancelar a saida por botao, clique fora ou `Esc` mantem a sessao e a pagina atual.
- Visitantes e usuarios autenticados continuam seguindo as regras de redirecionamento existentes.
- O comportamento relevante possui verificacao adequada.

## Fora da fase

- Criar telas novas.
- Alterar regras de cadastro, sessao ou armazenamento de usuario.
- Implementar login separado ou redefinicao de senha.

## Resultado

- Pagina de cadastro passou a usar o titulo padrao com icone esquerdo e manteve o formulario de criacao de usuario sem alterar regras de cadastro.
- Pagina de biblioteca passou a usar o titulo padrao com botao de saida, mantendo o handler `POST /biblioteca` como mecanismo de logout.
- A confirmacao de saida ocorre no componente de titulo; confirmar aciona o formulario de logout existente e cancelar mantem a pagina atual.
- Verificacoes realizadas: `deno test routes\cadastro_test.ts routes\biblioteca_test.ts routes\fluxo_cadastro_biblioteca_test.ts -A`, `deno lint routes\cadastro.tsx routes\biblioteca.tsx islands\PageTitle.tsx islands\PopupMessage.tsx`, `deno check routes\cadastro.tsx routes\biblioteca.tsx islands\PageTitle.tsx islands\PopupMessage.tsx` e `deno test -A`.
