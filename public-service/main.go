package main

import (
	"context"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	"github.com/redis/go-redis/v9"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	"public-service/handlers"
)

func main() {
	ctx := context.Background()

	// MongoDB
	mongoURI := os.Getenv("MONGO_URI")
	client, err := mongo.Connect(ctx, options.Client().ApplyURI(mongoURI))
	if err != nil {
		log.Fatal("❌ MongoDB connection error:", err)
	}
	notesCol := client.Database("notesdb").Collection("notes")

	// Redis
	redisClient := redis.NewClient(&redis.Options{
		Addr: os.Getenv("REDIS_URL"),
	})
	if _, err := redisClient.Ping(ctx).Result(); err != nil {
		log.Fatal("❌ Redis connection error:", err)
	}

	// Handler wiring
	h := &handlers.Handler{
		Mongo: notesCol,
		Redis: redisClient,
	}

	// Router
	r := mux.NewRouter()
	r.HandleFunc("/public/{id}", h.GetPublicNote).Methods("GET")

	log.Println("✅ Public service running on port 8080")
	log.Fatal(http.ListenAndServe(":8080", r))
}
