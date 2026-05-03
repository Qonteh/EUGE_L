#!/bin/bash

# EUGE Trading Platform - Database Setup Script
# This script sets up the PostgreSQL database

set -e

echo "=========================================="
echo "EUGE Trading Platform - Database Setup"
echo "=========================================="

# Default values
DB_NAME="${DB_NAME:-euge_trading}"
DB_USER="${DB_USER:-postgres}"
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"

echo ""
echo "Database Configuration:"
echo "  Host: $DB_HOST"
echo "  Port: $DB_PORT"
echo "  Database: $DB_NAME"
echo "  User: $DB_USER"
echo ""

# Check if psql is installed
if ! command -v psql &> /dev/null; then
    echo "Error: PostgreSQL client (psql) is not installed."
    echo "Please install PostgreSQL first:"
    echo "  - macOS: brew install postgresql"
    echo "  - Ubuntu: sudo apt-get install postgresql postgresql-contrib"
    echo "  - Windows: Download from https://www.postgresql.org/download/windows/"
    exit 1
fi

# Create database if it doesn't exist
echo "Creating database '$DB_NAME' if it doesn't exist..."
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -tc "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME'" | grep -q 1 || \
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -c "CREATE DATABASE $DB_NAME"

# Run the schema
echo "Running database schema..."
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f database/schema.sql

echo ""
echo "=========================================="
echo "Database setup complete!"
echo "=========================================="
echo ""
echo "Your database is ready. Make sure to:"
echo "1. Copy .env.example to .env.local"
echo "2. Update DATABASE_URL with your credentials"
echo "3. Run 'npm run dev' to start the application"
echo ""
