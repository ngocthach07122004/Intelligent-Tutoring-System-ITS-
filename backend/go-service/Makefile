include .env
export

## Run the API
docker:
	docker-compose up -d

## Run API Server
run-api:
	go run cmd/api/main.go

## Run WebSocket Gateway
run-ws:
	go run cmd/wsgateway/main.go

## Run Worker (outbox polling + tasks)
run-worker:
	go run cmd/worker/main.go

## Run Consumer (event processing)
run-consumer:
	go run cmd/consumer/main.go

## Run both API and WebSocket Gateway (for development)
run-all:
	@echo Starting API Server and WebSocket Gateway...
	@start /B go run cmd/api/main.go
	@start /B go run cmd/wsgateway/main.go
	@echo Both services started

## Run all 4 services (requires MongoDB)
run-full:
	@echo Starting all services...
	@start /B go run cmd/api/main.go
	@start /B go run cmd/wsgateway/main.go
	@start /B go run cmd/worker/main.go
	@start /B go run cmd/consumer/main.go
	@echo All 4 services started (API, WS Gateway, Worker, Consumer)

## Build API Server
build-api:
	go build -o bin/api.exe cmd/api/main.go

## Build WebSocket Gateway
build-ws:
	go build -o bin/wsgateway.exe cmd/wsgateway/main.go

## Build Worker
build-worker:
	go build -o bin/worker.exe cmd/worker/main.go

## Build Consumer
build-consumer:
	go build -o bin/consumer.exe cmd/consumer/main.go

## Build all services
build-all: build-api build-ws build-worker build-consumer

test:
	go test -mod=vendor -coverprofile=c.out -failfast -timeout 5m ./...

swagger:
	swag init -g cmd/api/main.go -o docs
	
test-html:
	go test -mod=vendor -coverprofile=coverage.out -failfast --timeout 5m ./...

	@if not exist coverage.out ( \
		echo Coverage file not created – tests may have failed.& exit 1 \
	)

	@echo === coverage.out size ===
	@for %%F in (coverage.out) do @echo %%~zF bytes  %%F

	rem Strip lines that contain "mock_"
	@findstr /V "mock_" coverage.out > c.out

	go tool cover -html=c.out