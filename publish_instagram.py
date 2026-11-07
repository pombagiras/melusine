#!/usr/bin/env python3
"""
Pombagiras Portal - Instagram Graph API Publisher
Gerenciador automatizado de publicações para @almasdepombagira e @alexiamelusine
"""

import os
import sys
import json
import time
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

CONFIG = load_env()

ACCOUNTS = {
    "almas": {
        "id": CONFIG.get("INSTAGRAM_ALMAS_ID", "17841467171000669"),
        "token": CONFIG.get("INSTAGRAM_ALMAS_TOKEN"),
        "name": "Pombagiras.com (@almasdepombagira)",
        "handle": "almasdepombagira"
    },
    "alexia": {
        "id": CONFIG.get("INSTAGRAM_ALEXIA_ID", "17841404009064517"),
        "token": CONFIG.get("INSTAGRAM_ALEXIA_TOKEN"),
        "name": "Alexia Melusine (@alexiamelusine)",
        "handle": "alexiamelusine"
    }
}

GRAPH_API_VERSION = "v21.0"

def api_request(endpoint, params=None, method="GET", data=None):
    base_url = f"https://graph.facebook.com/{GRAPH_API_VERSION}/{endpoint}"
    if params:
        query = urllib.parse.urlencode(params)
        url = f"{base_url}?{query}"
    else:
        url = base_url
    
    encoded_data = None
    if data is not None:
        encoded_data = urllib.parse.urlencode(data).encode("utf-8")
    
    req = urllib.request.Request(url, data=encoded_data, method=method)
    req.add_header("User-Agent", "PombagirasPublisher/1.0")
    
    try:
        with urllib.request.urlopen(req, timeout=30) as response:
            return json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        error_body = e.read().decode("utf-8")
        try:
            return {"error": json.loads(error_body)}
        except Exception:
            return {"error": {"message": error_body, "code": e.code}}
    except Exception as e:
        return {"error": {"message": str(e)}}

def check_account(acc_key):
    acc = ACCOUNTS[acc_key]
    token = acc["token"]
    ig_id = acc["id"]
    if not token:
        print(f"❌ [ERRO] Token não configurado para {acc['name']}")
        return False
    
    res = api_request(f"{ig_id}", {"fields": "id,name,username,profile_picture_url", "access_token": token})
    if "error" in res:
        print(f"❌ [FALHA] {acc['name']}: {res['error']}")
        return False
    
    print(f"✅ [CONECTADO] {acc['name']}")
    print(f"   • ID: {res.get('id')}")
    print(f"   • Username: @{res.get('username')}")
    print(f"   • Nome: {res.get('name')}")
    return True

def publish_post(acc_key, image_url, caption):
    acc = ACCOUNTS[acc_key]
    token = acc["token"]
    ig_id = acc["id"]
    
    if not token:
        raise ValueError(f"Token não configurado para {acc['name']}")
    
    print(f"🚀 Iniciando publicação em {acc['name']}...")
    print(f"   • Imagem: {image_url}")
    
    # 1. Cria o Media Container
    container_payload = {
        "image_url": image_url,
        "caption": caption,
        "access_token": token
    }
    
    res_container = api_request(f"{ig_id}/media", method="POST", data=container_payload)
    if "error" in res_container or "id" not in res_container:
        print(f"❌ Erro ao criar container de mídia: {res_container}")
        return False
    
    creation_id = res_container["id"]
    print(f"📦 Container de mídia criado com sucesso (ID: {creation_id})")
    
    # Aguarda o processamento da imagem pela Meta (2 a 5 segundos)
    print("⏳ Processando mídia nos servidores da Meta...")
    time.sleep(4)
    
    # 2. Publica o Media Container
    publish_payload = {
        "creation_id": creation_id,
        "access_token": token
    }
    
    res_pub = api_request(f"{ig_id}/media_publish", method="POST", data=publish_payload)
    if "error" in res_pub or "id" not in res_pub:
        print(f"❌ Erro ao disparar publicação: {res_pub}")
        return False
    
    media_id = res_pub["id"]
    print(f"🎉 POST PUBLICADO COM SUCESSO NO INSTAGRAM! (Media ID: {media_id})")
    return media_id

def main():
    parser = argparse.ArgumentParser(description="Publicador oficial do Pombagiras Portal no Instagram")
    parser.add_argument("--account", choices=["almas", "alexia", "both"], default="almas", help="Conta alvo")
    parser.add_argument("--check", action="store_true", help="Verifica a conexão de ambas as contas")
    parser.add_argument("--image_url", help="URL pública da imagem para publicação")
    parser.add_argument("--caption", help="Texto e legenda da publicação")
    
    args = parser.parse_args()
    
    if args.check or (not args.image_url and not args.caption):
        print("🔍 Verificando status das contas do Instagram...")
        print("-" * 50)
        check_account("almas")
        print("-" * 50)
        check_account("alexia")
        print("-" * 50)
        return
    
    if not args.image_url:
        print("❌ Informe --image_url")
        sys.exit(1)
        
    caption = args.caption or ""
    
    targets = ["almas", "alexia"] if args.account == "both" else [args.account]
    for target in targets:
        publish_post(target, args.image_url, caption)
        print("-" * 50)

if __name__ == "__main__":
    main()

