package handlers

import (
	"context"
	"encoding/json"
	"net/http"
	"time"

	"github.com/go-redis/redis/v8"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

var ctx = context.Background()
var mongoClient *mongo.Client
var redisClient *redis.Client

type Note struct {
	ID      string `json:"id" bson:"id"`
	Title   string `json:"title"`
	Content string `json:"content"`
}

func Init(mongo *mongo.Client, redis *redis.Client) {
	mongoClient = mongo
	redisClient = redis
}

func GetPublicNoteHandler(w http.ResponseWriter, r *http.Request) {
	id := r.URL.Query().Get("id")
	if id == "" {
		http.Error(w, "Missing ID", http.StatusBadRequest)
		return
	}

	// Check Redis cache
	cached, err := redisClient.Get(ctx, id).Result()
	if err == nil {
		w.Write([]byte(cached))
		return
	}

	// Fetch from MongoDB
	var note Note
	collection := mongoClient.Database("publicdb").Collection("notes")
	err = collection.FindOne(ctx, bson.M{"id": id, "is_public": true}).Decode(&note)
	if err != nil {
		http.Error(w, "Note not found", http.StatusNotFound)
		return
	}

	// Cache in Redis
	data, _ := json.Marshal(note)
	redisClient.Set(ctx, id, string(data), 10*time.Minute)

	w.Header().Set("Content-Type", "application/json")
	w.Write(data)
}
