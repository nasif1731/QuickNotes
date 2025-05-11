from fastapi import APIRouter, HTTPException
from models import Note
import uuid
import psycopg2
import os

router = APIRouter()

conn = psycopg2.connect(
    dbname=os.getenv("DB_NAME"),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASS"),
    host=os.getenv("DB_HOST"),
    port=os.getenv("DB_PORT")
)
cur = conn.cursor()

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
    cur.execute("SELECT * FROM notes WHERE id = %s", (note_id,))
    row = cur.fetchone()
    if row:
        return {"id": row[0], "title": row[1], "content": row[2], "is_public": row[3]}
    raise HTTPException(status_code=404, detail="Note not found")
