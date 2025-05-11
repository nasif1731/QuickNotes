package handlers

import (
	"context"
	"encoding/json"
	"net/http"
	
	"time"

	"github.com/gorilla/mux"
	"github.com/redis/go-redis/v9"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/bson"
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
	Mongo  *mongo.Collection
	Redis  *redis.Client
}

func (h *Handler) GetPublicNote(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]
	cacheKey := "public_note:" + id

	// Try Redis cache
	if cached, err := h.Redis.Get(ctx, cacheKey).Result(); err == nil {
		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte(cached))
		return
	}

	// MongoDB fallback
	var note Note
	err := h.Mongo.FindOne(ctx, bson.M{"id": id, "is_public": true}).Decode(&note)
	if err != nil {
		http.Error(w, "Note not found", http.StatusNotFound)
		return
	}

	data, _ := json.Marshal(note)
	h.Redis.Set(ctx, cacheKey, data, 10*time.Minute)

	w.Header().Set("Content-Type", "application/json")
	w.Write(data)
}
