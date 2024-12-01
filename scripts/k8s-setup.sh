#!/bin/bash

# Exit on error
set -e

# Load environment variables
set -a
source .env.production
set +a

# Check required tools
command -v kubectl >/dev/null 2>&1 || { echo "kubectl is required but not installed"; exit 1; }
command -v helm >/dev/null 2>&1 || { echo "helm is required but not installed"; exit 1; }

# Create namespace if it doesn't exist
kubectl create namespace production --dry-run=client -o yaml | kubectl apply -f -

# Add required Helm repositories
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo add jetstack https://charts.jetstack.io
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

# Install NGINX Ingress Controller
helm upgrade --install ingress-nginx ingress-nginx/ingress-nginx \
  --namespace ingress-nginx --create-namespace \
  --set controller.replicaCount=2 \
  --set controller.metrics.enabled=true

# Install cert-manager
helm upgrade --install cert-manager jetstack/cert-manager \
  --namespace cert-manager --create-namespace \
  --set installCRDs=true

# Create LetsEncrypt ClusterIssuer
cat <<EOF | kubectl apply -f -
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: ${LETSENCRYPT_EMAIL}
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class: nginx
EOF

# Install Prometheus and Grafana
helm upgrade --install monitoring prometheus-community/kube-prometheus-stack \
  --namespace monitoring --create-namespace \
  --set grafana.adminPassword=${GRAFANA_PASSWORD}

# Create secrets
kubectl -n production create secret generic ai-mentor-secrets \
  --from-literal=database-url="${DATABASE_URL}" \
  --from-literal=jwt-secret="${JWT_SECRET}" \
  --from-literal=openai-api-key="${OPENAI_API_KEY}" \
  --from-literal=stripe-secret-key="${STRIPE_SECRET_KEY}" \
  --dry-run=client -o yaml | kubectl apply -f -

echo "Kubernetes cluster setup completed successfully!"
echo "Remember to configure DNS records to point to the Ingress Controller's external IP"