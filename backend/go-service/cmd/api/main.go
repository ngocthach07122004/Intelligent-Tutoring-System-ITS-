package main

import (
	"context"

	"init-src/config"
	"init-src/internal/appconfig/mongo"
	"init-src/internal/appconfig/postgres"
	"init-src/internal/appconfig/redis"
	"init-src/internal/httpserver"
	"init-src/pkg/encrypter"
	"init-src/pkg/rabbitmq"

	pkgLog "init-src/pkg/log"
)

// @title Tanca Intern Golang API
// @description This is the API documentation for Tanca Intern Golang.

// @version 1
// @host api.tanca.io/
// @schemes https

func main() {
	cfg, err := config.Load()
	if err != nil {
		panic(err)
	}
	client, err := mongo.Connect(cfg.Mongo.URI)
	if err != nil {
		panic(err)
	}
	defer mongo.Disconnect(client)

	db := client.Database(cfg.Mongo.DBName)

	pgDB, err := postgres.Connect(context.Background(), cfg.Postgres)
	if err != nil {
		panic(err)
	}
	defer postgres.Disconnect(pgDB)

	amqpConn, err := rabbitmq.Dial(cfg.RabbitMQConfig.URL, true)
	if err != nil {
		panic(err)
	}
	defer amqpConn.Close()

	redisClient, err := redis.Connect(cfg.RedisConfig)
	if err != nil {
		panic(err)
	}
	defer redisClient.Disconnect()

	encrypter := encrypter.NewEncrypter(cfg.Encrypter.Key)

	l := pkgLog.InitializeZapLogger(pkgLog.ZapConfig{
		Level:    cfg.Logger.Level,
		Mode:     cfg.Logger.Mode,
		Encoding: cfg.Logger.Encoding,
	})

	srv := httpserver.New(l, httpserver.Config{
		Port:             cfg.HTTPServer.Port,
		MongoDatabase:    db,
		PostgresDatabase: pgDB,
		JWTSecretKey:     cfg.JWT.SecretKey,
		Encrypter:        encrypter,
		AMQPConn:         amqpConn,
		Redis:            redisClient,
		SecretConfig: httpserver.SecretConfig{
			SecretKey: cfg.JWT.SecretKey,
		},
	})
	srv.Run()
}
