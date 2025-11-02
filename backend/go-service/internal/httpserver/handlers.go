package httpserver

import (
	branchHTTP "init-src/internal/branch/delivery/http"
	classHTTP "init-src/internal/class/delivery/http"
	conversationHTTP "init-src/internal/conversation/delivery/http"
	departmentHTTP "init-src/internal/department/delivery/http"
	messageHTTP "init-src/internal/message/delivery/http"
	notificationHTTP "init-src/internal/notification/delivery/http"
	"init-src/internal/middleware"
	regionHTTP "init-src/internal/region/delivery/http"
	shopHTTP "init-src/internal/shop/delivery/http"
	userHTTP "init-src/internal/user/delivery/http"
	"init-src/pkg/jwt"

	branchMongo "init-src/internal/branch/repository/mongo"
	departmentMongo "init-src/internal/department/repository/mongo"
	regionMongo "init-src/internal/region/repository/mongo"
	shopMongo "init-src/internal/shop/repository/mongo"
	userMongo "init-src/internal/user/repository/mongo"

	classPostgres "init-src/internal/class/repository/postgres"
	conversationPostgres "init-src/internal/conversation/repository/postgres"
	messagePostgres "init-src/internal/message/repository/postgres"
	notificationPostgres "init-src/internal/notification/repository/postgres"
	outboxPostgres "init-src/internal/outbox/repository/postgres"

	branchUsecase "init-src/internal/branch/usecase"
	classUsecase "init-src/internal/class/usecase"
	conversationUsecase "init-src/internal/conversation/usecase"
	departmentUsecase "init-src/internal/department/usecase"
	messageUsecase "init-src/internal/message/usecase"
	notificationUsecase "init-src/internal/notification/usecase"
	regionUsecase "init-src/internal/region/usecase"
	shopUsecase "init-src/internal/shop/usecase"
	userUsecase "init-src/internal/user/usecase"

	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
	// _ "init-src/docs"
)

func (srv HTTPServer) mapHandlers() {
	srv.gin.Static("/docs", "./docs")
	url := ginSwagger.URL("/docs/swagger.json")
	srv.gin.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler, url))

	jwtManager := jwt.NewManager(srv.jwtSecretKey)
	// Repositories - MongoDB
	branchRepo := branchMongo.New(srv.l, srv.mongoDatabase)
	userRepo := userMongo.New(srv.l, srv.mongoDatabase)
	shopRepo := shopMongo.New(srv.l, srv.mongoDatabase)
	regionRepo := regionMongo.New(srv.l, srv.mongoDatabase)
	departmentRepo := departmentMongo.New(srv.l, srv.mongoDatabase)

	// Repositories - PostgreSQL
	outboxRepo := outboxPostgres.New(srv.l, srv.postgresDatabase)
	classRepo := classPostgres.New(srv.l, srv.postgresDatabase)
	conversationRepo := conversationPostgres.New(srv.l, srv.postgresDatabase)
	messageRepo := messagePostgres.New(srv.l, srv.postgresDatabase)
	notificationRepo := notificationPostgres.New(srv.l, srv.postgresDatabase)

	// Usecases
	departmentUC := departmentUsecase.New(srv.l, departmentRepo)
	branchUC := branchUsecase.New(srv.l, branchRepo, departmentUC)
	regionUC := regionUsecase.New(srv.l, regionRepo, branchUC)
	shopUC := shopUsecase.New(srv.l, shopRepo, regionUC)
	userUC := userUsecase.New(srv.l, userRepo, jwtManager, shopUC, regionUC, branchUC, departmentUC, srv.encrypter)
	classUC := classUsecase.New(srv.l, classRepo, outboxRepo, srv.postgresDatabase)
	conversationUC := conversationUsecase.New(srv.l, conversationRepo, outboxRepo, srv.postgresDatabase)
	messageUC := messageUsecase.New(srv.l, messageRepo, conversationRepo, outboxRepo, srv.postgresDatabase)
	notificationUC := notificationUsecase.New(srv.l, notificationRepo, srv.postgresDatabase, srv.redis)

	// Handlers
	branchH := branchHTTP.New(srv.l, branchUC)
	userH := userHTTP.New(srv.l, userUC)
	shopH := shopHTTP.New(srv.l, shopUC)
	regionH := regionHTTP.New(srv.l, regionUC)
	departmentH := departmentHTTP.New(srv.l, departmentUC)
	classH := classHTTP.New(srv.l, classUC)
	conversationH := conversationHTTP.New(srv.l, conversationUC)
	messageH := messageHTTP.New(srv.l, messageUC)
	notificationH := notificationHTTP.New(srv.l, notificationUC)

	// Middlewares
	mw := middleware.New(srv.l, jwtManager, srv.encrypter, userUC)

	api := srv.gin.Group("/api/v1")
	userHTTP.MapRoutes(api, mw, userH)
	branchHTTP.MapRoutes(api, mw, branchH)
	shopHTTP.MapRoutes(api, mw, shopH)
	regionHTTP.MapRoutes(api, mw, regionH)
	departmentHTTP.MapRoutes(api, mw, departmentH)
	classHTTP.MapRoutes(api, mw, classH)
	conversationHTTP.MapRoutes(api, mw, conversationH)
	messageHTTP.MapRoutes(api, mw, messageH)
	notificationHTTP.MapRoutes(api, mw, notificationH)
}
