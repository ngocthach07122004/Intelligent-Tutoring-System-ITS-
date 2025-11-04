package httpserver

import (
	pkgCrt "init-src/pkg/encrypter"
	pkgLog "init-src/pkg/log"
	"init-src/pkg/mongo"
	"init-src/pkg/postgres"
	"init-src/pkg/rabbitmq"
	"init-src/pkg/redis"

	"github.com/gin-gonic/gin"
)

type HTTPServer struct {
	gin              *gin.Engine
	l                pkgLog.Logger
	port             int
	mongoDatabase    mongo.Database
	postgresDatabase postgres.Database
	jwtSecretKey     string
	amqpConn         rabbitmq.Connection
	redis            redis.Client
	encrypter        pkgCrt.Encrypter
	secretConfig     SecretConfig
}

type SecretConfig struct {
	SecretKey string
}

type Config struct {
	Port             int
	MongoDatabase    mongo.Database
	PostgresDatabase postgres.Database
	JWTSecretKey     string
	Encrypter        pkgCrt.Encrypter
	AMQPConn         rabbitmq.Connection
	Redis            redis.Client
	SecretConfig     SecretConfig
}

func New(l pkgLog.Logger, cfg Config) *HTTPServer {
	return &HTTPServer{
		l:                l,
		gin:              gin.Default(),
		port:             cfg.Port,
		mongoDatabase:    cfg.MongoDatabase,
		postgresDatabase: cfg.PostgresDatabase,
		amqpConn:         cfg.AMQPConn,
		redis:            cfg.Redis,
		encrypter:        cfg.Encrypter,
		jwtSecretKey:     cfg.JWTSecretKey,
		secretConfig:     cfg.SecretConfig,
	}
}
