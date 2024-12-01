#!/bin/bash

# Exit on error
set -e

# Load environment variables
set -a
source .env.production
set +a

# Check required environment variables
if [ -z "$KUBE_CONTEXT" ]; then
  echo "Error: KUBE_CONTEXT is not set"
  exit 1
fi

# Switch to the correct kubectl context
kubectl config use-context "$KUBE_CONTEXT"

# Get current deployment
CURRENT_DEPLOYMENT=$(kubectl -n production get deployment ai-mentor-api -o jsonpath='{.metadata.name}')

if [ -z "$CURRENT_DEPLOYMENT" ]; then
  echo "Error: Deployment not found"
  exit 1
fi

# Perform rollback
echo "Rolling back deployment..."
kubectl -n production rollout undo deployment/ai-mentor-api

# Wait for rollback to complete
echo "Waiting for rollback to complete..."
kubectl -n production rollout status deployment/ai-mentor-api

# Verify rollback
echo "Verifying rollback..."
kubectl -n production get pods

# Check service health
echo "Checking service health..."
sleep 10
KUBE_INGRESS_IP=$(kubectl -n production get ingress ai-mentor-ingress -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
curl -k "https://${KUBE_INGRESS_IP}/health" || {
  echo "Health check failed"
  exit 1
}

echo "Rollback completed successfully!"