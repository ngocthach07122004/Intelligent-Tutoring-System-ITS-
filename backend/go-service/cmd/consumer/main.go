package main

import (
	"context"
	"init-src/config"
	"init-src/internal/appconfig/mongo"
	"init-src/internal/appconfig/postgres"
	"init-src/internal/appconfig/redis"
	"init-src/internal/consumer"
	"init-src/pkg/rabbitmq"

	pkgCrt "init-src/pkg/encrypter"
	pkgLog "init-src/pkg/log"
)

func main() {
	ctx := context.Background()

	// Load config
	cfg, err := config.Load()
	if err != nil {
		panic(err)
	}

	l := pkgLog.InitializeZapLogger(pkgLog.ZapConfig{
		Level:    cfg.Logger.Level,
		Mode:     cfg.Logger.Mode,
		Encoding: cfg.Logger.Encoding,
	})

	crp := pkgCrt.NewEncrypter(cfg.Encrypter.Key)

	pgDB, err := postgres.Connect(ctx, cfg.Postgres)
	if err != nil {
		l.Fatalf(ctx, "Failed to connect to Postgres: %v", err)
	}
	defer postgres.Disconnect(pgDB)

	client, err := mongo.Connect(cfg.Mongo.URI)
	if err != nil {
		l.Fatalf(ctx, "Failed to connect to MongoDB: %v", err)
	}
	defer mongo.Disconnect(client)

	mongodb := client.Database(cfg.Mongo.DBName)

	conn, err := rabbitmq.Dial(cfg.RabbitMQConfig.URL, true)
	if err != nil {
		panic(err)
	}
	defer conn.Close()

	redisClient, err := redis.Connect(cfg.RedisConfig)
	if err != nil {
		panic(err)
	}
	defer redisClient.Disconnect()

	config := consumer.ServerConfig{
		Conn:             conn,
		MongoDB:          mongodb,
		Redis:            redisClient,
		PostgresDatabase: pgDB,
		Encrypter:        crp,
		InternalKey:      "", //cfg.InternalKey,
	}

	if err := consumer.NewServer(l, config).Run(); err != nil {
		l.Fatalf(ctx, "Failed to run consumer server: %v", err)
	}
}
