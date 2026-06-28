# Livros

Livros e um MVP para qualquer usuario registrar livros em leitura ou ja lidos e
organizar series de livros. O foco inicial sao leitores de ebooks, Kindle e
Audible que precisam manter esse controle fora das plataformas da Amazon.

## Como navegar

Comece por este resumo e siga somente os links relevantes para a tarefa. Nao
inspecione todo o projeto ou toda a documentacao sem necessidade.

- [Conhecimento do produto e decisoes tecnicas](documentacao/conhecimento.md):
  visao, dominio, recursos, estado atual e decisoes permanentes.
- [Tarefas rastreaveis](documentacao/tarefas.md): propostas, planos e
  andamento de mudancas com resultado observavel.
- [README do esqueleto Fresh](README.md): comandos basicos fornecidos pelo
  projeto inicial.

## Instrucoes essenciais

- Trate o projeto como um MVP simples e evite complexidade preventiva.
- Preserve Deno e Fresh como base tecnica.
- Use Bulma para a interface quando os recursos do produto forem implementados.
- Para ajustes visuais ou de layout, valide com navegador quando disponivel.
  No VS Code, prefira `@chrome`/Chrome plugin para validar a tela renderizada.
- Comece a persistencia com libSQL local e mantenha o uso futuro do Turso como
  direcao arquitetural.
- Diferencie capacidades existentes de recursos apenas planejados.
- Registre novas decisoes permanentes no conhecimento local.
- Registre tarefa ativa em `documentacao/tarefas.md` somente quando houver
  uma mudanca rastreavel com resultado observavel.
