#!/usr/bin/env python3
"""
======================================================================
✨ POMBAGIRAS DIGITAL ECOSYSTEM - MEDIUM ARTICLE PUBLISHER ✨
======================================================================
Publicador automatizado de ensaios e dossiês no Medium (@alexiamelusine)
com suporte nativo a:
- Formato Markdown ou HTML
- Canonical URL (protegendo o SEO do portal pombagiras.com)
- Tags temáticas automáticas (até 5 tags)
- Status de publicação: 'public', 'draft' ou 'unlisted'
======================================================================
"""

import os
import sys
import json
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

class MediumClient:
    BASE_URL = "https://api.medium.com/v1"

    def __init__(self, token=None):
        env = load_env()
        self.token = token or env.get("MEDIUM_INTEGRATION_TOKEN")
        if not self.token:
            raise ValueError(
                "MEDIUM_INTEGRATION_TOKEN não encontrado no .env! "
                "Gere seu token em: https://medium.com/me/settings/security"
            )
        self.user_id = None
        self.username = None

    def _request(self, endpoint, method="GET", payload=None):
        url = f"{self.BASE_URL}/{endpoint.lstrip('/')}"
        headers = {
            "Authorization": f"Bearer {self.token}",
            "Accept": "application/json",
            "User-Agent": "PombagirasPublisher/1.0"
        }
        
        data = None
        if payload is not None:
            data = json.dumps(payload).encode("utf-8")
            headers["Content-Type"] = "application/json"

        req = urllib.request.Request(url, data=data, headers=headers, method=method)
        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                raw = resp.read().decode("utf-8")
                return json.loads(raw)
        except urllib.error.HTTPError as e:
            err_body = e.read().decode("utf-8", errors="replace")
            raise RuntimeError(f"Erro na API do Medium (HTTP {e.code}): {err_body}")

    def get_user_profile(self):
        res = self._request("me")
        data = res.get("data", {})
        self.user_id = data.get("id")
        self.username = data.get("username")
        return data

    def publish_article(self, title, content, canonical_url=None, tags=None, content_format="markdown", publish_status="public"):
        if not self.user_id:
            self.get_user_profile()

        clean_tags = []
        if tags:
            if isinstance(tags, str):
                clean_tags = [t.strip().replace("#", "") for t in tags.split(",") if t.strip()][:5]
            elif isinstance(tags, list):
                clean_tags = [str(t).strip().replace("#", "") for t in tags][:5]

        payload = {
            "title": title,
            "contentFormat": content_format,
            "content": content,
            "publishStatus": publish_status
        }

        if canonical_url:
            payload["canonicalUrl"] = canonical_url

        if clean_tags:
            payload["tags"] = clean_tags

        res = self._request(f"users/{self.user_id}/posts", method="POST", payload=payload)
        post_data = res.get("data", {})
        return {
            "id": post_data.get("id"),
            "title": post_data.get("title"),
            "url": post_data.get("url"),
            "canonicalUrl": post_data.get("canonicalUrl"),
            "publishStatus": post_data.get("publishStatus")
        }

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Publicador oficial do Medium")
    parser.add_argument("--title", required=True, help="Título do artigo")
    parser.add_argument("--file", default=None, help="Caminho do arquivo Markdown ou HTML local")
    parser.add_argument("--content", default=None, help="Texto direto em Markdown ou HTML")
    parser.add_argument("--canonical", default=None, help="URL canônica do artigo no portal pombagiras.com")
    parser.add_argument("--tags", default="Pombagira,Umbanda,Quimbanda,Espiritualidade,AlexiaMelusine", help="Tags separadas por vírgula (máx 5)")
    parser.add_argument("--status", default="public", choices=["public", "draft", "unlisted"], help="Status de publicação")
    parser.add_argument("--format", default="markdown", choices=["markdown", "html"], help="Formato do conteúdo")

    args = parser.parse_args()

    body_text = args.content
    if args.file:
        p = Path(args.file)
        if not p.exists():
            print(f"[-] Arquivo não encontrado: {args.file}", file=sys.stderr)
            sys.exit(1)
        body_text = p.read_text(encoding="utf-8")

    if not body_text:
        print("[-] Erro: Você deve passar --content ou --file com o texto do artigo!", file=sys.stderr)
        sys.exit(1)

    try:
        client = MediumClient()
        prof = client.get_user_profile()
        print(f"[*] Autenticado com sucesso no Medium como: {prof.get('name')} (@{prof.get('username')})")
        print(f"[*] Publicando artigo '{args.title}'...")
        res = client.publish_article(
            title=args.title,
            content=body_text,
            canonical_url=args.canonical,
            tags=args.tags,
            content_format=args.format,
            publish_status=args.status
        )
        print(f"[+] Artigo publicado com sucesso no Medium!")
        print(f"[+] Link do post: {res.get('url')}")
        if res.get("canonicalUrl"):
            print(f"[+] Canonical URL (SEO): {res.get('canonicalUrl')}")
    except Exception as e:
        print(f"[-] Erro ao publicar no Medium: {e}", file=sys.stderr)
        sys.exit(1)

