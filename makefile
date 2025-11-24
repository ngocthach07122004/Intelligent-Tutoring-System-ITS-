PROJECT_NAME ?= its
SERVICES := eureka identity-service user-profile-service course-service dashboard-service assessment-service api-gateway

# Build all services sequentially in dependency order (last target pulls the chain)
build: build-api-gateway

build-eureka:
	docker compose -p $(PROJECT_NAME) build --progress=plain eureka

build-identity-service: build-eureka
	docker compose -p $(PROJECT_NAME) build --progress=plain identity-service

build-user-profile-service: build-identity-service
	docker compose -p $(PROJECT_NAME) build --progress=plain user-profile-service

build-course-service: build-user-profile-service
	docker compose -p $(PROJECT_NAME) build --progress=plain course-service

build-dashboard-service: build-course-service
	docker compose -p $(PROJECT_NAME) build --progress=plain dashboard-service

build-assessment-service: build-dashboard-service
	docker compose -p $(PROJECT_NAME) build --progress=plain assessment-service

build-api-gateway: build-assessment-service
	docker compose -p $(PROJECT_NAME) build --progress=plain api-gateway

up:
	docker compose -p $(PROJECT_NAME) up -d

.PHONY: build up build-eureka build-identity-service build-user-profile-service build-course-service build-dashboard-service build-assessment-service build-api-gateway
