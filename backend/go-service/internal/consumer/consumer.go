package consumer

import (

)

// Run runs the consumer server
func (s Server) Run() error {
	forever := make(chan bool)

	// // microsevice
	// shopSrv := shopSrv.New(s.l, s.microservice.TANCA_SHOP, s.internalKey)
	// mediaSrv := mediaSrv.New(s.l, s.microservice.TANCA_MEDIA)
	// commentSrv := commentSrv.New(s.l, s.microservice.TANCA_COMMENT, s.internalKey)

	// // Producer
	// eventProd := eventProd.New(s.l, s.conn)
	// if err := eventProd.Run(); err != nil {
	// 	return err
	// }

	// postProd := postProd.New(s.l, s.conn)
	// if err := postProd.Run(); err != nil {
	// 	return err
	// }

	// // Repositories
	// eventCategoryRepo := eventCategoryMongo.New(s.l, s.db)
	// elementRepo := elementMongo.New(s.l, s.db)
	// deviceRepo := deviceMongo.New(s.l, s.db)
	// roomRepo := roomMongo.New(s.l, s.db)
	// eventRepo := eventMongo.New(s.l, s.db)
	// postRepo := postMongo.New(s.l, s.db)
	// settingRepo := settingMongo.New(s.l, s.db)
	// rejectReasonRepo := rejectReasonMongo.New(s.l, s.db)

	// // Usecases
	// elementUC := elementUC.New(s.l, elementRepo)
	// eventCategoryUC := eventCategoryUC.New(s.l, eventCategoryRepo, elementUC)
	// deviceUC := deviceUC.New(s.l, deviceRepo, elementUC)
	// roomUC := roomUC.New(s.l, roomRepo, deviceUC, elementUC, nil, shopSrv)
	// eventUC := eventUC.New(s.l, eventRepo, deviceUC, elementUC, roomUC, shopSrv, eventCategoryUC, eventProd)
	// settingUC := settingUC.New(s.l, settingRepo, shopSrv)
	// rejectReasonUC := rejectReasonUC.New(s.l, rejectReasonRepo, shopSrv)
	// postUC := postUC.New(s.l, postRepo, shopSrv, settingUC, mediaSrv, commentSrv, rejectReasonUC, postProd)

	// // Set usecase
	// roomUC.SetEventUseCase(eventUC)

	// // Start the consumer
	// go eventConsumer.NewConsumer(s.l, &s.conn, eventUC).Consume()
	// go postConsumer.NewConsumer(s.l, &s.conn, postUC).Consume()

	// Keep the program running
	<-forever

	return nil
}
