from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import json
import os
from datetime import datetime, timedelta

app = FastAPI()

# CORS pour permettre les requêtes depuis le frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rendre les fichiers statiques (HTML, CSS, JS)
app.mount("/static", StaticFiles(directory="static"), name="static")

# Serveur racine : index.html
@app.get("/", response_class=HTMLResponse)
async def read_root():
    return FileResponse("index.html")

# Route pour obtenir la liste des festivals (CORRIGÉ ICI)
@app.get("/festivals")
def get_festivals():
    with open("festivals.json", "r", encoding="utf-8") as f:
        festivals = json.load(f)
    return festivals  # ✅ On renvoie directement la liste

# Route pour ajouter un festival
@app.post("/festivals")
async def add_festival(request: Request):
    new_festival = await request.json()
    with open("festivals.json", "r+", encoding="utf-8") as f:
        data = json.load(f)
        data.append(new_festival)
        f.seek(0)
        json.dump(data, f, ensure_ascii=False, indent=2)
    return {"message": "Festival ajouté"}

# Routes pour servir les autres pages
@app.get("/festival.html", response_class=HTMLResponse)
async def get_festival_page():
    return FileResponse("festival.html")

@app.get("/add_festival.html", response_class=HTMLResponse)
async def get_add_festival_page():
    return FileResponse("add_festival.html")

# Chat messages
CHAT_LOG = "chat_log.json"

@app.get("/messages")
def get_messages():
    if not os.path.exists(CHAT_LOG):
        return []
    with open(CHAT_LOG, "r", encoding="utf-8") as f:
        messages = json.load(f)
    # Nettoyage des messages de plus de 24h
    now = datetime.now()
    messages = [msg for msg in messages if now - datetime.fromisoformat(msg["timestamp"]) < timedelta(hours=24)]
    with open(CHAT_LOG, "w", encoding="utf-8") as f:
        json.dump(messages, f, ensure_ascii=False, indent=2)
    return messages

@app.post("/messages")
async def post_message(request: Request):
    new_msg = await request.json()
    new_msg["timestamp"] = datetime.now().isoformat()
    if not os.path.exists(CHAT_LOG):
        messages = []
    else:
        with open(CHAT_LOG, "r", encoding="utf-8") as f:
            messages = json.load(f)
    messages.append(new_msg)
    with open(CHAT_LOG, "w", encoding="utf-8") as f:
        json.dump(messages, f, ensure_ascii=False, indent=2)
    return {"message": "Message envoyé"}
