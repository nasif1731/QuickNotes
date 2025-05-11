FROM golang:1.21

WORKDIR /app
COPY . .

RUN go mod init public-service && \
    go get github.com/go-redis/redis/v8 \
           go.mongodb.org/mongo-driver/mongo && \
    go build -o public-service

CMD ["./public-service"]
