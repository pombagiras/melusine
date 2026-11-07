#!/usr/bin/env python3
"""
Pombagiras Portal - X (Twitter) API v2 Publisher
Gerenciador automatizado de publicações no X para @PambuNjila (https://x.com/PambuNjila)
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

CONFIG = load_env()

API_KEY = CONFIG.get("X_API_KEY")
API_SECRET = CONFIG.get("X_API_SECRET")
ACCESS_TOKEN = CONFIG.get("X_ACCESS_TOKEN")
ACCESS_SECRET = CONFIG.get("X_ACCESS_TOKEN_SECRET")
X_USERNAME = CONFIG.get("X_USERNAME", "PambuNjila")

def get_oauth_header(method, url, extra_params=None):
    if not (API_KEY and API_SECRET and ACCESS_TOKEN and ACCESS_SECRET):
        raise ValueError("Chaves do X (Twitter) não configuradas no arquivo .env")
        
    oauth_params = {
        "oauth_consumer_key": API_KEY,
        "oauth_nonce": secrets.token_hex(16),
        "oauth_signature_method": "HMAC-SHA1",
        "oauth_timestamp": str(int(time.time())),
        "oauth_token": ACCESS_TOKEN,
        "oauth_version": "1.0"
    }
    
    all_params = {}
    all_params.update(oauth_params)
    if extra_params:
        all_params.update(extra_params)
        
    encoded_params = sorted([(urllib.parse.quote(str(k), safe=""), urllib.parse.quote(str(v), safe="")) for k, v in all_params.items()])
    param_string = "&".join([f"{k}={v}" for k, v in encoded_params])
    
    base_url = url.split("?")[0]
    base_string = "&".join([
        method.upper(),
        urllib.parse.quote(base_url, safe=""),
        urllib.parse.quote(param_string, safe="")
    ])
    
    signing_key = f"{urllib.parse.quote(API_SECRET, safe='')}&{urllib.parse.quote(ACCESS_SECRET, safe='')}".encode("utf-8")
    signature = base64.b64encode(hmac.new(signing_key, base_string.encode("utf-8"), hashlib.sha1).digest()).decode("utf-8")
    
    oauth_params["oauth_signature"] = signature
    parts = [f'{urllib.parse.quote(k, safe="")}="{urllib.parse.quote(v, safe="")}"' for k, v in sorted(oauth_params.items())]
    return "OAuth " + ", ".join(parts)

def check_x_account():
    url = "https://api.x.com/2/users/me"
    try:
        auth_header = get_oauth_header("GET", url)
        req = urllib.request.Request(url, headers={
            "Authorization": auth_header,
            "User-Agent": "PombagirasXPublisher/1.0"
        })
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            user = data.get("data", {})
            print("✅ [X CONECTADO COM SUCESSO!]")
            print(f"   • Nome: {user.get('name')}")
            print(f"   • Usuário: @{user.get('username')}")
            print(f"   • ID: {user.get('id')}")
            print(f"   • Perfil: https://x.com/{user.get('username')}")
            return user
    except urllib.error.HTTPError as e:
        error_body = e.read().decode("utf-8")
        print(f"❌ [FALHA NA CONEXÃO COM O X]: HTTP {e.code} - {error_body}")
        return False
    except Exception as e:
        print(f"❌ [ERRO]: {e}")
        return False

def publish_tweet(text):
    url = "https://api.x.com/2/tweets"
    payload = json.dumps({"text": text}).encode("utf-8")
    
    print(f"🚀 Enviando post para @{X_USERNAME} no X...")
    try:
        auth_header = get_oauth_header("POST", url)
        req = urllib.request.Request(url, data=payload, method="POST", headers={
            "Authorization": auth_header,
            "Content-Type": "application/json",
            "User-Agent": "PombagirasXPublisher/1.0"
        })
        
        with urllib.request.urlopen(req, timeout=20) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            tweet_data = data.get("data", {})
            tweet_id = tweet_data.get("id")
            permalink = f"https://x.com/{X_USERNAME}/status/{tweet_id}"
            print(f"🎉 POST PUBLICADO COM SUCESSO NO X! (ID: {tweet_id})")
            print(f"🔗 Link direto: {permalink}")
            return {"id": tweet_id, "permalink": permalink, "text": tweet_data.get("text")}
    except urllib.error.HTTPError as e:
        error_body = e.read().decode("utf-8")
        print(f"❌ Erro ao publicar no X: HTTP {e.code} - {error_body}")
        return False
    except Exception as e:
        print(f"❌ Erro ao publicar no X: {e}")
        return False

def main():
    parser = argparse.ArgumentParser(description="Publicador oficial do Pombagiras Portal no X (Twitter)")
    parser.add_argument("--check", action="store_true", help="Verifica a conexão com a conta do X")
    parser.add_argument("--text", help="Texto do tweet/post para publicar")
    
    args = parser.parse_args()
    
    if args.check or not args.text:
        print("🔍 Verificando status da conta do X...")
        print("-" * 50)
        check_x_account()
        print("-" * 50)
        return
        
    publish_tweet(args.text)

if __name__ == "__main__":
    main()

