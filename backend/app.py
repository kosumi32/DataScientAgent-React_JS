from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
# Allowing reuests from other places, specificying the frontend URL
CORS(app, origins=["http://localhost:5173"])
