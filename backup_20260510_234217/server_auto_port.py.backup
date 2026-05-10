"""
server_auto_port.py - Auto-detect available port
"""

from server import app
import uvicorn
import socket

def find_free_port():
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind(('', 0))
        return s.getsockname()[1]

if __name__ == "__main__":
    port = 8000
    try:
        print(f"Attempting to start server on port {port}...")
        uvicorn.run(app, host="0.0.0.0", port=port)
    except OSError:
        port = find_free_port()
        print(f"Port 8000 in use, using port {port}")
        uvicorn.run(app, host="0.0.0.0", port=port)
