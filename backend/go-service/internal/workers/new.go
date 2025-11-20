package workers

import (
	"init-src/pkg/asynq"
	"init-src/pkg/encrypter"
	"init-src/pkg/log"
	"init-src/pkg/mongo"
	"init-src/pkg/postgres"
	"init-src/pkg/rabbitmq"
	"init-src/pkg/redis"
)

// Server is the consumer server
type Worker struct {
	l                log.Logger
	conn             rabbitmq.Connection
	mongoDatabase    mongo.Database
	postgresDatabase postgres.Database
	redis            redis.Client
	encrypter        encrypter.Encrypter
	internalKey      string
	asynqClient      *asynq.Client
	asynqServer      *asynq.Server
}

type WorkerConfig struct {
	Conn             rabbitmq.Connection
	MongoDB          mongo.Database
	PostgresDatabase postgres.Database
	Redis            redis.Client
	Encrypter        encrypter.Encrypter
	InternalKey      string
}

// NewServer creates a new consumer server
func NewServer(
	l log.Logger,
	config WorkerConfig,
) Worker {
	// Initialize Asynq client
	asynqClient := asynq.NewClient(asynq.ClientConfig{
		RedisClient: config.Redis.RawClient(),
	})

	// Initialize Asynq server
	asynqServer := asynq.NewServer(asynq.ServerConfig{
		RedisClient: config.Redis.RawClient(),
		Concurrency: 10,
	})

	return Worker{
		l:                l,
		conn:             config.Conn,
		mongoDatabase:    config.MongoDB,
		redis:            config.Redis,
		postgresDatabase: config.PostgresDatabase,
		encrypter:        config.Encrypter,
		internalKey:      config.InternalKey,
		asynqClient:      asynqClient,
		asynqServer:      asynqServer,
	}
}
