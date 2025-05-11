from fastapi import APIRouter, HTTPException
from models import Note
import uuid
import psycopg2
import os
import time

router = APIRouter()

# Retry DB connection until ready (max 10 attempts)
for attempt in range(10):
    try:
        conn = psycopg2.connect(
            dbname=os.getenv("DB_NAME", "notesdb"),
            user=os.getenv("DB_USER", "postgres"),
            password=os.getenv("DB_PASS", "postgres"),
            host=os.getenv("DB_HOST", "notes-db"),  # Docker service name
            port=os.getenv("DB_PORT", "5432")
        )
        cur = conn.cursor()
        print(f"[✅] Database connected on attempt {attempt + 1}")
        break
    except psycopg2.OperationalError as e:
        print(f"[⏳] Database not ready (attempt {attempt + 1}/10): {e}")
        time.sleep(2)
else:
    raise Exception("❌ Could not connect to the database after 10 attempts.")

@router.post("/notes")
def create_note(note: Note):
    note_id = str(uuid.uuid4())
    cur.execute(
        "INSERT INTO notes (id, title, content, is_public) VALUES (%s, %s, %s, %s)",
        (note_id, note.title, note.content, note.is_public)
    )
    conn.commit()
    return {"id": note_id}

@router.get("/notes/{note_id}")
def get_note(note_id: str):
    try:
        uuid.UUID(note_id)  # validate format
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid UUID format")

    cur.execute("SELECT * FROM notes WHERE id = %s::uuid", (note_id,))
    row = cur.fetchone()
    if row:
        return {"id": row[0], "title": row[1], "content": row[2], "is_public": row[3]}
    raise HTTPException(status_code=404, detail="Note not found")
