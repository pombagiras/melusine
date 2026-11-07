#!/usr/bin/env python3
"""
Pombagiras Portal - Tumblr API Publisher (OAuth 1.0a)
Gerenciador automatizado de publicações no Tumblr para alexiamelusine.tumblr.com

Suporta:
- Postagens de Foto com texto formatado e tags
- Upload de imagens locais (base64 ou multipart) ou URLs
- Link de redirecionamento (click-through URL) para o portal/site oficial
"""

import os
import sys
import json
import time
import hmac
import hashlib
import base64
import secrets
import argparse
import urllib.parse
import urllib.request
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

def sign_request(method, url, params, consumer_secret, token_secret=""):
    encoded_params = sorted([(urllib.parse.quote(str(k), safe=""), urllib.parse.quote(str(v), safe="")) for k, v in params.items()])
    param_string = "&".join([f"{k}={v}" for k, v in encoded_params])
    base_url = url.split("?")[0]
    base_string = "&".join([
        method.upper(),
        urllib.parse.quote(base_url, safe=""),
        urllib.parse.quote(param_string, safe="")
    ])
    signing_key = f"{urllib.parse.quote(consumer_secret, safe='')}&{urllib.parse.quote(token_secret, safe='')}".encode("utf-8")
    return base64.b64encode(hmac.new(signing_key, base_string.encode("utf-8"), hashlib.sha1).digest()).decode("utf-8")

def get_oauth_header(params):
    header_parts = [f'{urllib.parse.quote(k, safe="")}="{urllib.parse.quote(v, safe="")}"' for k, v in sorted(params.items()) if k.startswith("oauth_")]
    return f"OAuth {', '.join(header_parts)}"

class TumblrClient:
    def __init__(self, consumer_key, consumer_secret, token, token_secret, blog_identifier="alexiamelusine"):
        self.consumer_key = consumer_key
        self.consumer_secret = consumer_secret
        self.token = token
        self.token_secret = token_secret
        self.blog = blog_identifier.replace(".tumblr.com", "") + ".tumblr.com"

    def get_user_info(self):
        url = "https://api.tumblr.com/v2/user/info"
        oauth_params = {
            "oauth_consumer_key": self.consumer_key,
            "oauth_nonce": secrets.token_hex(16),
            "oauth_signature_method": "HMAC-SHA1",
            "oauth_timestamp": str(int(time.time())),
            "oauth_token": self.token,
            "oauth_version": "1.0"
        }
        sig = sign_request("GET", url, oauth_params, self.consumer_secret, self.token_secret)
        oauth_params["oauth_signature"] = sig
        headers = {
            "Authorization": get_oauth_header(oauth_params),
            "User-Agent": "PombagirasPublisher/1.0"
        }
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=30) as resp:
            return json.loads(resp.read().decode("utf-8"))

    def post_photo(self, caption, image_path_or_url, tags=None, click_link=None):
        url = f"https://api.tumblr.com/v2/blog/{self.blog}/post"
        
        post_params = {
            "type": "photo",
            "caption": caption
        }
        
        if tags:
            if isinstance(tags, list):
                post_params["tags"] = ",".join(tags)
            else:
                post_params["tags"] = tags

        if click_link:
            post_params["link_url"] = click_link

        # Image source handling
        if image_path_or_url.startswith("http://") or image_path_or_url.startswith("https://"):
            post_params["source"] = image_path_or_url
        else:
            p = Path(image_path_or_url)
            if not p.exists():
                raise FileNotFoundError(f"Imagem local não encontrada: {image_path_or_url}")
            img_b64 = base64.b64encode(p.read_bytes()).decode("utf-8")
            post_params["data64"] = img_b64

        oauth_params = {
            "oauth_consumer_key": self.consumer_key,
            "oauth_nonce": secrets.token_hex(16),
            "oauth_signature_method": "HMAC-SHA1",
            "oauth_timestamp": str(int(time.time())),
            "oauth_token": self.token,
            "oauth_version": "1.0"
        }

        # Sign request with form parameters
        all_params = {}
        all_params.update(post_params)
        all_params.update(oauth_params)
        
        # Note: In OAuth 1.0a, base64 data parameter should not be part of query signature if sent as body
        # Standard approach: sign with oauth params and urlencoded form data
        sig = sign_request("POST", url, all_params, self.consumer_secret, self.token_secret)
        oauth_params["oauth_signature"] = sig

        body = urllib.parse.urlencode(post_params).encode("utf-8")
        headers = {
            "Authorization": get_oauth_header(oauth_params),
            "Content-Type": "application/x-www-form-urlencoded",
            "User-Agent": "PombagirasPublisher/1.0"
        }

        req = urllib.request.Request(url, data=body, method="POST", headers=headers)
        with urllib.request.urlopen(req, timeout=60) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            post_id = data.get("response", {}).get("id")
            post_url = f"https://www.tumblr.com/{self.blog.replace('.tumblr.com', '')}/{post_id}"
            return {
                "id": post_id,
                "url": post_url,
                "response": data
            }

def get_tumblr_client():
    env = load_env()
    ck = env.get("TUMBLR_CONSUMER_KEY")
    cs = env.get("TUMBLR_CONSUMER_SECRET")
    ot = env.get("TUMBLR_OAUTH_TOKEN")
    ots = env.get("TUMBLR_OAUTH_TOKEN_SECRET")
    blog = env.get("TUMBLR_BLOG", "alexiamelusine")

    if not (ck and cs and ot and ots):
        raise ValueError("Chaves do Tumblr incompletas no arquivo .env! Verifique TUMBLR_CONSUMER_KEY, TUMBLR_CONSUMER_SECRET, TUMBLR_OAUTH_TOKEN, TUMBLR_OAUTH_TOKEN_SECRET.")

    return TumblrClient(ck, cs, ot, ots, blog_identifier=blog)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Publicador oficial do Tumblr")
    parser.add_argument("--caption", required=True, help="Texto / legenda da postagem")
    parser.add_argument("--image", required=True, help="URL pública ou caminho local da imagem")
    parser.add_argument("--tags", default="AlexiaMelusine,Pride,TransPride,ArteDigital,Cyberpunk,GothicAesthetic", help="Tags separadas por vírgula")
    parser.add_argument("--link", default="https://alexiamelusine.com", help="Link de clique da foto")

    args = parser.parse_args()

    try:
        client = get_tumblr_client()
        info = client.get_user_info()
        user_name = info.get("response", {}).get("user", {}).get("name", "alexiamelusine")
        print(f"[*] Autenticado com sucesso no Tumblr como: {user_name}")
        print(f"[*] Publicando foto no blog: {client.blog}...")
        res = client.post_photo(caption=args.caption, image_path_or_url=args.image, tags=args.tags, click_link=args.link)
        print(f"[+] Publicação realizada com sucesso no Tumblr!")
        print(f"[+] Link do post: {res['url']}")
    except Exception as e:
        print(f"[-] Erro ao publicar no Tumblr: {e}", file=sys.stderr)
        sys.exit(1)

