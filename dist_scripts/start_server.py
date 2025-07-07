import http.server
import socketserver
import webbrowser
import threading
import os
import sys
import time

# Usa la porta passata da linea di comando o default a 8085
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8085

# Path assoluto alla directory dove è lo script o l'exe
exe_or_script_dir = os.path.dirname(os.path.abspath(sys.executable if getattr(sys, 'frozen', False) else __file__))

# Cartella del sito: assume che "docs" sia nella stessa cartella dell'exe/script
site_dir = os.path.abspath(os.path.join(exe_or_script_dir, "docs"))

if not os.path.isdir(site_dir):
    print(f"Errore: la cartella del sito non esiste: {site_dir}")
    sys.exit(1)

os.chdir(site_dir)

def start_server():
    handler = http.server.SimpleHTTPRequestHandler
    with socketserver.TCPServer(("", PORT), handler) as httpd:
        print(f"Serving {site_dir} at http://localhost:{PORT}")
        httpd.serve_forever()

if __name__ == "__main__":
    threading.Thread(target=start_server, daemon=True).start()
    time.sleep(1)

    index_path = os.path.join(site_dir, "index.html")
    if not os.path.exists(index_path):
        print(f"Errore: index.html non trovato in {site_dir}")
        sys.exit(1)

    url = f"http://localhost:{PORT}/index.html"
    print(f"Apro il browser su {url}")
    webbrowser.open(url)

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("Server fermato.")

