package httpserver

import (
	classHTTP "init-src/internal/class/delivery/http"
	conversationHTTP "init-src/internal/conversation/delivery/http"
	forumHTTP "init-src/internal/forum/delivery/http"
	messageHTTP "init-src/internal/message/delivery/http"
	"init-src/internal/middleware"
	notificationHTTP "init-src/internal/notification/delivery/http"
	userHTTP "init-src/internal/user/delivery/http"
	"init-src/pkg/jwt"

	classPostgres "init-src/internal/class/repository/postgres"
	conversationPostgres "init-src/internal/conversation/repository/postgres"
	forumPostgres "init-src/internal/forum/repository/postgres"
	messagePostgres "init-src/internal/message/repository/postgres"
	notificationPostgres "init-src/internal/notification/repository/postgres"
	outboxPostgres "init-src/internal/outbox/repository/postgres"
	userMongo "init-src/internal/user/repository/mongo"

	classUsecase "init-src/internal/class/usecase"
	conversationUsecase "init-src/internal/conversation/usecase"
	forumUsecase "init-src/internal/forum/usecase"
	messageUsecase "init-src/internal/message/usecase"
	notificationUsecase "init-src/internal/notification/usecase"

	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
	// _ "init-src/docs"
)

func (srv HTTPServer) mapHandlers() {
	srv.gin.Static("/docs", "./docs")
	url := ginSwagger.URL("/docs/swagger.json")
	srv.gin.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler, url))

	jwtManager := jwt.NewManager(srv.jwtSecretKey)
	// Repositories - PostgreSQL
	outboxRepo := outboxPostgres.New(srv.l, srv.postgresDatabase)
	classRepo := classPostgres.New(srv.l, srv.postgresDatabase)
	conversationRepo := conversationPostgres.New(srv.l, srv.postgresDatabase)
	forumRepo := forumPostgres.New(srv.l, srv.postgresDatabase)
	messageRepo := messagePostgres.New(srv.l, srv.postgresDatabase)
	notificationRepo := notificationPostgres.New(srv.l, srv.postgresDatabase)

	// Repositories - Mongo
	userRepo := userMongo.New(srv.l, srv.mongoDatabase)

	// Usecases
	classUC := classUsecase.New(srv.l, classRepo, outboxRepo, srv.postgresDatabase)
	conversationUC := conversationUsecase.New(srv.l, conversationRepo, outboxRepo, srv.postgresDatabase, userRepo)
	forumUC := forumUsecase.New(srv.l, forumRepo, userRepo, srv.postgresDatabase)
	messageUC := messageUsecase.New(srv.l, messageRepo, conversationRepo, outboxRepo, userRepo, srv.postgresDatabase)
	notificationUC := notificationUsecase.New(srv.l, notificationRepo, srv.postgresDatabase, srv.redis)

	// Handlers
	classH := classHTTP.New(srv.l, classUC)
	conversationH := conversationHTTP.New(srv.l, conversationUC)
	forumH := forumHTTP.New(srv.l, forumUC)
	messageH := messageHTTP.New(srv.l, messageUC)
	notificationH := notificationHTTP.New(srv.l, notificationUC)
	userH := userHTTP.New(userRepo)

	// Middlewares
	mw := middleware.New(srv.l, jwtManager)

	api := srv.gin.Group("/api/v1")
	classHTTP.MapRoutes(api, mw, classH)
	conversationHTTP.MapRoutes(api, mw, conversationH)
	forumHTTP.MapRoutes(api, mw, forumH)
	messageHTTP.MapRoutes(api, mw, messageH)
	notificationHTTP.MapRoutes(api, mw, notificationH)
	userHTTP.MapRoutes(api, mw, userH)
}
