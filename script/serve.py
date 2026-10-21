#!/usr/bin/env python3
import http.server
import socketserver
import os
import sys

PORT = 8080
DOC_ROOT = os.path.abspath("_site")

class ThreadingPagesHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DOC_ROOT, **kwargs)

    def translate_path(self, path):
        if path.startswith("/MLSE2026/"):
            rel = path[len("/MLSE2026/"):]
        elif path == "/MLSE2026":
            rel = ""
        else:
            rel = path.lstrip("/")
        return os.path.join(DOC_ROOT, rel)

class ReusableServer(socketserver.ThreadingTCPServer):
    allow_reuse_address = True

if __name__ == "__main__":
    with ReusableServer(("127.0.0.1", PORT), ThreadingPagesHandler) as httpd:
        print(f"Serving {DOC_ROOT} at http://127.0.0.1:{PORT}/MLSE2026/")
        sys.stdout.flush()
        httpd.serve_forever()
