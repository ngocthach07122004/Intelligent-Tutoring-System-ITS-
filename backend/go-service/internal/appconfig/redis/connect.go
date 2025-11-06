package redis

import (
	"fmt"
	"log"

	"init-src/config"
	pkgRedis "init-src/pkg/redis"
)

func Connect(redisConfig config.RedisConfig) (pkgRedis.Client, error) {
	redisOptions := pkgRedis.NewClientOptions().SetOptions(redisConfig)

	client, err := pkgRedis.Connect(redisOptions)
	if err != nil {
		return nil, fmt.Errorf("failed to connect to Redis: %w", err)
	}

	log.Println("Connected to Redis!")

	return client, nil
}

// Disconnect disconnects from the database.
func Disconnect(client pkgRedis.Client) {
	if client == nil {
		return
	}

	client.Disconnect()

	log.Println("Connection to Redis closed.")
}
