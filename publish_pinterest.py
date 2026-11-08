#!/usr/bin/env python3
"""
======================================================================
✨ POMBAGIRAS DIGITAL ECOSYSTEM - PINTEREST API v5 PUBLISHER ✨
======================================================================
Publicador automatizado de Pins para:
Perfil: https://br.pinterest.com/almasdepombagira/
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

class PinterestClient:
    BASE_URL = "https://api.pinterest.com/v5"

    def __init__(self, access_token=None):
        env = load_env()
        self.token = access_token or env.get("PINTEREST_ACCESS_TOKEN")
        if not self.token:
            raise ValueError(
                "PINTEREST_ACCESS_TOKEN não encontrado no .env! "
                "Obtenha o token no Pinterest Developers quando o status Trial for aprovado."
            )

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
                return json.loads(resp.read().decode("utf-8"))
        except urllib.error.HTTPError as e:
            err = e.read().decode("utf-8", errors="replace")
            raise RuntimeError(f"Erro na API do Pinterest (HTTP {e.code}): {err}")

    def get_user_account(self):
        return self._request("user_account")

    def list_boards(self):
        res = self._request("boards")
        return res.get("items", [])

    def create_pin(self, board_id, title, description, image_url, link_url=None, alt_text=None):
        payload = {
            "board_id": str(board_id),
            "title": title[:100],
            "description": description[:800],
            "media_source": {
                "source_type": "image_url",
                "url": image_url
            }
        }
        if link_url:
            payload["link"] = link_url
        if alt_text:
            payload["alt_text"] = alt_text[:500]

        res = self._request("pins", method="POST", payload=payload)
        pin_id = res.get("id")
        return {
            "id": pin_id,
            "url": f"https://www.pinterest.com/pin/{pin_id}/",
            "title": res.get("title"),
            "response": res
        }

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Publicador oficial do Pinterest API v5")
    parser.add_argument("--board", default=None, help="ID da pasta/quadro do Pinterest")
    parser.add_argument("--title", required=True, help="Título do Pin (até 100 caracteres)")
    parser.add_argument("--desc", required=True, help="Descrição do Pin (até 800 caracteres)")
    parser.add_argument("--image", required=True, help="URL pública da imagem (ex: https://pombagiras.com/...)")
    parser.add_argument("--link", default="https://pombagiras.com", help="Link de destino do Pin")
    parser.add_argument("--alt", default=None, help="Texto alternativo de acessibilidade")
    parser.add_argument("--list-boards", action="store_true", help="Lista as pastas existentes e seus IDs")

    args = parser.parse_args()

    try:
        client = PinterestClient()
        if args.list_boards:
            print("[*] Buscando pastas (boards) da sua conta...")
            boards = client.list_boards()
            for b in boards:
                print(f"  • {b.get('name')} (ID: {b.get('id')})")
            sys.exit(0)

        if not args.board:
            print("[*] Buscando primeira pasta disponível...")
            boards = client.list_boards()
            if not boards:
                raise ValueError("Nenhuma pasta (board) encontrada na sua conta do Pinterest. Crie uma pasta primeiro!")
            args.board = boards[0]["id"]
            print(f"[*] Usando pasta: {boards[0].get('name')} (ID: {args.board})")

        print(f"[*] Criando Pin no Pinterest: '{args.title}'...")
        res = client.create_pin(
            board_id=args.board,
            title=args.title,
            description=args.desc,
            image_url=args.image,
            link_url=args.link,
            alt_text=args.alt
        )
        print(f"[+] Pin criado com sucesso!")
        print(f"[+] Link do Pin: {res['url']}")
    except Exception as e:
        print(f"[-] Erro no Pinterest: {e}", file=sys.stderr)
        sys.exit(1)
