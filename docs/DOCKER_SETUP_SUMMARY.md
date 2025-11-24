# Docker Compose Setup - COMPLETED ✅

## All Changes Made:

### 1. ✅ Added RabbitMQ Service
```yaml
rabbitmq:
  image: rabbitmq:3.12-management
  ports:
    - "5672:5672"     # AMQP
    - "15672:15672"   # Management UI
  environment:
    RABBITMQ_DEFAULT_USER: guest
    RABBITMQ_DEFAULT_PASS: guest
```

### 2. ✅ Added Assessment Service Database
```yaml
postgres_assessment:
  image: postgres:14
  container_name: postgres_assessment
  ports:
    - "5438:5432"
  environment:
    POSTGRES_DB: assessmentDb
    POSTGRES_USER: assessmentUser
    POSTGRES_PASSWORD: 12345678
```

### 3. ✅ Created Dockerfile.assessment-service
- Multi-stage build with Java 21
- Exposes port 8086
- Located at: `dockerfile/Dockerfile.assessment-service`

### 4. ✅ Added Assessment Service to docker-compose
```yaml
assessment-service:
  build:
    context: .
    dockerfile: ./dockerfile/Dockerfile.assessment-service
  container_name: assessment-service
  ports:
    - "8086:8086"
  environment:
    SERVER_PORT: 8086
    SPRING_PROFILES_ACTIVE: docker
    JWT_ISSUER_URI: ...
    RABBITMQ_HOST: rabbitmq
    # ... full config
  depends_on:
    - postgres_assessment
    - rabbitmq
    - eureka
```

### 5. ✅ Updated All Existing Services with:
- **JWT_ISSUER_URI** environment variable
- **RabbitMQ** configuration (HOST, PORT, USERNAME, PASSWORD)
- **depends_on** rabbitmq where needed

Updated services:
- identity-service (already has JWT vars from Keycloak)
- user-profile-service ✅
- course-service ✅
- dashboard-service ✅

### 6. ✅ Updated .env.example
Added:
```env
# PostgreSQL Assessment
POSTGRES_ASSESSMENT_HOST=postgres_assessment
POSTGRES_ASSESSMENT_DB=assessmentDb
POSTGRES_ASSESSMENT_USER=assessmentUser
POSTGRES_ASSESSMENT_PASSWORD=12345678
POSTGRES_ASSESSMENT_PORT=5438

# RabbitMQ
RABBITMQ_HOST=rabbitmq
RABBITMQ_PORT=5672
RABBITMQ_USERNAME=guest
RABBITMQ_PASSWORD=guest

# Assessment Service
ASSESSMENT_SERVICE_PORT=8086
DATASOURCE_URL_ASSESSMENT=jdbc:postgresql://postgres_assessment:5432/assessmentDb
DATASOURCE_USERNAME_ASSESSMENT=assessmentUser
DATASOURCE_PASSWORD_ASSESSMENT=12345678

# Global JWT
JWT_ISSUER_URI=http://keycloak:8080/realms/ITS-realm
```

Fixed:
- ✅ `POSTGRES_PORT_DEFAULT=5432` (removed space)

### 7. ✅ Created .env
- Copied from .env.example
- Ready to use

### 8. ✅ Fixed Dockerfile Port Mismatches
- `Dockerfile.user-profile-service`: EXPOSE 8082 → 8083

### 9. ✅ Added Docker Volumes
```yaml
volumes:
  postgres_assessment_data:
  rabbitmq_data:
```

## Summary of Ports:
- **8081**: Keycloak
- **8082**: Identity Service
- **8083**: User Profile Service
- **8084**: Course Service
- **8085**: Dashboard Service
- **8086**: Assessment Service ✅ NEW
- **8181**: API Gateway
- **8761**: Eureka
- **5672**: RabbitMQ AMQP ✅ NEW
- **15672**: RabbitMQ Management UI ✅ NEW
- **5433**: Postgres Keycloak
- **5434**: Postgres Identity
- **5435**: Postgres User Profile
- **5436**: Postgres Course
- **5437**: Postgres Dashboard
- **5438**: Postgres Assessment ✅ NEW

## Next Steps:

### 🔴 REQUIRED: Start Docker Desktop
```powershell
# Start Docker Desktop application manually
# Then verify:
docker ps
```

### Run Services:
```bash
docker compose up -d --build
```

### Monitor Services:
```bash
# Check all containers
docker compose ps

# Check logs
docker compose logs -f assessment-service
docker compose logs -f rabbitmq

# Access RabbitMQ Management UI
# http://localhost:15672
# Username: guest
# Password: guest
```

### Verify Services:
```bash
# Check RabbitMQ
curl http://localhost:15672

# Check Assessment Service
curl http://localhost:8086/health

# Check all services registered with Eureka
curl http://localhost:8761
```

## Status: ✅ READY TO RUN
All configurations completed. Just need to start Docker Desktop then run `docker compose up -d --build`
