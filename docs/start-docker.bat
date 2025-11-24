@echo off
echo Starting Docker Compose...
docker compose --env-file .env up -d --build
if %ERRORLEVEL% NEQ 0 (
    echo Docker Compose failed. Please make sure Docker Desktop is running.
    pause
) else (
    echo Docker Compose started successfully!
    docker compose ps
    pause
)
