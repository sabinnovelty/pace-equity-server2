#!/bin/bash

# Variables
DOCKER_COMPOSE_LOCAL="docker-compose.local.yml"
DOCKER_COMPOSE_SERVER="docker-compose.server.yml"

LOCAL_ENV_FILE=".env.local"
SERVER_ENV_FILE=".env"

# Function to display help
help() {
    echo "Usage: $0 <environment> <docker-compose-commands>"
    echo ""
    echo "Environments:"
    echo "  local"
    echo "  server"
    echo ""
    echo "Examples:"
    echo "  $0 server up --build"
    echo "  $0 local logs -f"
    echo "  $0 server exec <service-name>"
}

# Main script
if [ "$#" -lt 2 ]; then
    help
    exit 1
fi

# Get environment and shift arguments to pass the rest to docker compose
environment="$1"
shift

case "$environment" in
    local)
        docker compose -f "$DOCKER_COMPOSE_LOCAL" --env-file "$LOCAL_ENV_FILE" "$@"
        ;;
    server)
        docker compose -f "$DOCKER_COMPOSE_SERVER" --env-file "$SERVER_ENV_FILE" "$@"
        ;;
    *)
        echo "Invalid environment: $environment"
        help
        exit 1
        ;;
esac
