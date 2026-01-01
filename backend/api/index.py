"""
Vercel Serverless Function Entry Point for FastAPI
Uses Mangum to wrap the ASGI app as a serverless handler
"""
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import app
from mangum import Mangum

# Wrap FastAPI ASGI app with Mangum for serverless execution
handler = Mangum(app, lifespan="off")
