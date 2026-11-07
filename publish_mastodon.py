#!/usr/bin/env python3
"""
Pombagiras Portal - Mastodon API Publisher
Gerenciador automatizado de publicações no Mastodon para @alexiamelusine
Instância padrão: https://mastodon.social

Suporta:
- Publicação de status (toots) de até 500 caracteres
- Upload de imagens (JPG, PNG, WebP) com texto alternativo (alt text / description)
- URLs automáticas e hashtags nativas
"""

import os
import sys
import json
import time
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

def build_multipart_form(fields, files):
    boundary = f"----MastodonBoundary{uuid.uuid4().hex}"
    body = bytearray()
    
    for name, value in fields.items():
        if value is None:
            continue
        body.extend(f"--{boundary}\r\n".encode("utf-8"))
        body.extend(f'Content-Disposition: form-data; name="{name}"\r\n\r\n'.encode("utf-8"))
        body.extend(str(value).encode("utf-8"))
        body.extend(b"\r\n")

    for name, (filename, content, content_type) in files.items():
        body.extend(f"--{boundary}\r\n".encode("utf-8"))
        body.extend(f'Content-Disposition: form-data; name="{name}"; filename="{filename}"\r\n'.encode("utf-8"))
        body.extend(f"Content-Type: {content_type}\r\n\r\n".encode("utf-8"))
        body.extend(content)
        body.extend(b"\r\n")

    body.extend(f"--{boundary}--\r\n".encode("utf-8"))
    return bytes(body), f"multipart/form-data; boundary={boundary}"

class MastodonClient:
    def __init__(self, access_token, instance_url="https://mastodon.social"):
        self.access_token = access_token
        self.instance_url = instance_url.rstrip("/")

    def verify_credentials(self):
        url = f"{self.instance_url}/api/v1/accounts/verify_credentials"
        req = urllib.request.Request(url, headers={"Authorization": f"Bearer {self.access_token}"})
        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                return data
        except urllib.error.HTTPError as e:
            err = e.read().decode("utf-8", errors="replace")
            raise RuntimeError(f"Erro ao autenticar no Mastodon (HTTP {e.code}): {err}")

    def upload_media(self, image_path_or_url, description=None):
        url = f"{self.instance_url}/api/v1/media"
        
        # Obter bytes da imagem
        filename = "image.jpg"
        content_type = "image/jpeg"
        if image_path_or_url.startswith("http://") or image_path_or_url.startswith("https://"):
            req_img = urllib.request.Request(image_path_or_url, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req_img, timeout=30) as resp:
                content = resp.read()
                filename = image_path_or_url.split("/")[-1] or "image.jpg"
                content_type = resp.headers.get("Content-Type", "image/jpeg").split(";")[0]
        else:
            p = Path(image_path_or_url)
            if not p.exists():
                raise FileNotFoundError(f"Imagem não encontrada: {image_path_or_url}")
            content = p.read_bytes()
            filename = p.name
            if p.suffix.lower() == ".png":
                content_type = "image/png"
            elif p.suffix.lower() == ".webp":
                content_type = "image/webp"

        fields = {}
        if description:
            fields["description"] = description

        files = {
            "file": (filename, content, content_type)
        }

        body, content_header = build_multipart_form(fields, files)
        req = urllib.request.Request(url, data=body, method="POST")
        req.add_header("Authorization", f"Bearer {self.access_token}")
        req.add_header("Content-Type", content_header)

        with urllib.request.urlopen(req, timeout=60) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            return data.get("id")

    def post_status(self, text, image_path_or_url=None, alt_text=None, visibility="public"):
        media_ids = []
        if image_path_or_url:
            print("[*] Enviando imagem para o Mastodon...")
            media_id = self.upload_media(image_path_or_url, description=alt_text)
            media_ids.append(media_id)
            print(f"[+] Imagem processada com sucesso (Media ID: {media_id})")

        url = f"{self.instance_url}/api/v1/statuses"
        payload = {
            "status": text,
            "visibility": visibility
        }
        if media_ids:
            payload["media_ids"] = media_ids

        data = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(url, data=data, method="POST")
        req.add_header("Authorization", f"Bearer {self.access_token}")
        req.add_header("Content-Type", "application/json")

        with urllib.request.urlopen(req, timeout=30) as resp:
            res = json.loads(resp.read().decode("utf-8"))
            return res

def get_mastodon_client():
    env = load_env()
    token = env.get("MASTODON_ACCESS_TOKEN") or env.get("MASTODON_ALEXIA_TOKEN")
    instance = env.get("MASTODON_INSTANCE", "https://mastodon.social")
    if not token:
        raise ValueError(
            "MASTODON_ACCESS_TOKEN não encontrado no .env! "
            "Gere o token em: https://mastodon.social/settings/applications"
        )
    return MastodonClient(access_token=token, instance_url=instance)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Publicador oficial do Mastodon")
    parser.add_argument("--text", required=True, help="Texto da publicação (até 500 caracteres)")
    parser.add_argument("--image", default=None, help="Caminho local ou URL da imagem")
    parser.add_argument("--alt", default=None, help="Texto descritivo / alt da imagem")
    parser.add_argument("--visibility", default="public", choices=["public", "unlisted", "private", "direct"])

    args = parser.parse_args()

    try:
        client = get_mastodon_client()
        acc = client.verify_credentials()
        print(f"[*] Autenticado com sucesso como @{acc.get('username')} ({acc.get('url')})")
        print("[*] Publicando no Mastodon...")
        res = client.post_status(
            text=args.text,
            image_path_or_url=args.image,
            alt_text=args.alt,
            visibility=args.visibility
        )
        print(f"[+] Publicação realizada com sucesso!")
        print(f"[+] Link público: {res.get('url')}")
    except Exception as e:
        print(f"[-] Erro ao publicar no Mastodon: {e}", file=sys.stderr)
        sys.exit(1)

