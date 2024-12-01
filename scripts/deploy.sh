#!/bin/bash

# Exit on error
set -e

# Load environment variables
set -a
source .env.production
set +a

# Check if TAG is provided
if [ -z "$TAG" ]; then
  echo "TAG environment variable is required"
  exit 1
fi

# Build and push images
docker build -t ${DOCKER_REGISTRY}/ai-mentor-api:${TAG} -f Dockerfile.production .
docker push ${DOCKER_REGISTRY}/ai-mentor-api:${TAG}

# Deploy to swarm
echo "Deploying stack to swarm..."
docker stack deploy -c docker-compose.production.yml aimentor

# Wait for services to be ready
echo "Waiting for services to be ready..."
sleep 30

# Check deployment status
echo "Checking deployment status..."
docker stack ps aimentor

# Verify health endpoints
echo "Verifying service health..."
curl -f https://aimentor.app/health || exit 1

echo "Deployment completed successfully!"