package main

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"syscall"

	"init-src/config"
	appPostgres "init-src/internal/appconfig/postgres"
	appRedis "init-src/internal/appconfig/redis"
	projectionRepo "init-src/internal/projection/repository/redis"
	projectionUC "init-src/internal/projection/usecase"
	websocket "init-src/internal/websocket"
	wsHTTP "init-src/internal/websocket/delivery/http"
	"init-src/pkg/jwt"
	pkgLog "init-src/pkg/log"

	"github.com/gin-gonic/gin"
)

// @title WebSocket Gateway
// @description This is the WebSocket Gateway for real-time communication.
// @version 1.0
// @host ws.tanca.io/
// @schemes wss

func main() {
	// 1. Load config
	cfg, err := config.Load()
	if err != nil {
		panic(fmt.Sprintf("Failed to load config: %v", err))
	}

	// 2. Initialize logger
	l := pkgLog.InitializeZapLogger(pkgLog.ZapConfig{
		Level:    cfg.Logger.Level,
		Mode:     cfg.Logger.Mode,
		Encoding: cfg.Logger.Encoding,
	})
	ctx := context.Background()

	l.Infof(ctx, "Starting WebSocket Gateway...")

	// 3. Connect to Redis (for Pub/Sub + projections)
	redisClient, err := appRedis.Connect(cfg.RedisConfig)
	if err != nil {
		l.Fatalf(ctx, "Failed to connect to Redis: %v", err)
	}
	defer redisClient.Disconnect()
	l.Infof(ctx, "Connected to Redis")

	// 4. Connect to Postgres (for projection queries if needed)
	pgDB, err := appPostgres.Connect(ctx, cfg.Postgres)
	if err != nil {
		l.Fatalf(ctx, "Failed to connect to Postgres: %v", err)
	}
	defer appPostgres.Disconnect(pgDB)
	l.Infof(ctx, "Connected to Postgres")

	// 5. Initialize JWT manager
	jwtManager := jwt.NewManager(cfg.JWT.SecretKey)
	l.Infof(ctx, "JWT manager initialized")

	// 6. Initialize projection components
	projectionRepository := projectionRepo.New(l, redisClient)
	projector := projectionUC.New(l, projectionRepository)
	l.Infof(ctx, "Projection components initialized")

	// 7. Create WebSocket Gateway
	wsgw := websocket.NewGateway(ctx, jwtManager, redisClient, projector, l)
	wsgw.Run() // Starts Hub and Subscriber in goroutines
	l.Infof(ctx, "WebSocket Gateway started")

	// 8. Setup HTTP server for WS upgrade endpoint
	gin.SetMode(gin.ReleaseMode)
	router := gin.Default()

	// CORS middleware for WebSocket
	router.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	// Root health check
	router.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"service": "WebSocket Gateway",
			"status":  "ok",
		})
	})

	// WebSocket routes
	wsHandler := wsHTTP.New(l, wsgw)
	wsHTTP.MapRoutes(&router.RouterGroup, wsHandler)

	// 9. Start HTTP server
	port := cfg.WSGateway.Port
	if port == 0 {
		port = 8081 // Default WS Gateway port
	}

	srv := &http.Server{
		Addr:    fmt.Sprintf(":%d", port),
		Handler: router,
	}

	go func() {
		l.Infof(ctx, "WebSocket Gateway listening on :%d", port)
		l.Infof(ctx, "WebSocket endpoint: ws://localhost:%d/ws", port)
		l.Infof(ctx, "Health check: http://localhost:%d/health", port)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			l.Fatalf(ctx, "Failed to start server: %v", err)
		}
	}()

	// 10. Graceful shutdown
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	sig := <-quit

	l.Infof(ctx, "Received signal: %v, shutting down WebSocket Gateway...", sig)

	// Shutdown WebSocket Gateway
	wsgw.Shutdown()

	// Shutdown HTTP server
	if err := srv.Shutdown(ctx); err != nil {
		l.Errorf(ctx, "Server shutdown error: %v", err)
	}

	l.Infof(ctx, "WebSocket Gateway stopped gracefully")
}
