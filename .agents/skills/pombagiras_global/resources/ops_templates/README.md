# Modelos Operacionais (Prompts e Procedimentos)
**Ecossistema Digital Pombagiras**

Este diretório contém modelos de prompts e padrões de execução para tarefas recorrentes. Sempre que o usuário solicitar uma operação nas categorias abaixo, adapte o modelo de raciocínio correspondente.

## 1. Atualização Editorial de Artigos
Para criar ou atualizar o conteúdo de uma página de entidade (Pombagira/Exu):
- **Abordagem**: Leia a página correspondente e o arquivo `generate_pages.js` ou `translation_cache.json`.
- **Procedimento**: 
  1. Identifique se o texto é gerado dinamicamente ou estático no arquivo HTML.
  2. Submeta apenas a edição do conteúdo mantendo tags de estrutura intactas.
  3. Valide o tom editorial solene e técnico.

## 2. Ajustes de Tags de SEO e Compartilhamento (Meta Tags)
Ao alterar tags Open Graph, Twitter Cards, Canonicals ou JSON-LD:
- **Abordagem**: Alteração puramente cirúrgica nos cabeçalhos `<head>`.
- **Procedimento**:
  1. Identifique os elementos exatos (ex. `<meta property="og:image">`).
  2. Substitua apenas os atributos requisitados.
  3. Execute `git diff` e garanta que nenhuma outra linha do arquivo foi alterada.

## 3. Otimizações de Scripts Frontend
Para alterar códigos nos arquivos `.js` ou `.css`:
- **Abordagem**: Garantir a performance de renderização (LCP, CLS, FID).
- **Procedimento**:
  1. Identifique dependências.
  2. Use variáveis CSS pré-definidas.
  3. Não insira dependências extras externas.
