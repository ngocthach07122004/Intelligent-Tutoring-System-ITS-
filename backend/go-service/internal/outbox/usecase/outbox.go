package usecase

import (
	"context"

	"init-src/internal/models"
	"init-src/pkg/asynq"
)

// PollAndProcess polls pending events and processes them
func (uc *implUsecase) PollAndProcess(ctx context.Context) error {
	// Fetch pending events
	events, err := uc.repo.FetchPending(ctx, uc.config.BatchSize)
	if err != nil {
		uc.l.Errorf(ctx, "outbox.usecase.PollAndProcess.FetchPending", err)
		return err
	}

	if len(events) == 0 {
		return nil // No events to process
	}

	uc.l.Debugf(ctx, "outbox.usecase.PollAndProcess: fetched %d events", len(events))

	// Process each event
	for _, event := range events {
		if err := uc.processEvent(ctx, event); err != nil {
			uc.l.Warnf(ctx, "outbox.usecase.processEvent error: %v, event_id: %d", err, event.ID)

			// Mark as failed
			_ = uc.repo.MarkFailed(ctx, event.ID, err.Error())
			continue
		}

		// Mark as processed
		if err := uc.repo.MarkProcessed(ctx, event.ID); err != nil {
			uc.l.Warnf(ctx, "outbox.usecase.MarkProcessed error: %v, event_id: %d", err, event.ID)
		}
	}

	return nil
}

func (uc *implUsecase) processEvent(ctx context.Context, event models.OutboxEvent) error {
	// Mark as processing
	if err := uc.repo.MarkProcessing(ctx, event.ID); err != nil {
		return err
	}

	// Determine task types based on event type (can be multiple)
	taskTypes := uc.mapEventToTaskTypes(event.EventType)
	if len(taskTypes) == 0 {
		uc.l.Warnf(ctx, "outbox.usecase.processEvent: unknown event type: %s", event.EventType)
		return nil // Skip unknown event types
	}

	// Enqueue all tasks for this event
	queue := uc.determineQueue(event.EventType)
	for _, taskType := range taskTypes {
		// Create Asynq task
		task := asynq.NewTask(taskType, []byte(event.Payload))

		// Enqueue task
		_, err := uc.asynqClient.Enqueue(task, asynq.Queue(queue))
		if err != nil {
			return err
		}

		uc.l.Debugf(ctx, "outbox.usecase.processEvent: enqueued task %s for event %d", taskType, event.ID)
	}

	return nil
}

func (uc *implUsecase) mapEventToTaskTypes(eventType string) []string {
	switch eventType {
	case models.EventMessageCreated:
		// Message created triggers both projection and notification
		return []string{asynq.TaskProjectMessage, asynq.TaskNotifyNewMessage}
	case models.EventMessageEdited, models.EventMessageDeleted:
		// Edit/delete only trigger projection (no notification)
		return []string{asynq.TaskProjectMessage}
	case models.EventConversationCreated, models.EventParticipantJoined, models.EventParticipantLeft:
		return []string{asynq.TaskProjectConversation}
	case models.EventClassCreated:
		return []string{asynq.TaskProjectConversation}
	case models.EventClassMemberAdded:
		return []string{asynq.TaskNotifyClassInvite}
	default:
		return []string{}
	}
}

func (uc *implUsecase) determineQueue(eventType string) string {
	// Message events are critical (realtime)
	if eventType == models.EventMessageCreated {
		return asynq.QueueCritical
	}

	// Notifications are default priority
	if eventType == models.EventClassMemberAdded {
		return asynq.QueueDefault
	}

	// Other events are low priority
	return asynq.QueueLow
}
