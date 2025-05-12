package handlers

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/mux"
	"github.com/redis/go-redis/v9"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

var ctx = context.Background()

type Note struct {
	ID       string   `json:"id" bson:"id"`
	Title    string   `json:"title"`
	Content  string   `json:"content"`
	Tags     []string `json:"tags"`
	Category string   `json:"category"`
	IsPublic bool     `json:"is_public"`
}

type Handler struct {
	Mongo *mongo.Collection
	Redis *redis.Client
}

func (h *Handler) GetPublicNote(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]
	log.Printf("🔍 Looking up public note ID: %s", id)

	cacheKey := "public_note:" + id

	// Try Redis
	if cached, err := h.Redis.Get(ctx, cacheKey).Result(); err == nil {
		log.Println("✅ Found in Redis cache")
		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte(cached))
		return
	}

	// Try MongoDB
	var note Note
	err := h.Mongo.FindOne(ctx, bson.M{"id": id, "is_public": true}).Decode(&note)
	if err != nil {
		log.Printf("❌ Note not found in MongoDB for id=%s. Error: %v", id, err)
		http.Error(w, "Note not found", http.StatusNotFound)
		return
	}

	log.Printf("✅ Found in MongoDB: %+v", note)

	// Cache it
	data, _ := json.Marshal(note)
	h.Redis.Set(ctx, cacheKey, data, 10*time.Minute)

	w.Header().Set("Content-Type", "application/json")
	w.Write(data)
}
