#!/bin/bash
set -e

echo "Waiting for PostgreSQL to be ready..."
while ! pg_isready -h ${DATABASE_HOST:-db} -p ${DATABASE_PORT:-5432} -U ${DATABASE_USER:-cashregister_user} -d ${DATABASE_NAME:-cashregister_db} > /dev/null 2>&1; do
  sleep 1
done

echo "PostgreSQL is ready!"

echo "Running database migrations..."
alembic upgrade head

echo "Starting application..."
exec "$@"
