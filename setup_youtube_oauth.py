#!/usr/bin/env python3
"""
YouTube OAuth 2.0 Helper
Gera o link de autorização direto do Google e troca o código pelo token permanente.
"""

import sys
import json
import urllib.parse
import urllib.request
from pathlib import Path

CLIENT_SECRET_FILE = Path(__file__).resolve().parent / "client_secret.json"
TOKEN_FILE = Path(__file__).resolve().parent / "youtube_token.json"

SCOPES = [
    "https://www.googleapis.com/auth/youtube.upload",
    "https://www.googleapis.com/auth/youtube"
]

def get_auth_url(redirect_uri="http://localhost:8080"):
    with open(CLIENT_SECRET_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)
    client_config = data.get("installed") or data.get("web")
    client_id = client_config["client_id"]

    params = {
        "client_id": client_id,
        "redirect_uri": redirect_uri,
        "response_type": "code",
        "scope": " ".join(SCOPES),
        "access_type": "offline",
        "prompt": "consent",
        "include_granted_scopes": "true"
    }

    url = "https://accounts.google.com/o/oauth2/v2/auth?" + urllib.parse.urlencode(params)
    return url

def exchange_code(code_or_url, redirect_uri="http://localhost:8080"):
    # Se for a URL completa colada, extrai o code
    if "code=" in code_or_url:
        parsed = urllib.parse.urlparse(code_or_url)
        qs = urllib.parse.parse_qs(parsed.query)
        code = qs.get("code", [code_or_url])[0]
    else:
        code = code_or_url.strip()

    with open(CLIENT_SECRET_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)
    client_config = data.get("installed") or data.get("web")

    token_url = "https://oauth2.googleapis.com/token"
    payload = {
        "code": code,
        "client_id": client_config["client_id"],
        "client_secret": client_config["client_secret"],
        "redirect_uri": redirect_uri,
        "grant_type": "authorization_code"
    }

    data = urllib.parse.urlencode(payload).encode("utf-8")
    req = urllib.request.Request(token_url, data=data, method="POST", headers={"Content-Type": "application/x-www-form-urlencoded"})

    with urllib.request.urlopen(req, timeout=30) as resp:
        tokens = json.loads(resp.read().decode("utf-8"))

    # Salva no formato oficial esperado pelo google-auth
    token_data = {
        "token": tokens.get("access_token"),
        "refresh_token": tokens.get("refresh_token"),
        "token_uri": token_url,
        "client_id": client_config["client_id"],
        "client_secret": client_config["client_secret"],
        "scopes": SCOPES
    }

    with open(TOKEN_FILE, "w", encoding="utf-8") as f:
        json.dump(token_data, f, indent=2)

    return token_data

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "exchange":
        code_input = sys.argv[2]
        token_data = exchange_code(code_input)
        print("SUCCESS_TOKEN_GENERATED")
    else:
        url = get_auth_url()
        print(f"AUTH_URL={url}")

