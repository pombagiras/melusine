#!/usr/bin/env python3
"""
======================================================================
✨ POMBAGIRAS DIGITAL ECOSYSTEM - AD-HOC CUSTOM DISPATCHER ✨
======================================================================
Disparador cirúrgico para mensagens pontuais e sob demanda.
Permite escolher exatamente para onde enviar:
- telegram
- discord
- bluesky
- mastodon
- tumblr
- threads_almas / threads_alexia
- instagram_almas / instagram_alexia
- youtube
======================================================================
"""

import os
import sys
import argparse
from pathlib import Path

# Import specialized publishers
from publish_telegram import send_telegram
from publish_discord import send_discord
from publish_bluesky import get_bluesky_client
from publish_mastodon import get_mastodon_client
from publish_tumblr import get_tumblr_client
from publish_threads import publish_thread
from publish_instagram import publish_post
from publish_youtube import upload_short

def dispatch_custom(targets, text, image=None, video=None, link=None, title=None, tags=None, dry_run=False):
    target_list = [t.strip().lower() for t in targets.split(",") if t.strip()]

    print("=" * 70)
    print(f"🎯 DISPARO CIRÚRGICO PONTUAL - ALVOS: {target_list}")
    print("=" * 70)

    results = {}

    for t in target_list:
        if t == "telegram":
            print("[*] Enviando para Telegram...")
            if dry_run:
                results["Telegram"] = "SKIPPED (dry-run)"
            else:
                try:
                    tg_text = f"<b>{title or 'Mensagem'}</b>\n\n{text}"
                    if link:
                        tg_text += f"\n\n👉 <a href='{link}'>{link}</a>"
                    send_telegram(caption=tg_text, image_path_or_url=image)
                    results["Telegram"] = "OK"
                    print("  [+] Telegram: OK")
                except Exception as e:
                    results["Telegram"] = f"ERRO: {e}"
                    print(f"  [-] Telegram falhou: {e}")

        elif t == "discord":
            print("[*] Enviando para Discord...")
            if dry_run:
                results["Discord"] = "SKIPPED (dry-run)"
            else:
                try:
                    res_dc = send_discord(
                        title=title or "Mensagem Especial",
                        description=f"{text}\n\n🔗 {link}" if link else text,
                        image_url=image if (image and image.startswith("http")) else None,
                        link_url=link
                    )
                    results["Discord"] = f"OK (HTTP {res_dc})"
                    print("  [+] Discord: OK")
                except Exception as e:
                    results["Discord"] = f"ERRO: {e}"
                    print(f"  [-] Discord falhou: {e}")

        elif t in ["bluesky", "bsky"]:
            print("[*] Enviando para Bluesky (@almasdepombagira)...")
            if dry_run:
                results["Bluesky"] = "SKIPPED (dry-run)"
            else:
                try:
                    bsky = get_bluesky_client("almas")
                    res_b = bsky.post(text=text, image_path_or_url=image, link_url=link)
                    results["Bluesky"] = f"OK ({res_b.get('post_url')})"
                    print(f"  [+] Bluesky: {results['Bluesky']}")
                except Exception as e:
                    results["Bluesky"] = f"ERRO: {e}"
                    print(f"  [-] Bluesky falhou: {e}")

        elif t in ["mastodon", "masto"]:
            print("[*] Enviando para Mastodon (@alexiamelusine)...")
            if dry_run:
                results["Mastodon"] = "SKIPPED (dry-run)"
            else:
                try:
                    masto = get_mastodon_client()
                    res_m = masto.post_status(text=text, image_path_or_url=image)
                    results["Mastodon"] = f"OK ({res_m.get('url')})"
                    print(f"  [+] Mastodon: {results['Mastodon']}")
                except Exception as e:
                    results["Mastodon"] = f"ERRO: {e}"
                    print(f"  [-] Mastodon falhou: {e}")

        elif t in ["tumblr"]:
            print("[*] Enviando para Tumblr (alexiamelusine)...")
            if dry_run:
                results["Tumblr"] = "SKIPPED (dry-run)"
            else:
                try:
                    t_client = get_tumblr_client()
                    cap = f"<p>{text}</p>"
                    if link:
                        cap += f"<p><a href='{link}'>{link}</a></p>"
                    res_t = t_client.post_photo(caption=cap, image_path_or_url=image, tags=tags, click_link=link)
                    results["Tumblr"] = f"OK ({res_t.get('url')})"
                    print(f"  [+] Tumblr: {results['Tumblr']}")
                except Exception as e:
                    results["Tumblr"] = f"ERRO: {e}"
                    print(f"  [-] Tumblr falhou: {e}")

        elif t in ["threads_almas", "threads"]:
            print("[*] Enviando para Threads (@almasdepombagira)...")
            if dry_run:
                results["Threads (Almas)"] = "SKIPPED (dry-run)"
            else:
                try:
                    publish_thread(acc_key="almas", text=text, image_url=image)
                    results["Threads (Almas)"] = "OK"
                    print("  [+] Threads (Almas): OK")
                except Exception as e:
                    results["Threads (Almas)"] = f"ERRO: {e}"
                    print(f"  [-] Threads (Almas) falhou: {e}")

        elif t in ["threads_alexia", "threads_pride"]:
            print("[*] Enviando para Threads (@alexiamelusine - Pride)...")
            if dry_run:
                results["Threads (Alexia)"] = "SKIPPED (dry-run)"
            else:
                try:
                    publish_thread(acc_key="alexia", text=text, image_url=image)
                    results["Threads (Alexia)"] = "OK"
                    print("  [+] Threads (Alexia): OK")
                except Exception as e:
                    results["Threads (Alexia)"] = f"ERRO: {e}"
                    print(f"  [-] Threads (Alexia) falhou: {e}")

        elif t in ["youtube", "shorts"]:
            print("[*] Enviando para YouTube Shorts (@almasdepombagira)...")
            if dry_run:
                results["YouTube"] = "SKIPPED (dry-run)"
            else:
                try:
                    res_y = upload_short(video_path=video, title=title or text[:80], description=text, tags=tags)
                    results["YouTube"] = f"OK ({res_y.get('shorts_url')})"
                    print(f"  [+] YouTube: {results['YouTube']}")
                except Exception as e:
                    results["YouTube"] = f"ERRO: {e}"
                    print(f"  [-] YouTube falhou: {e}")

    print("\n" + "=" * 70)
    print("📊 RESUMO DO DISPARO PONTUAL")
    print("=" * 70)
    for net, status in results.items():
        icon = "✅" if status.startswith("OK") else ("⚠️" if "SKIPPED" in status else "❌")
        print(f"  {icon} {net:18}: {status}")
    print("=" * 70)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Disparador pontual e customizado para redes específicas")
    parser.add_argument("--to", required=True, help="Alvos separados por vírgula (ex: telegram,discord ou bsky,threads_almas)")
    parser.add_argument("--text", required=True, help="Texto da publicação")
    parser.add_argument("--image", default=None, help="Caminho local ou URL da imagem")
    parser.add_argument("--video", default=None, help="Caminho do vídeo MP4 (para YouTube/Reels)")
    parser.add_argument("--link", default=None, help="Link de destino")
    parser.add_argument("--title", default=None, help="Título do post / mensagem")
    parser.add_argument("--tags", default=None, help="Tags separadas por vírgula")
    parser.add_argument("--dry-run", action="store_true", help="Simula o envio sem publicar")

    args = parser.parse_args()

    dispatch_custom(
        targets=args.to,
        text=args.text,
        image=args.image,
        video=args.video,
        link=args.link,
        title=args.title,
        tags=args.tags,
        dry_run=args.dry_run
    )

