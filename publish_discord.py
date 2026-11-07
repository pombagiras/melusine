#!/usr/bin/env python3
"""
Pombagiras Portal - Discord Webhook Publisher
Envia publicações ricas com embeds dourados/carmesim para o servidor do Discord.
"""

import os
import sys
import json
import uuid
import argparse
import urllib.request
import urllib.parse
from pathlib import Path

ENV_PATH = Path(__file__).resolve().parent / ".env"

def load_env():
    env = {}
    if ENV_PATH.exists():
        with open(ENV_PATH, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    k, v = line.split("=", 1)
                    env[k.strip()] = v.strip()
    return env

def send_discord(title, description, image_url=None, link_url=None, color=0x8B0000):
    env = load_env()
    webhook_url = env.get("DISCORD_WEBHOOK_URL")
    if not webhook_url:
        raise ValueError("DISCORD_WEBHOOK_URL não configurada no .env!")

    embed = {
        "title": title,
        "description": description,
        "color": color,
        "footer": {
            "text": "Pombagiras.com • Memória, Tradição e Cultura"
        }
    }

    if link_url:
        embed["url"] = link_url

    if image_url:
        embed["image"] = {"url": image_url}

    payload = {
        "username": "Pombagiras.com | Alexia Melusine",
        "avatar_url": "https://pombagiras.com/apple-touch-icon.png",
        "embeds": [embed]
    }

    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        webhook_url,
        data=data,
        headers={"Content-Type": "application/json", "User-Agent": "PombagirasPublisher/1.0"},
        method="POST"
    )

    with urllib.request.urlopen(req, timeout=30) as resp:
        # Discord returns 204 No Content on success
        return resp.status

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Publicador oficial do Discord Webhook")
    parser.add_argument("--title", required=True, help="Título do embed")
    parser.add_argument("--text", required=True, help="Texto descritivo")
    parser.add_argument("--image", default=None, help="URL pública da imagem")
    parser.add_argument("--link", default=None, help="Link do artigo / página")

    args = parser.parse_args()

    try:
        print("[*] Enviando notificacao para o Discord...")
        status = send_discord(title=args.title, description=args.text, image_url=args.image, link_url=args.link)
        print(f"[+] Notificação entregue com sucesso no Discord! (HTTP {status})")
    except Exception as e:
        print(f"[-] Erro ao enviar para o Discord: {e}", file=sys.stderr)
        sys.exit(1)
