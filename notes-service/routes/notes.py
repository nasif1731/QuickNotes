from fastapi import APIRouter, HTTPException, Body
from models import Note
import uuid
import psycopg2
import os
import time

# MongoDB setup
from pymongo import MongoClient
mongo_client = MongoClient("mongodb://mongo:27017")  # Use container name
mongo_db = mongo_client["notesdb"]
mongo_collection = mongo_db["notes"]

router = APIRouter()

# Retry DB connection until ready (max 10 attempts)
for attempt in range(10):
    try:
        conn = psycopg2.connect(
            dbname=os.getenv("DB_NAME", "notesdb"),
            user=os.getenv("DB_USER", "postgres"),
            password=os.getenv("DB_PASS", "postgres"),
            host=os.getenv("DB_HOST", "notes-db"),
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

# ----------------------------- Routes -----------------------------

@router.post("/notes")
def create_note(note: Note):
    note_id = str(uuid.uuid4())
    cur.execute(
        "INSERT INTO notes (id, title, content, is_public, tags, category) VALUES (%s, %s, %s, %s, %s, %s)",
        (note_id, note.title, note.content, note.is_public, note.tags, note.category)
    )
    conn.commit()

    # If public, sync to MongoDB
    if note.is_public:
        mongo_collection.update_one(
            {"id": note_id},
            {"$set": {
                "id": note_id,
                "title": note.title,
                "content": note.content,
                "tags": note.tags,
                "category": note.category,
                "is_public": True
            }},
            upsert=True
        )

    return {"id": note_id}


@router.get("/notes")
def get_public_notes():
    cur.execute("SELECT id, title, content, is_public, tags, category FROM notes WHERE is_public = TRUE")
    rows = cur.fetchall()
    return [
        {
            "id": row[0],
            "title": row[1],
            "content": row[2],
            "is_public": row[3],
            "tags": row[4],
            "category": row[5]
        }
        for row in rows
    ]


@router.put("/notes/{note_id}")
def update_note(note_id: str, updated_note: Note = Body(...)):
    cur.execute(
        "UPDATE notes SET title = %s, content = %s, is_public = %s, tags = %s, category = %s WHERE id = %s",
        (updated_note.title, updated_note.content, updated_note.is_public, updated_note.tags, updated_note.category, note_id)
    )
    conn.commit()

    # Sync logic
    if updated_note.is_public:
        mongo_collection.update_one(
            {"id": note_id},
            {"$set": {
                "title": updated_note.title,
                "content": updated_note.content,
                "tags": updated_note.tags,
                "category": updated_note.category,
                "is_public": True
            }},
            upsert=True
        )
    else:
        mongo_collection.delete_one({"id": note_id})

    return {"message": "Note updated successfully"}


@router.delete("/notes/{note_id}")
def delete_note(note_id: str):
    cur.execute("DELETE FROM notes WHERE id = %s", (note_id,))
    conn.commit()

    # Remove from MongoDB if exists
    mongo_collection.delete_one({"id": note_id})

    return {"message": "Note deleted successfully"}
