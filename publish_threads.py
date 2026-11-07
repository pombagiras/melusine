#!/usr/bin/env python3
"""
Pombagiras Portal - Threads API Publisher
Gerenciador automatizado de publicações no Threads para:
1. @almasdepombagira (https://www.threads.net/@almasdepombagira)
2. @alexiamelusine (https://www.threads.net/@alexiamelusine)
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

THREADS_ACCOUNTS = {
    "almas": {
        "id": CONFIG.get("THREADS_ALMAS_ID", "28258825170458297"),
        "token": CONFIG.get("THREADS_ALMAS_TOKEN"),
        "name": "Pombagiras Portal (@almasdepombagira)",
        "handle": "almasdepombagira"
    },
    "alexia": {
        "id": CONFIG.get("THREADS_ALEXIA_ID", "29370521409251503"),
        "token": CONFIG.get("THREADS_ALEXIA_TOKEN"),
        "name": "Alexia Melusine (@alexiamelusine)",
        "handle": "alexiamelusine"
    }
}

THREADS_API_VERSION = "v1.0"

def threads_request(endpoint, params=None, method="GET", data=None):
    base_url = f"https://graph.threads.net/{THREADS_API_VERSION}/{endpoint}"
    if params:
        query = urllib.parse.urlencode(params)
        url = f"{base_url}?{query}"
    else:
        url = base_url
    
    encoded_data = None
    if data is not None:
        encoded_data = urllib.parse.urlencode(data).encode("utf-8")
    
    req = urllib.request.Request(url, data=encoded_data, method=method)
    req.add_header("User-Agent", "PombagirasThreadsPublisher/1.0")
    
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

def check_threads_account(acc_key):
    acc = THREADS_ACCOUNTS[acc_key]
    token = acc["token"]
    threads_id = acc["id"]
    if not token:
        print(f"❌ [ERRO] Token do Threads não configurado para {acc['name']}")
        return False
    
    res = threads_request("me", {"fields": "id,username,name,threads_profile_picture_url", "access_token": token})
    if "error" in res:
        print(f"❌ [FALHA] {acc['name']}: {res['error']}")
        return False
    
    print(f"✅ [THREADS CONECTADO] {acc['name']}")
    print(f"   • Threads ID: {res.get('id')}")
    print(f"   • Username: @{res.get('username')}")
    print(f"   • Nome: {res.get('name')}")
    print(f"   • Link: https://www.threads.net/@{res.get('username')}")
    return True

def publish_thread(acc_key, text, image_url=None, video_url=None):
    acc = THREADS_ACCOUNTS[acc_key]
    token = acc["token"]
    threads_id = acc["id"]
    
    if not token:
        raise ValueError(f"Token não configurado para {acc['name']}")
    
    print(f"🚀 Iniciando postagem no Threads para {acc['name']}...")
    
    # 1. Determina tipo de mídia
    container_payload = {
        "text": text,
        "access_token": token
    }
    
    if video_url:
        container_payload["media_type"] = "VIDEO"
        container_payload["video_url"] = video_url
        print(f"   • Tipo: VÍDEO ({video_url})")
    elif image_url:
        container_payload["media_type"] = "IMAGE"
        container_payload["image_url"] = image_url
        print(f"   • Tipo: IMAGEM ({image_url})")
    else:
        container_payload["media_type"] = "TEXT"
        print("   • Tipo: TEXTO / THREAD")
    
    # 2. Cria o container
    res_container = threads_request(f"{threads_id}/threads", method="POST", data=container_payload)
    if "error" in res_container or "id" not in res_container:
        print(f"❌ Erro ao criar container do Threads: {res_container}")
        return False
    
    creation_id = res_container["id"]
    print(f"📦 Container do Threads criado com sucesso (ID: {creation_id})")
    
    # Se for mídia, aguarda o processamento
    if image_url or video_url:
        print("⏳ Aguardando processamento da mídia nos servidores do Threads...")
        wait_time = 10 if video_url else 3
        time.sleep(wait_time)
        
        # Polling se for vídeo
        if video_url:
            for attempt in range(1, 20):
                status_res = threads_request(f"{creation_id}", {"fields": "status,error_message", "access_token": token})
                status = status_res.get("status")
                print(f"   [{attempt}/20] Status do vídeo: {status}")
                if status == "FINISHED":
                    break
                elif status == "ERROR":
                    print(f"❌ Erro no processamento do vídeo no Threads: {status_res}")
                    return False
                time.sleep(5)
    else:
        time.sleep(1)
        
    # 3. Publica o container
    publish_payload = {
        "creation_id": creation_id,
        "access_token": token
    }
    
    res_pub = threads_request(f"{threads_id}/threads_publish", method="POST", data=publish_payload)
    if "error" in res_pub or "id" not in res_pub:
        print(f"❌ Erro ao publicar no Threads: {res_pub}")
        return False
    
    thread_id = res_pub["id"]
    print(f"🎉 THREAD PUBLICADO COM SUCESSO! (ID: {thread_id})")
    
    # 4. Busca permalink oficial
    detail = threads_request(f"{thread_id}", {"fields": "id,permalink", "access_token": token})
    permalink = detail.get("permalink", f"https://www.threads.net/@{acc['handle']}")
    print(f"🔗 Link direto: {permalink}")
    return {"id": thread_id, "permalink": permalink}

def main():
    parser = argparse.ArgumentParser(description="Publicador oficial do Pombagiras Portal no Threads")
    parser.add_argument("--account", choices=["almas", "alexia", "both"], default="almas", help="Conta alvo")
    parser.add_argument("--check", action="store_true", help="Verifica a conexão de ambas as contas no Threads")
    parser.add_argument("--text", help="Texto do post")
    parser.add_argument("--image_url", help="URL pública da imagem (opcional)")
    parser.add_argument("--video_url", help="URL pública do vídeo (opcional)")
    
    args = parser.parse_args()
    
    if args.check or not args.text:
        print("🔍 Verificando status das contas do Threads...")
        print("-" * 50)
        check_threads_account("almas")
        print("-" * 50)
        check_threads_account("alexia")
        print("-" * 50)
        return
        
    targets = ["almas", "alexia"] if args.account == "both" else [args.account]
    for target in targets:
        publish_thread(target, args.text, args.image_url, args.video_url)
        print("-" * 50)

if __name__ == "__main__":
    main()

