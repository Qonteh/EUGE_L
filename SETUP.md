# EUGE Trading Platform - Complete Setup Guide

This guide will help you set up both the frontend (Next.js) and backend (PostgreSQL) for the EUGE Trading Platform.

---

## Prerequisites

Before you begin, make sure you have:

1. **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
2. **PostgreSQL** (v14 or higher) - [Download](https://www.postgresql.org/download/)
3. **npm** or **yarn** or **pnpm** (comes with Node.js)

---

## Step 1: Install Dependencies

```bash
# Clone the repository (if not already done)
git clone https://github.com/Qonteh/EUGE_L.git
cd EUGE_L

# Install Node.js dependencies
npm install

# Install PostgreSQL driver (required for database connection)
npm install pg @types/pg
```

---

## Step 2: Set Up PostgreSQL Database

### Option A: Using the Setup Script (Recommended)

```bash
# Make the script executable
chmod +x scripts/setup-db.sh

# Run the setup script
./scripts/setup-db.sh
```

### Option B: Manual Setup

1. **Start PostgreSQL** (if not running):
   ```bash
   # macOS (Homebrew)
   brew services start postgresql
   
   # Ubuntu/Debian
   sudo systemctl start postgresql
   
   # Windows
   # Start from Services or pgAdmin
   ```

2. **Create the database**:
   ```bash
   # Connect to PostgreSQL
   psql -U postgres
   
   # Create the database
   CREATE DATABASE euge_trading;
   
   # Exit psql
   \q
   ```

3. **Run the schema**:
   ```bash
   psql -U postgres -d euge_trading -f database/schema.sql
   ```

---

## Step 3: Configure Environment Variables

1. **Copy the example file**:
   ```bash
   cp .env.example .env.local
   ```

2. **Edit `.env.local`** with your database credentials:
   ```env
   DATABASE_URL=postgresql://postgres:your_password@localhost:5432/euge_trading
   ```

   Replace:
   - `postgres` with your PostgreSQL username
   - `your_password` with your PostgreSQL password
   - `localhost:5432` with your database host and port
   - `euge_trading` with your database name

---

## Step 4: Run the Application

### Development Mode

```bash
# Start the development server
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm run start
```

---

## Database Schema Overview

The database includes the following tables:

| Table | Description |
|-------|-------------|
| `admin_users` | Admin dashboard users and authentication |
| `qualification_questions` | Dynamic form questions with disqualification logic |
| `applications` | Submitted qualification form applications |
| `bookings` | Scheduled calendar appointments |
| `availability_settings` | Available days/times for booking |
| `blocked_dates` | Dates when bookings are disabled |
| `success_stories` | Testimonials and student success stories |
| `training_videos` | Video content library |
| `site_settings` | Global configuration settings |
| `landing_page_content` | Editable landing page content |
| `email_templates` | Email templates for notifications |
| `activity_log` | Admin action audit trail |
| `analytics_events` | User interaction tracking |

---

## API Endpoints

| Endpoint | Methods | Description |
|----------|---------|-------------|
| `/api/applications` | GET, POST, PATCH | Manage applications |
| `/api/bookings` | GET, POST, PATCH | Manage bookings |
| `/api/availability` | GET, POST, PATCH | Manage availability |
| `/api/questions` | GET, POST, PATCH, DELETE | Manage questions |
| `/api/videos` | GET, POST, PATCH, DELETE | Manage videos |
| `/api/success-stories` | GET, POST, PATCH, DELETE | Manage testimonials |
| `/api/settings` | GET, POST, PATCH | Manage settings |

---

## Troubleshooting

### Database Connection Issues

1. **Check PostgreSQL is running**:
   ```bash
   # Check status
   pg_isready -h localhost -p 5432
   ```

2. **Verify credentials**:
   ```bash
   psql -U postgres -d euge_trading -c "SELECT 1"
   ```

3. **Check firewall/network**: Ensure port 5432 is accessible

### Common Errors

| Error | Solution |
|-------|----------|
| `ECONNREFUSED` | PostgreSQL is not running. Start the service. |
| `password authentication failed` | Check DATABASE_URL password |
| `database "euge_trading" does not exist` | Run the setup script |
| `relation does not exist` | Run `database/schema.sql` |

---

## Project Structure

```
EUGE_L/
├── app/                    # Next.js app router pages
│   ├── admin/             # Admin dashboard pages
│   └── api/               # API route exports
├── backend/
│   ├── api/               # Backend API implementations
│   └── types/             # TypeScript types
├── database/
│   └── schema.sql         # PostgreSQL database schema
├── frontend/
│   └── components/        # React components
├── lib/
│   ├── db.ts             # Database connection
│   └── db-queries.ts     # Database query functions
├── scripts/
│   └── setup-db.sh       # Database setup script
├── .env.example          # Environment variables template
└── SETUP.md              # This file
```

---

## Need Help?

If you encounter any issues:
1. Check the troubleshooting section above
2. Review the console/terminal for error messages
3. Ensure all environment variables are set correctly
4. Verify PostgreSQL is running and accessible
