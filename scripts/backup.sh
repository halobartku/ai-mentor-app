#!/bin/bash

# Exit on error
set -e

# Load environment variables
set -a
source .env.production
set +a

# Create backup directory
BACKUP_DIR="backups/$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

# Backup database
echo "Backing up database..."
PGPASSWORD=$DB_PASSWORD pg_dump \
  -h $DB_HOST \
  -U $DB_USER \
  $DB_NAME > "$BACKUP_DIR/database.sql"

# Backup Redis
echo "Backing up Redis..."
docker exec aimentor_redis redis-cli save
docker cp aimentor_redis:/data/dump.rdb "$BACKUP_DIR/redis.rdb"

# Backup environment files
echo "Backing up configuration..."
cp .env.production "$BACKUP_DIR/"
cp docker-compose.production.yml "$BACKUP_DIR/"

# Compress backup
tar -czf "$BACKUP_DIR.tar.gz" "$BACKUP_DIR"
rm -rf "$BACKUP_DIR"

echo "Backup completed: $BACKUP_DIR.tar.gz"