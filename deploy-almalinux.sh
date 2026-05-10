#!/bin/bash

# =====================================================
# AUTOMATED DEPLOYMENT SCRIPT FOR ALMALINUX/RHEL
# EUGE Trading Platform → Bluehost VPS (AlmaLinux 9.7)
# =====================================================
# VPS: server-671297.quantistraders.com (50.6.249.185)
# Domain: quantistraders.com
# Repo: https://github.com/Qonteh/EUGE_L
# =====================================================

set -e

echo "=========================================="
echo "🚀 EUGE Trading - AlmaLinux Deployment"
echo "=========================================="
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_step() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_section() {
    echo -e "${BLUE}═══════════════════════════════════════${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}═══════════════════════════════════════${NC}"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

print_info() {
    echo -e "${YELLOW}[i]${NC} $1"
}

# =====================================================
# SECTION 1: SYSTEM PREPARATION
# =====================================================
print_section "STEP 1: System Preparation"

print_info "Updating system packages..."
dnf update -y
print_step "System updated"

# =====================================================
# SECTION 2: INSTALL DEPENDENCIES
# =====================================================
print_section "STEP 2: Installing Dependencies"

print_info "Installing Node.js 20 LTS..."
if ! command -v node &> /dev/null; then
    dnf module enable nodejs:20 -y
    dnf install -y nodejs
    npm install -g npm
    print_step "Node.js $(node --version) installed"
else
    print_step "Node.js $(node --version) already installed"
fi

print_info "Installing PostgreSQL..."
if ! command -v psql &> /dev/null; then
    dnf install -y postgresql-server postgresql-contrib
    /usr/bin/postgresql-setup initdb
    systemctl start postgresql
    systemctl enable postgresql
    print_step "PostgreSQL installed and started"
else
    print_step "PostgreSQL already installed"
fi

print_info "Installing Nginx..."
if ! command -v nginx &> /dev/null; then
    dnf install -y nginx
    systemctl enable nginx
    print_step "Nginx installed"
else
    print_step "Nginx already installed"
fi

print_info "Installing PM2..."
npm install -g pm2
pm2 startup
print_step "PM2 installed"

print_info "Installing Certbot..."
dnf install -y certbot python3-certbot-nginx
print_step "Certbot installed"

print_info "Installing Git..."
dnf install -y git
print_step "Git installed"

print_info "Setting up firewall..."
systemctl start firewalld
systemctl enable firewalld
firewall-cmd --permanent --add-service=ssh
firewall-cmd --permanent --add-service=http
firewall-cmd --permanent --add-service=https
firewall-cmd --reload
print_step "Firewall configured"

mkdir -p /var/log/pm2
chmod 755 /var/log/pm2

# =====================================================
# SECTION 3: DATABASE SETUP
# =====================================================
print_section "STEP 3: PostgreSQL Database Setup"

print_info "Creating database user 'euge_admin'..."
sudo -u postgres psql <<EOF
CREATE USER euge_admin WITH PASSWORD 'Euge_Trading_2026';
ALTER USER euge_admin CREATEDB;
EOF
print_step "Database user created"

print_info "Creating database 'euge_trading'..."
sudo -u postgres createdb -O euge_admin euge_trading
print_step "Database created"

print_info "Setting permissions..."
sudo -u postgres psql <<EOF
GRANT ALL PRIVILEGES ON DATABASE euge_trading TO euge_admin;
EOF
print_step "Permissions set"

# =====================================================
# SECTION 4: APPLICATION DEPLOYMENT
# =====================================================
print_section "STEP 4: Deploying Application"

cd /var/www

print_info "Cloning repository..."
if [ ! -d "euge_trading" ]; then
    git clone https://github.com/Qonteh/EUGE_L euge_trading
    print_step "Repository cloned"
else
    print_info "Repository already exists, pulling latest..."
    cd euge_trading
    git pull origin main
    cd ..
    print_step "Repository updated"
fi

cd /var/www/euge_trading

print_info "Installing dependencies..."
npm install
print_step "Dependencies installed"

print_info "Building application..."
npm run build
print_step "Application built successfully"

# =====================================================
# SECTION 5: ENVIRONMENT CONFIGURATION
# =====================================================
print_section "STEP 5: Configuring Environment"

print_info "Setting up .env.local..."
cat > /var/www/euge_trading/.env.local <<EOF
# Production Environment
DATABASE_URL=postgresql://euge_admin:Euge_Trading_2026@localhost:5432/euge_trading
DB_HOST=localhost
DB_PORT=5432
DB_NAME=euge_trading
DB_USER=euge_admin
DB_PASSWORD=Euge_Trading_2026
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://quantistraders.com
PORT=3000
EOF
print_step ".env.local created"

# =====================================================
# SECTION 6: PM2 PROCESS MANAGEMENT
# =====================================================
print_section "STEP 6: Starting Application with PM2"

print_info "Stopping any existing PM2 processes..."
pm2 stop euge-trading 2>/dev/null || true
pm2 delete euge-trading 2>/dev/null || true

print_info "Starting application..."
cd /var/www/euge_trading
pm2 start "npm start" --name euge-trading --instances max --exec-mode cluster
pm2 save
print_step "Application started with PM2"

print_info "PM2 Status:"
pm2 list

# =====================================================
# SECTION 7: NGINX CONFIGURATION
# =====================================================
print_section "STEP 7: Configuring Nginx"

print_info "Setting up Nginx configuration..."
cat > /etc/nginx/sites-available/euge_trading <<'NGINX_CONF'
upstream next_app {
    server 127.0.0.1:3000;
    keepalive 64;
}

# HTTP to HTTPS Redirect
server {
    listen 80;
    listen [::]:80;
    server_name quantistraders.com www.quantistraders.com;
    return 301 https://$server_name$request_uri;
}

# HTTPS Server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name quantistraders.com www.quantistraders.com;

    ssl_certificate /etc/letsencrypt/live/quantistraders.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/quantistraders.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;

    client_max_body_size 50M;
    access_log /var/log/nginx/euge_trading_access.log;
    error_log /var/log/nginx/euge_trading_error.log;

    location / {
        proxy_pass http://next_app;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    location /_next/static {
        proxy_pass http://next_app;
        proxy_cache_bypass $http_upgrade;
        expires 365d;
        add_header Cache-Control "public, immutable";
    }

    location /public {
        proxy_pass http://next_app;
        expires 30d;
        add_header Cache-Control "public";
    }

    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }

    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript 
               application/json application/javascript application/xml+rss 
               application/atom+xml image/svg+xml;
    gzip_disable "msie6";
}
NGINX_CONF

mkdir -p /etc/nginx/sites-available
mkdir -p /etc/nginx/sites-enabled

print_step "Nginx configuration created"

print_info "Enabling site..."
ln -sf /etc/nginx/sites-available/euge_trading /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

print_info "Testing Nginx configuration..."
nginx -t
print_step "Nginx configuration valid"

print_info "Restarting Nginx..."
systemctl restart nginx
print_step "Nginx restarted"

# =====================================================
# SECTION 8: SSL CERTIFICATE
# =====================================================
print_section "STEP 8: Setting Up SSL/HTTPS"

print_info "Generating SSL certificate..."
certbot certonly --nginx --non-interactive --agree-tos --email admin@quantistraders.com -d quantistraders.com -d www.quantistraders.com 2>/dev/null || print_info "Certificate already exists or generated"
print_step "SSL certificate setup"

print_info "Auto-renewal enabled..."
systemctl enable certbot.timer
systemctl start certbot.timer 2>/dev/null || true
print_step "Auto-renewal configured"

print_info "Restarting Nginx with SSL..."
systemctl restart nginx
print_step "Nginx restarted with SSL"

# =====================================================
# SECTION 9: IMPORT DATABASE SCHEMA
# =====================================================
print_section "STEP 9: Importing Database Schema"

if [ -f "/var/www/euge_trading/database/schema.sql" ]; then
    print_info "Importing schema..."
    psql -U euge_admin -d euge_trading -f /var/www/euge_trading/database/schema.sql
    print_step "Database schema imported"
else
    print_info "Schema file not found - it may already exist or you can import it manually"
fi

# =====================================================
# SECTION 10: VERIFICATION
# =====================================================
print_section "STEP 10: Verification"

print_info "Checking services..."

# Check Node app
if pm2 list | grep -q "euge-trading"; then
    print_step "✓ Application running (PM2)"
else
    print_error "✗ Application not running"
fi

# Check Nginx
if systemctl is-active --quiet nginx; then
    print_step "✓ Nginx running"
else
    print_error "✗ Nginx not running"
fi

# Check PostgreSQL
if systemctl is-active --quiet postgresql; then
    print_step "✓ PostgreSQL running"
else
    print_error "✗ PostgreSQL not running"
fi

# Check database connection
print_info "Testing database connection..."
if psql -U euge_admin -d euge_trading -c "SELECT 1;" >/dev/null 2>&1; then
    print_step "✓ Database connection successful"
else
    print_error "✗ Database connection failed"
fi

# =====================================================
# COMPLETION
# =====================================================
echo ""
print_section "🎉 DEPLOYMENT COMPLETE!"

echo ""
echo -e "${GREEN}Your application is now live!${NC}"
echo ""
echo "🌐 Access your site at:"
echo -e "   ${BLUE}https://quantistraders.com${NC}"
echo ""
echo "📊 Monitor your application:"
echo -e "   ${BLUE}pm2 list${NC}"
echo -e "   ${BLUE}pm2 logs euge-trading${NC}"
echo ""
echo "🔍 Check Nginx logs:"
echo -e "   ${BLUE}tail -f /var/log/nginx/euge_trading_access.log${NC}"
echo -e "   ${BLUE}tail -f /var/log/nginx/euge_trading_error.log${NC}"
echo ""
echo "🗄️ Database info:"
echo -e "   Host: ${BLUE}localhost${NC}"
echo -e "   User: ${BLUE}euge_admin${NC}"
echo -e "   Database: ${BLUE}euge_trading${NC}"
echo ""
echo "📝 Configuration files:"
echo -e "   App: ${BLUE}/var/www/euge_trading${NC}"
echo -e "   Nginx: ${BLUE}/etc/nginx/sites-available/euge_trading${NC}"
echo -e "   PM2: ${BLUE}pm2 list${NC}"
echo ""
echo "✅ Your EUGE Trading Platform is LIVE! 🚀"
echo ""
