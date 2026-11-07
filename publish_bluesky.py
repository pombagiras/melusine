#!/usr/bin/env python3
"""
Pombagiras Portal - Bluesky API Publisher (AT Protocol)
Gerenciador automatizado de publicações no Bluesky para:
- @almasdepombagira.bsky.social
- @alexiamelusine.bsky.social (se configurado)

Utiliza a API REST nativa do AT Protocol (sem dependências externas pesadas).
Suporta:
- Postagens de texto puro
- Links clicáveis automáticos e hashtags (facets nativas com cálculo UTF-8)
- Upload de imagens (JPG, PNG, WebP) com texto alternativo (alt text)
- Cards de preview de links externos (embed external)
"""

import os
import sys
import json
import time
import re
import argparse
import urllib.request
import urllib.parse
import io
from datetime import datetime, timezone
from pathlib import Path
from PIL import Image

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

def make_request(url, method="GET", headers=None, data=None):
    if headers is None:
        headers = {}
    req = urllib.request.Request(url, method=method)
    for k, v in headers.items():
        req.add_header(k, v)
    
    body = None
    if data is not None:
        if isinstance(data, (dict, list)):
            body = json.dumps(data).encode("utf-8")
            if "Content-Type" not in headers:
                req.add_header("Content-Type", "application/json")
        elif isinstance(data, (bytes, bytearray)):
            body = data
        else:
            body = str(data).encode("utf-8")
            
    try:
        with urllib.request.urlopen(req, data=body, timeout=30) as resp:
            content_type = resp.headers.get("Content-Type", "")
            raw = resp.read()
            if "application/json" in content_type:
                return json.loads(raw.decode("utf-8"))
            return raw
    except urllib.error.HTTPError as e:
        err_body = e.read().decode("utf-8", errors="replace")
        try:
            err_json = json.loads(err_body)
            raise RuntimeError(f"HTTP {e.code}: {err_json.get('error', '')} - {err_json.get('message', err_body)}")
        except Exception:
            raise RuntimeError(f"HTTP {e.code} Error: {err_body}")

class BlueskyClient:
    def __init__(self, identifier, password, pds_url="https://bsky.social"):
        self.identifier = identifier
        self.password = password
        self.pds_url = pds_url.rstrip("/")
        self.did = None
        self.handle = None
        self.access_jwt = None
        self.login()

    def login(self):
        url = f"{self.pds_url}/xrpc/com.atproto.server.createSession"
        payload = {
            "identifier": self.identifier,
            "password": self.password
        }
        res = make_request(url, method="POST", data=payload)
        self.did = res.get("did")
        self.handle = res.get("handle")
        self.access_jwt = res.get("accessJwt")
        return self

    def upload_blob(self, image_bytes, content_type="image/jpeg"):
        url = f"{self.pds_url}/xrpc/com.atproto.repo.uploadBlob"
        headers = {
            "Authorization": f"Bearer {self.access_jwt}",
            "Content-Type": content_type
        }
        res = make_request(url, method="POST", headers=headers, data=image_bytes)
        return res.get("blob")

    def _extract_facets(self, text):
        """
        Calcula byte offsets em UTF-8 para URLs e hashtags,
        permitindo links clicáveis perfeitos no Bluesky.
        """
        facets = []
        text_bytes = text.encode("utf-8")

        # 1. URLs
        url_regex = re.compile(r"https?://[^\s()<>]+(?:\([\w\d]+\)|([^[:punct:]\s]|/))")
        for match in url_regex.finditer(text):
            url_str = match.group(0)
            # Find UTF-8 byte start and end
            byte_start = len(text[:match.start()].encode("utf-8"))
            byte_end = byte_start + len(url_str.encode("utf-8"))
            facets.append({
                "index": {
                    "byteStart": byte_start,
                    "byteEnd": byte_end
                },
                "features": [{
                    "$type": "app.bsky.richtext.facet#link",
                    "uri": url_str
                }]
            })

        # 2. Hashtags
        tag_regex = re.compile(r"(?:^|\s)(#[a-zA-Z0-9_\u00C0-\u00FF]+)")
        for match in tag_regex.finditer(text):
            tag_token = match.group(1)
            clean_tag = tag_token[1:] # remove #
            tag_start_char = match.start(1)
            byte_start = len(text[:tag_start_char].encode("utf-8"))
            byte_end = byte_start + len(tag_token.encode("utf-8"))
            facets.append({
                "index": {
                    "byteStart": byte_start,
                    "byteEnd": byte_end
                },
                "features": [{
                    "$type": "app.bsky.richtext.facet#tag",
                    "tag": clean_tag
                }]
            })

        return facets

    def _prepare_image(self, img_bytes, original_content_type="image/jpeg", max_bytes=950000):
        if len(img_bytes) <= max_bytes and original_content_type in ["image/jpeg", "image/png", "image/webp"]:
            return img_bytes, original_content_type

        # Compress/resize to fit under 950KB for Bluesky AT Protocol limit
        img = Image.open(io.BytesIO(img_bytes))
        if img.mode in ("RGBA", "P"):
            # Create white background for transparency
            background = Image.new("RGB", img.size, (15, 10, 15))
            if img.mode == "RGBA":
                background.paste(img, mask=img.split()[3])
            else:
                background.paste(img)
            img = background
        elif img.mode != "RGB":
            img = img.convert("RGB")

        for quality in [90, 80, 70, 60, 50]:
            buf = io.BytesIO()
            img.save(buf, format="JPEG", quality=quality, optimize=True)
            data = buf.getvalue()
            if len(data) <= max_bytes:
                return data, "image/jpeg"

        # If still too large, downsample dimensions
        img.thumbnail((1200, 1200), Image.Resampling.LANCZOS)
        buf = io.BytesIO()
        img.save(buf, format="JPEG", quality=75, optimize=True)
        return buf.getvalue(), "image/jpeg"

    def post(self, text, image_path_or_url=None, alt_text=None, link_url=None, link_title=None, link_desc=None):
        if len(text) > 300:
            print(f"[!] AVISO: O texto possui {len(text)} caracteres. O Bluesky aceita no maximo 300 caracteres.")

        facets = self._extract_facets(text)
        created_at = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")

        record = {
            "$type": "app.bsky.feed.post",
            "text": text,
            "createdAt": created_at
        }
        if facets:
            record["facets"] = facets

        # Handle image upload
        if image_path_or_url:
            raw_bytes = None
            detected_type = "image/jpeg"
            
            if image_path_or_url.startswith("http://") or image_path_or_url.startswith("https://"):
                req = urllib.request.Request(image_path_or_url, headers={"User-Agent": "Mozilla/5.0"})
                with urllib.request.urlopen(req) as resp:
                    raw_bytes = resp.read()
                    detected_type = resp.headers.get("Content-Type", "image/jpeg").split(";")[0]
            else:
                p = Path(image_path_or_url)
                if not p.exists():
                    raise FileNotFoundError(f"Imagem local não encontrada: {image_path_or_url}")
                raw_bytes = p.read_bytes()
                if p.suffix.lower() == ".png":
                    detected_type = "image/png"
                elif p.suffix.lower() == ".webp":
                    detected_type = "image/webp"

            img_bytes, content_type = self._prepare_image(raw_bytes, detected_type)
            blob = self.upload_blob(img_bytes, content_type=content_type)
            record["embed"] = {
                "$type": "app.bsky.embed.images",
                "images": [{
                    "alt": alt_text or "Imagem de @almasdepombagira",
                    "image": blob
                }]
            }
        elif link_url:
            # External link card
            record["embed"] = {
                "$type": "app.bsky.embed.external",
                "external": {
                    "uri": link_url,
                    "title": link_title or link_url,
                    "description": link_desc or ""
                }
            }

        url = f"{self.pds_url}/xrpc/com.atproto.repo.createRecord"
        headers = {
            "Authorization": f"Bearer {self.access_jwt}",
            "Content-Type": "application/json"
        }
        payload = {
            "repo": self.did,
            "collection": "app.bsky.feed.post",
            "record": record
        }

        res = make_request(url, method="POST", headers=headers, data=payload)
        uri = res.get("uri", "")
        rkey = uri.split("/")[-1]
        post_url = f"https://bsky.app/profile/{self.handle}/post/{rkey}"
        return {
            "uri": uri,
            "cid": res.get("cid"),
            "post_url": post_url
        }

def get_bluesky_client(account="almas"):
    env = load_env()
    prefix = f"BLUESKY_{account.upper()}_"
    handle = env.get(f"{prefix}HANDLE") or env.get("BLUESKY_HANDLE")
    password = env.get(f"{prefix}APP_PASSWORD") or env.get("BLUESKY_APP_PASSWORD")

    if not handle or not password:
        raise ValueError(
            f"Credenciais do Bluesky para '{account}' não encontradas no .env! "
            f"Defina {prefix}HANDLE (ex: almasdepombagira.bsky.social) e {prefix}APP_PASSWORD."
        )

    return BlueskyClient(identifier=handle, password=password)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Publicador oficial do Bluesky (AT Protocol)")
    parser.add_argument("--account", default="almas", choices=["almas", "alexia"], help="Conta para publicar")
    parser.add_argument("--text", required=True, help="Texto da publicação")
    parser.add_argument("--image", default=None, help="Caminho local ou URL da imagem")
    parser.add_argument("--alt", default=None, help="Texto descritivo / alt da imagem")
    parser.add_argument("--link", default=None, help="URL de link externo para card de preview")
    parser.add_argument("--title", default=None, help="Título do card de preview")
    parser.add_argument("--desc", default=None, help="Descrição do card de preview")

    args = parser.parse_args()

    try:
        client = get_bluesky_client(args.account)
        print(f"[*] Sessao iniciada com sucesso como @{client.handle} ({client.did})")
        print(f"[*] Publicando no Bluesky...")
        result = client.post(
            text=args.text,
            image_path_or_url=args.image,
            alt_text=args.alt,
            link_url=args.link,
            link_title=args.title,
            link_desc=args.desc
        )
        print(f"[+] Publicacao realizada com sucesso!")
        print(f"[+] Link publico: {result['post_url']}")
    except Exception as e:
        print(f"[-] Erro ao publicar no Bluesky: {e}", file=sys.stderr)
        sys.exit(1)

