# Deployment Guide

## Prerequisites

- Docker and Docker Swarm initialized on production servers
- SSL certificates ready in `nginx/ssl/`
- Environment variables configured in `.env.production`
- Docker registry access configured

## Production Environment Setup

### 1. Initialize Swarm

```bash
# On manager node
docker swarm init --advertise-addr <MANAGER-IP>

# On worker nodes (using token from manager init)
docker swarm join --token <TOKEN> <MANAGER-IP>:2377
```

### 2. Configure Environment

Create `.env.production` with required variables:

```env
DOCKER_REGISTRY=your-registry
TAG=latest
DATABASE_URL=postgresql://user:pass@host:5432/dbname
REDIS_URL=redis://redis:6379
JWT_SECRET=your-secret
OPENAI_API_KEY=your-key
STRIPE_SECRET_KEY=your-key
GRAFANA_PASSWORD=admin-password
```

### 3. SSL Certificates

Place SSL certificates in `nginx/ssl/`:
- `fullchain.pem`
- `privkey.pem`

### 4. Deploy Stack

```bash
# Deploy using script
./scripts/deploy.sh

# Or manually
docker stack deploy -c docker-compose.production.yml aimentor
```

## Monitoring

### Access Monitoring Tools

- Grafana: https://aimentor.app/grafana
- Prometheus: https://aimentor.app/prometheus

### View Logs

```bash
# View service logs
docker service logs aimentor_api

# View specific container logs
docker logs <container-id>
```

### Check Service Status

```bash
# List services
docker service ls

# View service details
docker service ps aimentor_api
```

## Scaling

### Scale Services

```bash
# Scale API service
docker service scale aimentor_api=6

# Scale nginx
docker service scale aimentor_nginx=3
```

### Resource Limits

Adjust resource limits in `docker-compose.production.yml`:
```yaml
deploy:
  resources:
    limits:
      cpus: '1'
      memory: 1G
```

## Backup and Recovery

### Database Backup

```bash
# Create backup
pg_dump -h host -U user dbname > backup.sql

# Restore from backup
psql -h host -U user dbname < backup.sql
```

### Redis Backup

```bash
# Save redis data
redis-cli save

# Copy dump.rdb
docker cp aimentor_redis:/data/dump.rdb ./redis-backup/
```

## Troubleshooting

### Common Issues

1. Service Won't Start
   - Check logs: `docker service logs aimentor_api`
   - Verify environment variables
   - Check resource limits

2. High Memory Usage
   - Monitor with Grafana
   - Adjust resource limits
   - Check for memory leaks

3. Slow Response Times
   - Check Prometheus metrics
   - Verify Redis connection
   - Monitor database performance

### Health Checks

```bash
# API health
curl https://aimentor.app/health

# Redis health
redis-cli ping

# Database health
pg_isready -h host -p 5432
```

## Security

### SSL/TLS

- Certificates auto-renewed with certbot
- Strong cipher suite configured in nginx
- HTTP redirects to HTTPS

### Firewalls

```bash
# Allow required ports
ufw allow 80,443/tcp
ufw allow 2377/tcp  # Swarm
ufw allow 7946/tcp  # Swarm
ufw enable
```

### Updates

```bash
# Update images
docker pull ${DOCKER_REGISTRY}/ai-mentor-api:latest

# Deploy updates
./scripts/deploy.sh
```