SERVICES := eureka identity-service user-profile-service course-service dashboard-service assessment-service api-gateway

# Build all services sequentially in dependency order
build: build-eureka

build-eureka:
	docker compose build --progress=plain eureka

build-identity-service: build-eureka
	docker compose build --progress=plain identity-service

build-user-profile-service: build-identity-service
	docker compose build --progress=plain user-profile-service

build-course-service: build-user-profile-service
	docker compose build --progress=plain course-service

build-dashboard-service: build-course-service
	docker compose build --progress=plain dashboard-service

build-assessment-service: build-dashboard-service
	docker compose build --progress=plain assessment-service

build-api-gateway: build-assessment-service
	docker compose build --progress=plain api-gateway

up:
	docker compose up -d

.PHONY: build up build-eureka build-identity-service build-user-profile-service build-course-service build-dashboard-service build-assessment-service build-api-gateway
