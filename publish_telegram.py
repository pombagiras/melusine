#!/usr/bin/env python3
"""
Pombagiras Portal - Telegram Channel Publisher
Envia publicações ricas com foto, links e formatação para o canal oficial do Telegram.
"""

import os
import sys
import json
import uuid
import argparse
import urllib.request
import urllib.parse
import urllib.error
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
    boundary = f"----TelegramBoundary{uuid.uuid4().hex}"
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

def _parse_telegram_http_error(err):
    raw = err.read().decode("utf-8", errors="replace")
    try:
        parsed = json.loads(raw)
        err_code = parsed.get("error_code", err.code)
        description = parsed.get("description", raw)
        return err_code, description, raw
    except Exception:
        return err.code, raw, raw

def _resolve_local_or_download_image(image_url):
    repo_root = Path(__file__).resolve().parent
    prefix = "https://pombagiras.com/"
    if image_url.startswith(prefix):
        rel = urllib.parse.unquote(image_url[len(prefix):]).lstrip("/")
        local_candidate = repo_root / rel
        if local_candidate.is_file():
            ext = local_candidate.suffix.lower()
            ctype = "image/png" if ext == ".png" else ("image/webp" if ext == ".webp" else "image/jpeg")
            return local_candidate.name, local_candidate.read_bytes(), ctype

    img_req = urllib.request.Request(image_url, headers={"User-Agent": "PombagirasTelegramPublisher/1.0"})
    with urllib.request.urlopen(img_req, timeout=30) as r:
        ctype = (r.headers.get("Content-Type") or "image/jpeg").split(";")[0].strip()
        filename = Path(urllib.parse.urlparse(image_url).path).name or "capa.jpg"
        return filename, r.read(), ctype

def _send_photo_multipart(url, target_chat, filename, img_bytes, content_type, caption, parse_mode):
    fields = {
        "chat_id": target_chat,
        "caption": caption,
        "parse_mode": parse_mode
    }
    files = {
        "photo": (filename, img_bytes, content_type)
    }
    body, form_ctype = build_multipart_form(fields, files)
    req = urllib.request.Request(url, data=body, headers={"Content-Type": form_ctype})
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        err_code, description, _ = _parse_telegram_http_error(e)
        raise RuntimeError(f"Telegram HTTP {e.code} (error_code={err_code}): {description}") from e

def send_telegram(caption, image_path_or_url=None, chat_id=None, parse_mode="HTML"):
    env = load_env()
    token = env.get("TELEGRAM_BOT_TOKEN")
    if not token:
        raise ValueError("TELEGRAM_BOT_TOKEN não configurado no .env!")
    
    target_chat = chat_id or env.get("TELEGRAM_CHANNEL_ID")
    if not target_chat:
        raise ValueError("TELEGRAM_CHANNEL_ID não configurado no .env!")

    base_url = f"https://api.telegram.org/bot{token}"

    if image_path_or_url:
        url = f"{base_url}/sendPhoto"
        if image_path_or_url.startswith("http://") or image_path_or_url.startswith("https://"):
            payload = {
                "chat_id": target_chat,
                "photo": image_path_or_url,
                "caption": caption,
                "parse_mode": parse_mode
            }
            data = json.dumps(payload).encode("utf-8")
            req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json"})
            try:
                with urllib.request.urlopen(req, timeout=30) as resp:
                    return json.loads(resp.read().decode("utf-8"))
            except urllib.error.HTTPError as e:
                err_code, description, _ = _parse_telegram_http_error(e)
                print(f"  [!] Telegram HTTP {e.code} por URL (error_code={err_code}): {description}", file=sys.stderr)
                if e.code != 400:
                    raise RuntimeError(f"Telegram HTTP {e.code} (error_code={err_code}): {description}") from e
                print("  [*] Tentando fallback via upload multipart/form-data...", file=sys.stderr)
                filename, img_bytes, ctype = _resolve_local_or_download_image(image_path_or_url)
                return _send_photo_multipart(url, target_chat, filename, img_bytes, ctype, caption, parse_mode)
        else:
            p = Path(image_path_or_url)
            if not p.exists():
                raise FileNotFoundError(f"Imagem local não encontrada: {image_path_or_url}")
            ext = p.suffix.lower()
            ctype = "image/png" if ext == ".png" else ("image/webp" if ext == ".webp" else "image/jpeg")
            return _send_photo_multipart(url, target_chat, p.name, p.read_bytes(), ctype, caption, parse_mode)
    else:
        url = f"{base_url}/sendMessage"
        payload = {
            "chat_id": target_chat,
            "text": caption,
            "parse_mode": parse_mode,
            "disable_web_page_preview": False
        }
        data = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json"})
        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                return json.loads(resp.read().decode("utf-8"))
        except urllib.error.HTTPError as e:
            err_code, description, _ = _parse_telegram_http_error(e)
            raise RuntimeError(f"Telegram HTTP {e.code} (error_code={err_code}): {description}") from e

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Publicador oficial do Telegram Channel")
    parser.add_argument("--text", required=True, help="Texto da mensagem (HTML ou Markdown)")
    parser.add_argument("--image", default=None, help="Caminho local ou URL da imagem")
    parser.add_argument("--chat", default=None, help="Chat ID ou Channel Username")

    args = parser.parse_args()

    try:
        print("[*] Enviando mensagem para o Telegram...")
        res = send_telegram(caption=args.text, image_path_or_url=args.image, chat_id=args.chat)
        if res.get("ok"):
            msg_id = res.get("result", {}).get("message_id")
            print(f"[+] Publicação realizada com sucesso no Telegram! (Message ID: {msg_id})")
        else:
            print(f"[-] Telegram retornou erro: {res}", file=sys.stderr)
            sys.exit(1)
    except Exception as e:
        print(f"[-] Erro ao enviar para o Telegram: {e}", file=sys.stderr)
        sys.exit(1)

