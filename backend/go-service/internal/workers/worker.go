package workers

import (
	"context"

	notificationDelivery "init-src/internal/notification/delivery/asynq"
	notificationPostgres "init-src/internal/notification/repository/postgres"
	notificationUsecase "init-src/internal/notification/usecase"
	"init-src/internal/outbox"
	"init-src/internal/outbox/delivery/worker"
	outboxPostgres "init-src/internal/outbox/repository/postgres"
	outboxUC "init-src/internal/outbox/usecase"

	projectionDelivery "init-src/internal/projection/delivery/asynq"
	projectionRepo "init-src/internal/projection/repository/redis"
	projectionUC "init-src/internal/projection/usecase"
)

// Run runs the consumer server
func (s Worker) Run() error {
	ctx := context.Background()

	// Start outbox poller
	outboxRepo := outboxPostgres.New(s.l, s.postgresDatabase)
	outboxUsecase := outboxUC.New(s.l, outboxRepo, s.asynqClient, outbox.PollConfig{
		BatchSize: 50, // Process up to 50 events per poll
	})
	outboxPoller := worker.New(s.l, outboxUsecase)
	go outboxPoller.Start(ctx)

	s.l.Infof(ctx, "worker.Run: outbox poller started")

	// Register Projection handlers
	projectionRepo := projectionRepo.New(s.l, s.redis)
	projectionUC := projectionUC.New(s.l, projectionRepo)
	projectionHandler := projectionDelivery.New(s.l, projectionUC)
	projectionDelivery.RegisterProjectionHandlers(s.asynqServer, projectionHandler)
	s.l.Infof(ctx, "worker.Run: registered projection handlers")

	// Register Notification handlers
	notificationRepo := notificationPostgres.New(s.l, s.postgresDatabase)
	notificationUC := notificationUsecase.New(s.l, notificationRepo, s.postgresDatabase, s.redis)
	notificationHandler := notificationDelivery.New(s.l, notificationUC)
	notificationDelivery.RegisterNotificationHandlers(s.asynqServer, notificationHandler)
	s.l.Infof(ctx, "worker.Run: registered notification handlers")

	// Start Asynq server (blocking)
	s.l.Infof(ctx, "worker.Run: starting Asynq server...")
	if err := s.asynqServer.Start(); err != nil {
		s.l.Fatalf(ctx, "worker.Run: Asynq server error: %v", err)
		return err
	}
	s.l.Fatalf(ctx, "worker.End: ending Asynq server...")

	return nil
}
