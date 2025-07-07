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

    # Loop per attendere che il server risponda prima di aprire il browser
    import urllib.request
    server_ready = False
    url = f"http://localhost:{PORT}/index.html"
    for i in range(20):  # tenta per ~5 secondi
        try:
            with urllib.request.urlopen(url, timeout=0.5) as response:
                if response.status == 200:
                    server_ready = True
                    break
        except Exception:
            time.sleep(0.25)
    
    if not server_ready:
        print("Attenzione: il server non ha risposto in tempo. Prova ad aprire il browser manualmente.")
    else:
        print(f"Apro il browser su {url}")
        webbrowser.open(url)

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("Server fermato.")


