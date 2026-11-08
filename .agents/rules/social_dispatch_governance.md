# Diretriz Global de Governança de Disparos em Redes Sociais (Inviolável)

Esta regra rege toda a automação de postagens, disparos cirúrgicos e distribuição de conteúdo do ecossistema digital.

---

## 1. Cláusula de Separação de Identidades (Inviolável)

O ecossistema opera sob duas personas distintas que **NUNCA** devem ser misturadas:

### A. Persona Editorial / Sagrada: Portal Pombagiras (`almas`)
- **Foco Temático**: Tradição, memória, teologia, antropologia de Pombagiras e Exus, estudos de Umbanda e Quimbanda, oráculos e firmezas.
- **Canais Autorizados no Disparo de Artigos**:
  - Instagram: `@almasdepombagira` (Feed e Reels)
  - Threads: `@almasdepombagira`
  - Bluesky: `@almasdepombagira.bsky.social`
  - Mastodon: `@alexiamelusine@mastodon.social`
  - Tumblr: `alexiamelusine.tumblr.com`
  - YouTube Shorts: `@almasdepombagira` (quando houver vídeo vertical)
  - Telegram: Canal Oficial (`t.me/pomba_giras`)
  - Discord: Servidor Oficial
  - Pinterest: `@almasdepombagira`
- **BLINDAGEM ABSOLUTA (REGRA INVIOLÁVEL: SOMENTE ESTES DOIS CANAIS NUNCA RECEBEM DISPARO)**:
  - 1. Instagram: `https://www.instagram.com/alexiamelusine/` (`@alexiamelusine`)
  - 2. Threads: `https://www.threads.com/@alexiamelusine` (`@alexiamelusine`)
  - **TODOS OS DEMAIS CANAIS SÃO AUTORIZADOS E DEVEM RECEBER OS DISPAROS DE NOVOS ARTIGOS.**

### B. Persona Artística e Filosófica: Alexia Melusine (`alexia`)
- **Foco Temático**: Identidade Trans / Pride, Arte Digital Generativa, Cyberpunk, Gótico Contemporâneo, Manifestos e Poética.
- **Canais da Persona**:
  - Instagram: `@alexiamelusine` (exclusivo para conteúdos autorais/pride, nunca artigos)
  - Threads: `@alexiamelusine` (exclusivo para conteúdos autorais/pride, nunca artigos)
  - Mastodon: `@alexiamelusine@mastodon.social` (recebe conteúdos autorais e artigos)
  - Tumblr: `alexiamelusine.tumblr.com` (recebe conteúdos autorais e artigos)
  - Discord (canal específico)

---

## 2. Automação de Novo Artigo / Página Criada
Ao publicar uma nova página no portal `pombagiras.com`:
1. Executar `python dispatch_article.py <slug_do_artigo>`.
2. O script extrai automaticamente metadados (`<title>`, `<meta description>`, `og:image`, `canonical`).
3. Dispara exclusivamente para o **Ecossistema Sagrado (`almas`)**.

---

## 3. Disparos Avulsos Sob Demanda
Quando a usuária solicitar disparos pontuais (ex: *"Mande no Telegram e Discord uma frase de cura de autoestima"*):
- Disparar apenas nos canais explicitamente solicitados via `dispatch_custom.py` ou chamando as funções especializadas.

