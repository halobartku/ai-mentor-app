# Deployment Guide

This guide covers deploying the AI Mentor App to production using Docker Swarm.

## Prerequisites

- Docker and Docker Swarm installed on production servers
- Domain name configured with DNS
- SSL certificates

## Production Setup

### 1. Initialize Docker Swarm

```bash
docker swarm init
```

### 2. Add Worker Nodes (Optional)

```bash
docker swarm join --token <token> <manager-ip>:2377
```

### 3. Configure Environment

1. Create production environment file:
```bash
cp .env.example .env.prod
```

2. Update environment variables with production values:
- `DATABASE_URL`
- `JWT_SECRET`
- `OPENAI_API_KEY`
- `STRIPE_SECRET_KEY`

### 4. SSL Certificates

1. Place SSL certificates in `nginx/certs/`:
- `fullchain.pem`
- `privkey.pem`

### 5. Deploy Stack

```bash
docker stack deploy -c docker-compose.prod.yml aimentor
```

### 6. Verify Deployment

```bash
docker stack ps aimentor
```

## Monitoring

### Logs

```bash
# View service logs
docker service logs aimentor_backend
```

### Scaling

```bash
# Scale backend service
docker service scale aimentor_backend=3
```

## Updates

### Rolling Updates

```bash
# Update backend service
docker service update --image yourusername/aimentor-backend:latest aimentor_backend
```

### Rollback

```bash
# Rollback to previous version
docker service rollback aimentor_backend
```

## Backup and Recovery

### Database Backup

```bash
# Create backup
docker exec -t aimentor_db pg_dump -U postgres aimentor > backup.sql
```

### Database Restore

```bash
# Restore from backup
docker exec -i aimentor_db psql -U postgres aimentor < backup.sql
```

## Troubleshooting

### Common Issues

1. Connection Refused
- Check if services are running: `docker service ls`
- Verify nginx configuration
- Check firewall rules

2. Database Connection Issues
- Verify DATABASE_URL environment variable
- Check database service status
- Ensure database migrations are up to date

3. SSL Certificate Problems
- Verify certificate paths in nginx configuration
- Check certificate expiration dates
- Ensure proper certificate permissions

### Health Checks

```bash
# Check service health
docker service inspect aimentor_backend --format='{{.UpdateStatus.State}}'
```

## Security Considerations

1. Environment Variables
- Use secrets management for sensitive data
- Regularly rotate API keys and secrets
- Never commit .env files to version control

2. Network Security
- Configure firewall rules
- Use private Docker registry
- Implement rate limiting

3. Monitoring and Alerting
- Set up logging aggregation
- Configure alerting for critical errors
- Monitor resource usage

## Performance Optimization

1. Caching
- Configure Redis caching
- Implement response caching in nginx
- Use CDN for static assets

2. Database
- Optimize queries
- Configure connection pooling
- Regular maintenance and cleanup

3. Application
- Enable compression
- Optimize Docker images
- Configure proper resource limits

## Maintenance

### Regular Tasks

1. Updates
- System updates
- Dependencies updates
- Security patches

2. Monitoring
- Resource usage
- Error rates
- Response times

3. Backup
- Database backups
- Configuration backups
- Verification of backup integrity