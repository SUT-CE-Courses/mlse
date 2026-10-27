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
        for prefix in ("/mlse/", "/MLSE2026/"):
            if path.startswith(prefix):
                return os.path.join(DOC_ROOT, path[len(prefix):])
        if path in ("/mlse", "/MLSE2026"):
            return os.path.join(DOC_ROOT, "")
        return os.path.join(DOC_ROOT, path.lstrip("/"))

class ReusableServer(socketserver.ThreadingTCPServer):
    allow_reuse_address = True

if __name__ == "__main__":
    with ReusableServer(("127.0.0.1", PORT), ThreadingPagesHandler) as httpd:
        print(f"Serving {DOC_ROOT} at http://127.0.0.1:{PORT}/mlse/")
        sys.stdout.flush()
        httpd.serve_forever()
