import os
import sys
import threading
import time
import socket

# When running from PyInstaller executable, sys._MEIPASS holds the extracted path
if getattr(sys, 'frozen', False):
    base_path = sys._MEIPASS
else:
    base_path = os.path.dirname(os.path.abspath(__file__))

# Change current working directory to the directory containing manage.py/db.sqlite3
os.chdir(base_path)

# Configure Django settings before importing anything
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

import django
django.setup()

from config.wsgi import application
from waitress import serve
import webview

def get_free_port():
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.bind(("127.0.0.1", 0))
    s.listen(1)
    port = s.getsockname()[1]
    s.close()
    return port

def run_server(port):
    # Run the WSGI app with Waitress
    serve(application, host='127.0.0.1', port=port, _quiet=True)

def main():
    port = get_free_port()
    
    # Start server thread
    t = threading.Thread(target=run_server, args=(port,))
    t.daemon = True
    t.start()
    
    # Wait for the server to spin up
    time.sleep(1)
    
    # Open PyWebView window
    window = webview.create_window('IT Academy Desktop', f'http://127.0.0.1:{port}', width=1280, height=800, resizable=True, min_size=(800, 600))
    webview.start()

if __name__ == '__main__':
    main()
