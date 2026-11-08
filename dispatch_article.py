#!/usr/bin/env python3
"""
======================================================================
✨ POMBAGIRAS DIGITAL ECOSYSTEM - ARTICLE DISPATCHER ✨
======================================================================
Disparador cirúrgico oficial para novos artigos do portal pombagiras.com.

Regra Inviolável de Governança:
- Dispara para o Ecossistema Almas de Pombagira:
  • Instagram (@almasdepombagira)
  • Threads (@almasdepombagira)
  • Bluesky (@almasdepombagira.bsky.social)
  • YouTube Shorts (@almasdepombagira - se houver vídeo)
  • Telegram (Canal Oficial)
  • Discord (Servidor Oficial)
- BLINDAGEM TOTAL:
  • @alexiamelusine no Instagram e Threads NUNCA recebem posts de artigos!
======================================================================
"""

import os
import sys
import re
import argparse
from pathlib import Path
from html import unescape

# Reutiliza o motor central
from publish_all import run_dispatch

def parse_html_metadata(html_path):
    p = Path(html_path)
    if not p.exists():
        raise FileNotFoundError(f"Arquivo HTML não encontrado: {html_path}")

    content = p.read_text(encoding="utf-8", errors="replace")

    # Extrai Título
    title_match = re.search(r"<title>(.*?)</title>", content, re.IGNORECASE | re.DOTALL)
    title = title_match.group(1).strip() if title_match else p.parent.name.replace("-", " ").title()
    title = re.sub(r"\s*\|\s*Pombagiras\.com.*", "", title, flags=re.IGNORECASE).strip()

    # Extrai Descrição
    desc_match = re.search(r'<meta\s+name=["\']description["\']\s+content=["\'](.*?)["\']', content, re.IGNORECASE | re.DOTALL)
    if not desc_match:
        desc_match = re.search(r'<meta\s+property=["\']og:description["\']\s+content=["\'](.*?)["\']', content, re.IGNORECASE | re.DOTALL)
    description = unescape(desc_match.group(1).strip()) if desc_match else ""

    # Extrai Imagem OG
    img_match = re.search(r'<meta\s+property=["\']og:image["\']\s+content=["\'](.*?)["\']', content, re.IGNORECASE)
    image_url = img_match.group(1).strip() if img_match else None

    # Se não houver OG image ou for relativa, procura localmente
    if not image_url or not image_url.startswith("http"):
        for local_name in ["capa.png", "capa.jpg", "cover.png", "cover.jpg"]:
            local_img = p.parent / local_name
            if local_img.exists():
                image_url = f"https://pombagiras.com/{p.parent.name}/{local_name}"
                break

    # Canonical link
    canon_match = re.search(r'<link\s+rel=["\']canonical["\']\s+href=["\'](.*?)["\']', content, re.IGNORECASE)
    canonical_url = canon_match.group(1).strip() if canon_match else f"https://pombagiras.com/{p.parent.name}/"

    # Procura se há vídeo MP4 na pasta ou em reels/
    video_path = None
    for vid in p.parent.glob("*.mp4"):
        video_path = str(vid)
        break

    return {
        "title": title,
        "description": description,
        "image_url": image_url,
        "canonical_url": canonical_url,
        "video_path": video_path
    }

def dispatch_article(slug_or_path, custom_caption=None, dry_run=False):
    root_dir = Path(__file__).resolve().parent
    target_path = Path(slug_or_path)

    if not target_path.exists():
        target_path = root_dir / slug_or_path

    if target_path.is_dir():
        html_file = target_path / "index.html"
    else:
        html_file = target_path

    meta = parse_html_metadata(html_file)

    title = meta["title"]
    desc = meta["description"]
    link = meta["canonical_url"]
    image = meta["image_url"]
    video = meta["video_path"]

    # Monta a legenda sagrada oficial para o portal Pombagiras
    if custom_caption:
        caption = custom_caption
    else:
        caption = (
            f"✨ Novo Estudo Publicado: {title} 🥀🖤\n\n"
            f"{desc}\n\n"
            f"Laroyê às Guardiãs que nos sustentam com sabedoria, recolhimento e verdade!\n\n"
            f"📖 Leia o dossiê completo e acesse as referências no portal oficial:\n"
            f"👉 {link}\n\n"
            f"#Pombagira #AlmasDePombagira #Umbanda #Quimbanda #Espiritualidade #Ancestralidade"
        )

    print("=" * 70)
    print("🌹 DISPARO CIRÚRGICO DE NOVO ARTIGO - PORTAL POMBAGIRAS.COM 🌹")
    print("=" * 70)
    print(f"📖 Artigo: {title}")
    print(f"🔗 Link: {link}")
    print(f"🖼️ Imagem: {image}")
    if video:
        print(f"🎬 Vídeo: {video}")
    print(f"🛡️ Blindagem Ativa: @alexiamelusine (IG/Threads) PRESERVADA FORA DO ESCOPO.")
    print("=" * 70)

    # Dispara exclusivamente para a persona ALMAS
    run_dispatch(
        persona="almas",
        text=caption,
        image=image,
        video=video,
        link=link,
        title=f"Novo Estudo: {title}",
        tags="Pombagira,AlmasDePombagira,Umbanda,Quimbanda,Espiritualidade",
        dry_run=dry_run
    )

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Disparador automático de novos artigos do portal Pombagiras")
    parser.add_argument("article", help="Pasta do artigo ou caminho do arquivo index.html (ex: pombagira-que-nao-gosta-de-festas)")
    parser.add_argument("--caption", default=None, help="Legenda customizada (opcional)")
    parser.add_argument("--dry-run", action="store_true", help="Simula o disparo sem publicar de verdade")

    args = parser.parse_args()

    try:
        dispatch_article(args.article, custom_caption=args.caption, dry_run=args.dry_run)
    except Exception as e:
        print(f"[-] Erro no disparo do artigo: {e}", file=sys.stderr)
        sys.exit(1)
