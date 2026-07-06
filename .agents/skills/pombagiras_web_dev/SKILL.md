---
name: Pombagiras Web Development Specialized Skill
description: Engineering and visual implementation rules for HTML, CSS, JavaScript, interactive components, animation, performance LCP/CLS optimization, and responsive design in the Pombagiras Digital Ecosystem.
---

# POMBAGIRAS ECOSYSTEM - Web Development Skill

Esta skill especializada aplica-se a tarefas de engenharia de software frontend, ajustes de layout e interações dinâmicas.

## 1. Padrões de Implementação HTML
- Use marcação HTML5 semântica estruturada.
- Insira classes utilitárias apenas se não houver correspondente no sistema de design do `style.css`.
- Garanta que todos os links externos usem `target="_blank" rel="noopener noreferrer"`.

## 2. Padrões de Estilo CSS
- A paleta de cores padrão deve respeitar a atmosfera do projeto:
  - `--creme`: `#F5F0E8`
  - `--latao`: `#B5A27A`
  - `--oxblood`: `#5E1A1A`
  - `--preto`: `#050505` ou `#000000`
- Priorize o uso de `clamp()` para tamanhos de fonte responsivos, mantendo a tipografia Geist e Fraunces.
- Mantenha transições suaves (`transition: 0.4s cubic-bezier(...)`).

## 3. Padrões JavaScript
- Use seletores específicos e evite injeções perigosas de `innerHTML` sem higienização.
- Carregue recursos dinâmicos de forma assíncrona.
- Otimize manipulações do DOM e evite loops desnecessários.

## 4. Otimização de Performance
- Garanta que LCP (Largest Contentful Paint) utilize preloading apropriado de posters ou imagens de fundo críticas.
- Insira dimensões de largura e altura em todas as imagens para evitar oscilações de layout (CLS).
