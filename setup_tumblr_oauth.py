#!/usr/bin/env python3
"""
Tumblr OAuth 1.0a Helper
Gera as chaves de acesso permanente (OAuth Token & OAuth Token Secret) para o blog da Alexia Melusine.
"""

import sys
import time
import hmac
import hashlib
import base64
import secrets
import urllib.parse
import urllib.request
from http.server import HTTPServer, BaseHTTPRequestHandler
import threading

CONSUMER_KEY = "eJI1Ke8YmnUW0iqnX7dHRTvQPhlPoiytlV9AdV9BETIPl6NF0n"
CONSUMER_SECRET = "8pO6102zMrMfCIA6jTh0DQhERalMxJsmyefpJ2qFFreedm46di"

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

def step1_request_token(callback_uri="http://localhost:8080/callback"):
    url = "https://www.tumblr.com/oauth/request_token"
    params = {
        "oauth_consumer_key": CONSUMER_KEY,
        "oauth_nonce": secrets.token_hex(16),
        "oauth_signature_method": "HMAC-SHA1",
        "oauth_timestamp": str(int(time.time())),
        "oauth_version": "1.0",
        "oauth_callback": callback_uri
    }
    sig = sign_request("POST", url, params, CONSUMER_SECRET, "")
    params["oauth_signature"] = sig
    
    headers = {
        "Authorization": get_oauth_header(params),
        "User-Agent": "PombagirasPublisher/1.0"
    }
    req = urllib.request.Request(url, method="POST", headers=headers)
    with urllib.request.urlopen(req, timeout=30) as resp:
        body = resp.read().decode("utf-8")
        parsed = dict(urllib.parse.parse_qsl(body))
        return parsed.get("oauth_token"), parsed.get("oauth_token_secret")

def step3_access_token(oauth_token, oauth_token_secret, oauth_verifier):
    url = "https://www.tumblr.com/oauth/access_token"
    params = {
        "oauth_consumer_key": CONSUMER_KEY,
        "oauth_nonce": secrets.token_hex(16),
        "oauth_signature_method": "HMAC-SHA1",
        "oauth_timestamp": str(int(time.time())),
        "oauth_token": oauth_token,
        "oauth_verifier": oauth_verifier,
        "oauth_version": "1.0"
    }
    sig = sign_request("POST", url, params, CONSUMER_SECRET, oauth_token_secret)
    params["oauth_signature"] = sig
    
    headers = {
        "Authorization": get_oauth_header(params),
        "User-Agent": "PombagirasPublisher/1.0"
    }
    req = urllib.request.Request(url, method="POST", headers=headers)
    with urllib.request.urlopen(req, timeout=30) as resp:
        body = resp.read().decode("utf-8")
        parsed = dict(urllib.parse.parse_qsl(body))
        return parsed.get("oauth_token"), parsed.get("oauth_token_secret")

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "exchange":
        token = sys.argv[2]
        secret = sys.argv[3]
        verifier = sys.argv[4]
        acc_token, acc_secret = step3_access_token(token, secret, verifier)
        print(f"ACCESS_TOKEN={acc_token}")
        print(f"ACCESS_SECRET={acc_secret}")
    else:
        req_token, req_secret = step1_request_token()
        print(f"REQ_TOKEN={req_token}")
        print(f"REQ_SECRET={req_secret}")
        print(f"AUTH_URL=https://www.tumblr.com/oauth/authorize?oauth_token={req_token}")

