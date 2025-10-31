package consumer

import (
	"init-src/pkg/encrypter"
	"init-src/pkg/log"
	"init-src/pkg/mongo"
	"init-src/pkg/postgres"
	"init-src/pkg/rabbitmq"
	"init-src/pkg/redis"
)

// Server is the consumer server
type Server struct {
	l                log.Logger
	conn             rabbitmq.Connection
	mongoDatabase    mongo.Database
	postgresDatabase postgres.Database
	redis            redis.Client
	encrypter        encrypter.Encrypter
	internalKey      string
}

type ServerConfig struct {
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
	config ServerConfig,
) Server {
	return Server{
		l:                l,
		conn:             config.Conn,
		mongoDatabase:    config.MongoDB,
		redis:            config.Redis,
		postgresDatabase: config.PostgresDatabase,
		encrypter:        config.Encrypter,
		internalKey:      config.InternalKey,
	}
}
