#!/bin/bash

# Exit on error
set -e

# Load environment variables
set -a
source .env.production
set +a

# Check required environment variables
required_vars=("DOCKER_REGISTRY" "TAG" "KUBECONFIG" "KUBE_CONTEXT")
for var in "${required_vars[@]}"; do
  if [ -z "${!var}" ]; then
    echo "Error: $var is not set"
    exit 1
  fi
done

# Switch to the correct kubectl context
kubectl config use-context "$KUBE_CONTEXT"

# Build and push Docker image
echo "Building and pushing Docker image..."
docker build -t "${DOCKER_REGISTRY}/ai-mentor-api:${TAG}" -f Dockerfile.production .
docker push "${DOCKER_REGISTRY}/ai-mentor-api:${TAG}"

# Apply Kubernetes configurations
echo "Applying Kubernetes configurations..."
kubectl apply -k k8s/overlays/production

# Wait for deployment to roll out
echo "Waiting for deployment to complete..."
kubectl -n production rollout status deployment/ai-mentor-api

# Verify deployment
echo "Verifying deployment..."
kubectl -n production get pods

# Check service health
echo "Checking service health..."
sleep 10
KUBE_INGRESS_IP=$(kubectl -n production get ingress ai-mentor-ingress -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
curl -k "https://${KUBE_INGRESS_IP}/health" || {
  echo "Health check failed"
  exit 1
}

echo "Deployment completed successfully!"