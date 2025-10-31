package config

import (
	"fmt"

	"github.com/caarlos0/env/v6"
)

// Config holds all configuration for the application.
type Config struct {
	AppVersion string `env:"APP_VERSION" envDefault:"1.0.0"`
	Mode       string `env:"MODE" envDefault:"development"`

	HTTPServer     HTTPServerConfig
	WSGateway      WSGatewayConfig
	Logger         LoggerConfig
	Mongo          MongoConfig
	Postgres       PostgresConfig
	RedisConfig    RedisConfig
	RabbitMQConfig RabbitMQConfig
	JWT            JWTConfig
	Encrypter      EncrypterConfig
}

// HTTPServerConfig holds HTTP server configuration.
type HTTPServerConfig struct {
	Port int    `env:"PORT" `
	Mode string `env:"MODE" `
}

// WSGatewayConfig holds WebSocket Gateway configuration.
type WSGatewayConfig struct {
	Port int `env:"WSGATEWAY_PORT" envDefault:"8081"`
}

// LoggerConfig holds logger configuration.
type LoggerConfig struct {
	Level    string `env:"LOGGER_LEVEL" envDefault:"debug"`
	Mode     string `env:"MODE" envDefault:"development"`
	Encoding string `env:"LOGGER_ENCODING" envDefault:"console"`
}

// MongoConfig holds MongoDB configuration.
type MongoConfig struct {
	URI    string `env:"MONGO_URI"`
	DBName string `env:"MONGO_DB_NAME" envDefault:"tanca-event-mongo"`
}

// PostgresConfig holds PostgreSQL configuration.
type PostgresConfig struct {
	DSN             string `env:"POSTGRES_DSN" envDefault:"postgres://postgres_user:postgres_password@localhost:5432/intern_golang?sslmode=disable"`
	MaxConns        int32  `env:"POSTGRES_MAX_CONNS" envDefault:"10"`
	MinConns        int32  `env:"POSTGRES_MIN_CONNS" envDefault:"2"`
	MaxConnLifetime int64  `env:"POSTGRES_MAX_CONN_LIFETIME" envDefault:"3600"`
	MaxConnIdleTime int64  `env:"POSTGRES_MAX_CONN_IDLE_TIME" envDefault:"1800"`
}

type RedisConfig struct {
	RedisAddr     string `env:"REDIS_HOST"`
	RedisPassword string `env:"REDIS_PASSWORD"`
	RedisDB       string `env:"REDIS_DATABASE"`
	MinIdleConns  int    `env:"REDIS_MIN_IDLE_CONNS"`
	PoolSize      int    `env:"REDIS_POOL_SIZE"`
	PoolTimeout   int    `env:"REDIS_POOL_TIMEOUT"`
	Password      string `env:"REDIS_PASSWORD"`
	DB            int    `env:"REDIS_DATABASE"`
}

// RabbitMQConfig holds RabbitMQ configuration.
type RabbitMQConfig struct {
	URL string `env:"RABBITMQ_URL"`
}

// JWTConfig holds JWT configuration.
type JWTConfig struct {
	SecretKey string `env:"JWT_SECRET"`
}

// EncrypterConfig holds encryption configuration.
type EncrypterConfig struct {
	Key string `env:"ENCRYPT_KEY"`
}

// Load loads configuration from environment variables.
func Load() (*Config, error) {
	cfg := &Config{}

	if err := env.Parse(cfg); err != nil {
		return nil, fmt.Errorf("failed to parse config: %w", err)
	}

	return cfg, nil
}
