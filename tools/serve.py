"""Local preview that behaves like GitHub Pages: /studio serves studio.html,
and a missing page gets 404.html. python3 tools/serve.py, then open localhost:8765."""
import http.server, os, sys

os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))

class Pages(http.server.SimpleHTTPRequestHandler):
    def send_head(self):
        path = self.path.split('?')[0].split('#')[0]
        local = self.translate_path(path)
        if not os.path.exists(local) and os.path.exists(local + '.html'):
            self.path = path + '.html'
        elif not os.path.exists(local):
            self.send_response(404)
            self.send_header('Content-Type', 'text/html; charset=utf-8')
            body = open('404.html', 'rb').read()
            self.send_header('Content-Length', str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return None
        return super().send_head()

port = int(sys.argv[1]) if len(sys.argv) > 1 else 8765
http.server.ThreadingHTTPServer(('127.0.0.1', port), Pages).serve_forever()
