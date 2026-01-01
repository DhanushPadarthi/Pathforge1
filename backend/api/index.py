"""
Vercel Serverless Function Entry Point for FastAPI
Uses asgiref to bridge ASGI FastAPI app to WSGI serverless handler
"""
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import app
from asgiref.wsgi import WsgiToAsgi

# Wrap ASGI app with WSGI compatibility for Vercel serverless
wsgi_app = WsgiToAsgi(app)
