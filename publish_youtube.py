#!/usr/bin/env python3
"""
======================================================================
✨ POMBAGIRAS DIGITAL ECOSYSTEM - YOUTUBE SHORTS PUBLISHER ✨
======================================================================
Canal: Almas de Pombagira | Por Alexia Melusine (@almasdepombagira)
Publicador oficial de Shorts e Vídeos via YouTube Data API v3.
======================================================================
"""

import os
import sys
import json
import time
import argparse
from pathlib import Path

from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
from googleapiclient.errors import HttpError
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials

SCOPES = [
    "https://www.googleapis.com/auth/youtube.upload",
    "https://www.googleapis.com/auth/youtube"
]

CLIENT_SECRET_FILE = Path(__file__).resolve().parent / "client_secret.json"
TOKEN_FILE = Path(__file__).resolve().parent / "youtube_token.json"

def get_youtube_service():
    creds = None
    if TOKEN_FILE.exists():
        try:
            creds = Credentials.from_authorized_user_file(str(TOKEN_FILE), SCOPES)
        except Exception as e:
            print(f"[!] Erro ao carregar youtube_token.json: {e}")

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            print("[*] Renovando token de acesso do YouTube...")
            creds.refresh(Request())
        else:
            if not CLIENT_SECRET_FILE.exists():
                raise FileNotFoundError(
                    f"Arquivo {CLIENT_SECRET_FILE.name} não encontrado! "
                    "Baixe as credenciais OAuth do Google Cloud Console e coloque na pasta."
                )
            print("[*] Abrindo navegador para autorizar acesso ao canal do YouTube...")
            flow = InstalledAppFlow.from_client_secrets_file(str(CLIENT_SECRET_FILE), SCOPES)
            creds = flow.run_local_server(port=0)
            
        with open(TOKEN_FILE, "w", encoding="utf-8") as f:
            f.write(creds.to_json())
        print(f"[+] Token salvo com sucesso em {TOKEN_FILE.name}")

    return build("youtube", "v3", credentials=creds)

def get_channel_info(youtube):
    res = youtube.channels().list(part="snippet,statistics", mine=True).execute()
    items = res.get("items", [])
    if items:
        ch = items[0]
        return {
            "title": ch["snippet"]["title"],
            "customUrl": ch["snippet"].get("customUrl", ""),
            "subscribers": ch["statistics"].get("subscriberCount", 0),
            "videos": ch["statistics"].get("videoCount", 0)
        }
    return None

def upload_short(video_path, title, description="", tags=None, privacy_status="public"):
    p = Path(video_path)
    if not p.exists():
        raise FileNotFoundError(f"Arquivo de vídeo não encontrado: {video_path}")

    # Garante a hashtag #Shorts para indexação garantida
    if "#Shorts" not in title and "#shorts" not in title:
        full_title = f"{title} #Shorts"
    else:
        full_title = title

    # Limite de 100 caracteres no título do YouTube
    if len(full_title) > 100:
        full_title = full_title[:97] + "..."

    default_tags = ["Shorts", "Pombagira", "Almas de Pombagira", "Alexia Melusine", "Umbanda", "Quimbanda", "Espiritualidade"]
    if tags:
        if isinstance(tags, str):
            custom_tags = [t.strip() for t in tags.split(",") if t.strip()]
        else:
            custom_tags = tags
        default_tags = list(set(default_tags + custom_tags))

    full_description = f"{description}\n\n#Shorts #Pombagira #AlmasDePombagira #AlexiaMelusine\n\n📖 Dossiê e estudos no portal: https://pombagiras.com".strip()

    body = {
        "snippet": {
            "title": full_title,
            "description": full_description,
            "tags": default_tags,
            "categoryId": "24" # Entertainment
        },
        "status": {
            "privacyStatus": privacy_status,
            "selfDeclaredMadeForKids": False
        }
    }

    youtube = get_youtube_service()
    
    # Exibe informações do canal conectado
    info = get_channel_info(youtube)
    if info:
        print(f"[*] Conectado ao canal: {info['title']} ({info['customUrl']}) | {info['subscribers']} inscritos")

    print(f"[*] Fazendo upload do vídeo para o YouTube Shorts...")
    print(f"    • Arquivo: {p.name} ({round(p.stat().st_size / 1024 / 1024, 2)} MB)")
    print(f"    • Título: {full_title}")
    print(f"    • Visibilidade: {privacy_status.upper()}")

    media = MediaFileUpload(str(p), chunksize=1024*1024*2, resumable=True, mimetype="video/mp4")
    request = youtube.videos().insert(part="snippet,status", body=body, media_body=media)

    response = None
    while response is None:
        status, response = request.next_chunk()
        if status:
            progress = int(status.progress() * 100)
            print(f"    ⏳ Enviando: {progress}% concluído...", end="\r", flush=True)

    video_id = response.get("id")
    shorts_url = f"https://www.youtube.com/shorts/{video_id}"
    video_url = f"https://youtu.be/{video_id}"
    
    print(f"\n[+] Upload finalizado com sucesso no YouTube!")
    print(f"[+] Link do Short: {shorts_url}")
    print(f"[+] Link direto: {video_url}")

    return {
        "id": video_id,
        "shorts_url": shorts_url,
        "url": video_url,
        "response": response
    }

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Publicador oficial do YouTube Shorts")
    parser.add_argument("--video", required=True, help="Caminho do arquivo MP4 local")
    parser.add_argument("--title", required=True, help="Título do Short")
    parser.add_argument("--desc", default="", help="Descrição do vídeo")
    parser.add_argument("--tags", default=None, help="Tags separadas por vírgula")
    parser.add_argument("--privacy", default="public", choices=["public", "unlisted", "private"], help="Visibilidade")

    args = parser.parse_args()

    try:
        res = upload_short(
            video_path=args.video,
            title=args.title,
            description=args.desc,
            tags=args.tags,
            privacy_status=args.privacy
        )
    except Exception as e:
        print(f"[-] Erro ao enviar para o YouTube: {e}", file=sys.stderr)
        sys.exit(1)

