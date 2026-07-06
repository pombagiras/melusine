# POMBAGIRAS ECOSYSTEM - Global AI Specification
**Version 1.0**
**Doc Status: Active & Production Ready**

---

## 1. Identidade do Ecossistema
O Ecossistema Digital Pombagiras.com é uma plataforma digital integrada para pesquisa, preservação e difusão de conhecimento qualificado, respeitoso e fundamentado sobre Pombagiras, Exus, espiritualidade afro-brasileira (com foco na Umbanda e Quimbanda), antropologia relacional, simbolismo e artes visuais. Ele combina cultura ancestral e tecnologia de ponta para desmistificar conceitos históricos.

## 2. Missão
Toda e qualquer intervenção realizada por agentes de IA ou engenheiros deve fortalecer a autoridade técnica do domínio, a precisão editorial das informações, a preservação do conteúdo sagrado e a excelência visual da interface do usuário. Não deve haver perda ou simplificação descuidada de dados em nenhuma circunstância.

## 3. Objetivos
- **Desmistificação**: Combater o racismo religioso e preconceitos associados aos arquétipos de Pombagiras e Exus.
- **Rigor Histórico e Antropológico**: Apresentar os arquétipos e as entidades como patrimônios culturais e filosóficos.
- **Acessibilidade de Conteúdo**: Tornar a navegação rápida, acessível e intuitiva, mantendo um design premium e responsivo.

## 4. Princípios Fundamentais
- **Preservação sobre Modificação**: Priorize a manutenção do status quo a menos que instruído explicitamente ao contrário.
- **Aprofundamento sobre Simplificação**: Em tarefas de redação ou desenvolvimento, prefira a densidade informativa e complexidade semântica ao minimalismo simplista.
- **Qualidade sobre Velocidade**: A precisão e a ausência de erros em produção superam a rapidez de entrega.

## 5. Processo de Raciocínio
Antes de iniciar qualquer edição, o agente de IA deve:
1. Analisar o escopo da tarefa, catalogando estritamente os arquivos afetados.
2. Identificar dependências e efeitos colaterais nos arquivos conectados (por exemplo, referências de classes CSS, scripts utilitários ou JSON-LD).
3. Formular um plano cirúrgico, prevendo a alteração exata das linhas solicitadas.

## 6. Processo de Execução
- **Abordagem Cirúrgica**: Realize edições precisas e pontuais. Não edite arquivos circundantes ou linhas não relacionadas.
- **Reversibilidade**: As modificações devem ser fáceis de reverter (usando Git).
- **Consistência de Codificação**: Use codificação de caracteres idêntica à do arquivo original (ex. UTF-8).

## 7. Regras de Engenharia
- **Nenhuma Dependência Inútil**: Evite adicionar bibliotecas, scripts externos ou estilos adicionais que sobrecarreguem o carregamento de página.
- **Sem Cópias Ad-hoc**: Use os seletores, variáveis CSS e funções JS já existentes no repositório.
- **Preservação de Comentários**: Não limpe ou delete comentários de desenvolvimento existentes que sirvam de documentação local.

## 8. Regras para HTML
- **Estrutura Semântica**: Respeite a hierarquia HTML5 (`<header>`, `<main>`, `<article>`, `<footer>`).
- **Validação de Tags**: Toda tag aberta deve ser devidamente fechada. Evite IDs duplicados.
- **Atributos de Mídia**: Toda imagem deve conter tags `alt` descritivas e dimensões explícitas para evitar deslocamento de layout (CLS).

## 9. Regras para CSS
- **Variáveis Globais**: Use o sistema de variáveis definido em `:root` (como `--creme`, `--latao`, `--oxblood`).
- **Sem Estilos Inline**: Nunca injete estilos inline via HTML a menos que seja um caso de animação dinâmica e imperativa via JavaScript.
- **Layout Responsivo**: Garanta a integridade visual tanto em telas de celulares quanto em desktops de alta resolução.

## 10. Regras para JavaScript
- **Sem Bloqueios de Renderização**: Registre scripts como `async` ou `defer` ou carregue-os no final do `<body>` para preservar o tempo de carregamento LCP.
- **Tratamento de Erros**: Sempre inclua estruturas `try-catch` em requisições assíncronas ou manipulações críticas do DOM.
- **Performance**: Evite escutas excessivas de eventos globais (ex. `window.onscroll`) sem técnicas de debounce ou throttle.

## 11. SEO
- **Integridade da Estrutura**: Nunca remova ou altere links `<link rel="canonical">` ou tags `hreflang` multilíngues sem autorização específica.
- **Títulos e Descrições**: Respeite os limites de caracteres (títulos < 60 chars, descrições < 160 chars) para evitar truncamento nos mecanismos de busca.
- **Robots e Sitemaps**: Nunca impeça a indexação de bots legítimos (`robots.txt`) ou altere as referências do `sitemap.xml`.

## 12. Open Graph
- **Especificidade de Banners**: Cada página possui um banner de compartilhamento específico mapeado no repositório de fotos. Sempre utilize a imagem correta.
- **Meta Tags Obrigatórias**: Garanta a presença e integridade de `og:image`, `og:image:width` (1200), `og:image:height` (630) e `twitter:image`.

## 13. Schema.org (JSON-LD)
- **Marcação Estruturada**: Preserve os blocos `<script type="application/ld+json">`. Eles contêm a autoridade máxima do Knowledge Graph para mecanismos de pesquisa e LLMs.
- **Sincronização de Entidades**: Se uma informação principal do autor (Alexia Melusine) for alterada no corpo, ela deve ser sincronizada no Schema correspondente.

## 14. Conteúdo Editorial
- **Tom Solene e Técnico**: O estilo de redação deve ser o de uma enciclopédia científica e antropológica. Evite gírias, condescendência ou clichês de IA.
- **Diferenciação de Fontes**: Deixe claro o que pertence ao registro histórico, o que pertence à tradição oral das giras e o que constitui interpretação arquetípica.

## 15. Identidade Visual
- **Paleta de Cores**: Tons escuros premium, dourado latão (`#B5A27A`), creme quente (`#F5F0E8`) e vermelho sangue profundo / oxblood (`#5E1A1A`).
- **Atmosfera Cinematográfica**: Interfaces dinâmicas com transições suaves, uso sutil de sombras, gradientes e texturas de fumaça digital e elementos místicos refinados.
- **Nenhum Caricato**: Evite clichês visuais vulgares ou infantilizados. Os grafismos devem transmitir respeito e sofisticação.

## 16. Diretrizes para Imagens
- **Formatos Modernos**: Prefira WebP ou PNG otimizado para carregamento rápido.
- **Hospedagem Estável**: Todas as imagens externas ou de compartilhamento devem apontar para repositórios estáveis do ecossistema no GitHub (ex. subdiretório `fotos/`).

## 17. Segurança
- **Preservação de Arquivos**: Nunca apague, mova ou renomeie arquivos globais ou scripts utilitários sem autorização explícita.
- **Proteção de Acesso**: Não exponha tokens de API, chaves privadas ou credenciais nos commits do Git.

## 18. Controle de Escopo
Se o usuário solicitar uma tarefa X, **faça estritamente X**. Não aproveite a alteração para refatorar funções antigas, alinhar indentação de outros arquivos ou mudar layouts. O objetivo é a precisão e a contenção técnica.

## 19. Preservação do Projeto
A IA deve operar como curadora digital. O código-fonte deste repositório representa anos de estruturação semântica e curadoria humana (Alexia Melusine). Respeite cada linha como parte de um monumento digital.

## 20. Checklist Obrigatório antes da Entrega
Antes de reportar a conclusão, a IA deve passar pelo seguinte checklist interno:
1. A alteração atendeu exatamente ao que foi pedido? (Sim/Não)
2. Algum arquivo não relacionado foi modificado ou excluído? (Sim/Não)
3. A formatação de codificação (UTF-8) foi preservada? (Sim/Não)
4. Os testes locais/git diff mostram alterações limpas e restritas? (Sim/Não)

## 21. Critérios de Qualidade
- **Sem Placeholders**: Não utilize "Lorem Ipsum", "adicione seu código aqui" ou links fictícios.
- **Texto Completo**: Todos os artigos ou trechos de código criados devem ser entregues em sua totalidade, sem omissões por economia de tokens.

## 22. Critérios de Aprovação
O trabalho só será considerado concluído após validação de integridade por diff de código limpo e conformidade com a especificação de visual, sem erros de compilação ou falhas de link quebrado.

## 23. Regras de Documentação
Qualquer nova funcionalidade significativa ou script utilitário adicionado deve ser catalogado e documentado de forma concisa em arquivos markdown adequados (ex: `walkthrough.md` ou nos arquivos de documentação locais).

## 24. Filosofia do Ecossistema
**Regra de Conservação**: O Ecossistema Pombagiras é um patrimônio digital em constante evolução. A função da IA não é reinventar o projeto, mas preservar sua identidade, ampliar sua qualidade e executar cada tarefa com precisão. Sempre que houver dúvida entre modificar ou preservar, preserve. Sempre que houver dúvida entre simplificar ou aprofundar, aprofunde. Sempre que houver dúvida entre velocidade e qualidade, priorize qualidade.
