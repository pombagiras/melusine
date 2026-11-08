#!/usr/bin/env python3
"""
======================================================================
✨ POMBAGIRAS DIGITAL ECOSYSTEM - MASTER MULTI-PUBLISHER (PUBLISH_ALL) ✨
======================================================================
Publicador centralizado para:
1. Instagram (@almasdepombagira & @alexiamelusine)
2. Threads (@almasdepombagira & @alexiamelusine)
3. Bluesky (@almasdepombagira.bsky.social)
4. Mastodon (@alexiamelusine@mastodon.social)
5. Tumblr (alexiamelusine.tumblr.com)
6. Telegram (Canal Oficial)
7. Discord (Webhook Oficial)
======================================================================
"""

import os
import sys
import argparse
import time
from pathlib import Path

# Import individual specialized publishers
from publish_instagram import publish_post as ig_post
from publish_threads import publish_thread as th_post
from publish_bluesky import get_bluesky_client
from publish_mastodon import get_mastodon_client
from publish_tumblr import get_tumblr_client
from publish_telegram import send_telegram
from publish_discord import send_discord
from publish_youtube import upload_short as yt_upload

def smart_truncate(text, max_len=300, link=None, tags=None):
    """
    Trunca o texto respeitando o limite da rede, mantendo sentido completo,
    link e hashtags no final.
    """
    suffix_parts = []
    if link:
        suffix_parts.append(f"\n\n{link}")
    if tags:
        if isinstance(tags, list):
            tag_str = " ".join([t if t.startswith("#") else f"#{t}" for t in tags[:4]])
        else:
            tag_str = tags
        suffix_parts.append(f"\n\n{tag_str}")

    suffix = "".join(suffix_parts)
    available_chars = max_len - len(suffix) - 3 # para reticências
    
    if len(text) + len(suffix) <= max_len:
        return f"{text}{suffix}".strip()

    truncated = text[:available_chars]
    last_space = truncated.rfind(" ")
    if last_space > 0:
        truncated = truncated[:last_space]

    return f"{truncated}...{suffix}".strip()

def run_dispatch(persona="almas", text="", image=None, video=None, link=None, title=None, tags=None, dry_run=False):
    print("=" * 70)
    print(f"🔮 DISPARADOR CENTRAL MULTIPLATAFORMA - PERSONA: [{persona.upper()}]")
    print("=" * 70)
    
    results = {}
    
    # 1. Instagram
    print(f"\n[1/6] 📸 INSTAGRAM ({persona})...")
    if dry_run:
        print(f"  [DRY-RUN] Publicaria em Instagram para '{persona}'")
        results["Instagram"] = "SKIPPED (dry-run)"
    else:
        try:
            # Instagram precisa de URL pública para feed
            ig_img = image
            if image and not (image.startswith("http://") or image.startswith("https://")):
                print("  [!] Aviso: Instagram Graph API requer URL pública na internet.")
            res_ig = ig_post(account=persona, image_url=ig_img, caption=f"{text}\n\n👉 {link or 'pombagiras.com'}")
            results["Instagram"] = f"OK (Media ID: {res_ig.get('id')})"
            print(f"  [+] Instagram: {results['Instagram']}")
        except Exception as e:
            results["Instagram"] = f"ERRO: {e}"
            print(f"  [-] Instagram falhou: {e}")

    # 2. Threads
    print(f"\n[2/6] 🧵 THREADS ({persona})...")
    threads_text = smart_truncate(text, max_len=490, link=link)
    if dry_run:
        print(f"  [DRY-RUN] Texto Threads ({len(threads_text)}c):\n  {threads_text}")
        results["Threads"] = "SKIPPED (dry-run)"
    else:
        try:
            res_th = th_post(acc_key=persona, text=threads_text, image_url=image)
            results["Threads"] = "OK" if res_th else "FALHA"
            print(f"  [+] Threads: {results['Threads']}")
        except Exception as e:
            results["Threads"] = f"ERRO: {e}"
            print(f"  [-] Threads falhou: {e}")

    # 3. Bluesky (Persona Almas ou All)
    if persona in ["almas", "all"]:
        print(f"\n[3/6] 🦋 BLUESKY (@almasdepombagira.bsky.social)...")
        bsky_text = smart_truncate(text, max_len=295, link=link, tags=tags)
        if dry_run:
            print(f"  [DRY-RUN] Texto Bluesky ({len(bsky_text)}c):\n  {bsky_text}")
            results["Bluesky"] = "SKIPPED (dry-run)"
        else:
            try:
                bsky_client = get_bluesky_client("almas")
                res_bsky = bsky_client.post(text=bsky_text, image_path_or_url=image, link_url=link)
                results["Bluesky"] = f"OK ({res_bsky.get('post_url')})"
                print(f"  [+] Bluesky: {results['Bluesky']}")
            except Exception as e:
                results["Bluesky"] = f"ERRO: {e}"
                print(f"  [-] Bluesky falhou: {e}")

    # 4. Mastodon (Persona Alexia ou All)
    if persona in ["alexia", "all"]:
        print(f"\n[4/6] 🐘 MASTODON (@alexiamelusine@mastodon.social)...")
        masto_text = smart_truncate(text, max_len=495, link=link, tags=tags)
        if dry_run:
            print(f"  [DRY-RUN] Texto Mastodon ({len(masto_text)}c):\n  {masto_text}")
            results["Mastodon"] = "SKIPPED (dry-run)"
        else:
            try:
                masto_client = get_mastodon_client()
                res_masto = masto_client.post_status(text=masto_text, image_path_or_url=image)
                results["Mastodon"] = f"OK ({res_masto.get('url')})"
                print(f"  [+] Mastodon: {results['Mastodon']}")
            except Exception as e:
                results["Mastodon"] = f"ERRO: {e}"
                print(f"  [-] Mastodon falhou: {e}")

    # 5. Tumblr (Persona Alexia ou All)
    if persona in ["alexia", "all"]:
        print(f"\n[5/6] 🥀 TUMBLR (alexiamelusine.tumblr.com)...")
        if dry_run:
            print(f"  [DRY-RUN] Publicaria no Tumblr com imagem {image}")
            results["Tumblr"] = "SKIPPED (dry-run)"
        else:
            try:
                tumblr_client = get_tumblr_client()
                caption_html = f"<p>{text}</p>"
                if link:
                    caption_html += f"<p><a href='{link}'>{link}</a></p>"
                res_tumblr = tumblr_client.post_photo(
                    caption=caption_html,
                    image_path_or_url=image,
                    tags=tags or "AlexiaMelusine,Pride,DigitalArt,OccultArt",
                    click_link=link
                )
                results["Tumblr"] = f"OK ({res_tumblr.get('url')})"
                print(f"  [+] Tumblr: {results['Tumblr']}")
            except Exception as e:
                results["Tumblr"] = f"ERRO: {e}"
                print(f"  [-] Tumblr falhou: {e}")

    # 6. Telegram (Canal Oficial)
    print(f"\n[6/6] ✈️ TELEGRAM & DISCORD...")
    if dry_run:
        print("  [DRY-RUN] Enviaria para Telegram e Discord")
        results["Telegram"] = "SKIPPED (dry-run)"
        results["Discord"] = "SKIPPED (dry-run)"
    else:
        # Telegram
        try:
            tg_text = f"<b>{title or 'Novo Dossiê Pombagiras'}</b>\n\n{text}\n\n👉 <a href='{link or 'https://pombagiras.com'}'>Leia completo aqui</a>"
            res_tg = send_telegram(caption=tg_text, image_path_or_url=image)
            results["Telegram"] = "OK"
            print("  [+] Telegram: OK")
        except Exception as e:
            results["Telegram"] = f"ERRO: {e}"
            print(f"  [-] Telegram falhou: {e}")

        # Discord
        try:
            res_dc = send_discord(
                title=title or "Novo Conteúdo Pombagiras",
                description=f"{text}\n\n🔗 [Acesse o Portal]({link or 'https://pombagiras.com'})",
                image_url=image if (image and image.startswith("http")) else None,
                link_url=link
            )
            results["Discord"] = f"OK (HTTP {res_dc})"
            print("  [+] Discord: OK")
        except Exception as e:
            results["Discord"] = f"ERRO: {e}"
            print(f"  [-] Discord falhou: {e}")

    # 7. YouTube Shorts (se vídeo for fornecido)
    if video:
        print(f"\n[7/7] 🎬 YOUTUBE SHORTS (@almasdepombagira)...")
        if dry_run:
            print(f"  [DRY-RUN] Enviaria vídeo {video} para o YouTube Shorts")
            results["YouTube"] = "SKIPPED (dry-run)"
        else:
            try:
                res_yt = yt_upload(
                    video_path=video,
                    title=title or text[:80],
                    description=f"{text}\n\n👉 {link or 'https://pombagiras.com'}",
                    tags=tags
                )
                results["YouTube"] = f"OK ({res_yt.get('shorts_url')})"
                print(f"  [+] YouTube Shorts: {results['YouTube']}")
            except Exception as e:
                results["YouTube"] = f"ERRO: {e}"
                print(f"  [-] YouTube Shorts falhou: {e}")

    print("\n" + "=" * 70)
    print("📊 RESUMO GERAL DO DISPARO")
    print("=" * 70)
    for net, status in results.items():
        icon = "✅" if status.startswith("OK") else ("⚠️" if "SKIPPED" in status else "❌")
        print(f"  {icon} {net:12}: {status}")
    print("=" * 70)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Master Multi-Publisher Pombagiras Digital")
    parser.add_argument("--persona", default="almas", choices=["almas", "alexia", "all"], help="Persona/conta a disparar")
    parser.add_argument("--text", required=True, help="Texto principal do post")
    parser.add_argument("--image", default=None, help="Imagem (URL pública ou caminho local)")
    parser.add_argument("--video", default=None, help="Vídeo MP4 local para YouTube Shorts / Reels")
    parser.add_argument("--link", default="https://pombagiras.com", help="Link do artigo ou portal")
    parser.add_argument("--title", default=None, help="Título do post (para YouTube/Telegram/Discord)")
    parser.add_argument("--tags", default=None, help="Hashtags separadas por vírgula")
    parser.add_argument("--dry-run", action="store_true", help="Simula o disparo sem publicar de verdade")

    args = parser.parse_args()

    run_dispatch(
        persona=args.persona,
        text=args.text,
        image=args.image,
        video=args.video,
        link=args.link,
        title=args.title,
        tags=args.tags,
        dry_run=args.dry_run
    )
