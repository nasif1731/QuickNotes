package main

import (
	"context"
	"fmt"
	"net/http"

	"github.com/go-redis/redis/v8"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	"public-service/handlers"
)

var (
	MongoClient *mongo.Client
	RedisClient *redis.Client
	Ctx         = context.Background()
)

func main() {
	var err error

	// MongoDB connection
	MongoClient, err = mongo.Connect(Ctx, options.Client().ApplyURI("mongodb://mongo:27017"))
	if err != nil {
		panic(err)
	}

	// Redis connection
	RedisClient = redis.NewClient(&redis.Options{
		Addr: "redis:6379",
	})

	// Inject clients into handler
	handlers.Init(MongoClient, RedisClient)

	http.HandleFunc("/public", handlers.GetPublicNoteHandler)

	fmt.Println("Public service listening on :8080")
	http.ListenAndServe(":8080", nil)
}
