#!/bin/bash

echo "==================================================="
echo "       SISKO APPS INSTALLER (Linux)"
echo "==================================================="
echo ""

# 1. Check Requirements
echo "[1/7] Checking Requirements..."
if ! command -v php &> /dev/null; then
    echo "ERROR: PHP could not be found."
    exit 1
fi
if ! command -v composer &> /dev/null; then
    echo "ERROR: Composer could not be found."
    exit 1
fi
if ! command -v npm &> /dev/null; then
    echo "ERROR: npm could not be found."
    exit 1
fi
echo "OK."
echo ""

# 2. Setup Environment
echo "[2/7] Setting up Environment Configuration..."
if [ ! -f .env ]; then
    echo "Copying .env.example to .env..."
    cp .env.example .env
else
    echo ".env file already exists. Skipping copy."
fi
echo ""

# 3. Dependencies
echo "[3/7] Installing Dependencies..."
echo "-- Installing PHP dependencies..."
composer install --optimize-autoloader --no-dev
echo "-- Installing Node.js dependencies..."
npm install
echo ""

# 4. Build Assets
echo "[4/7] Building Frontend Assets..."
npm run build
echo ""

# 5. Key Generation
echo "[5/7] Generating Application Key..."
php artisan key:generate
echo ""

# 6. Database Setup
echo "[6/7] Setting up Database..."
read -p "Do you want to run fresh migrations & seeds? (WARNING: DELETES ALL DATA) [y/N]: " run_migrate
if [[ "$run_migrate" =~ ^[Yy]$ ]]; then
    php artisan migrate:fresh --seed
else
    echo "Skipping database reset. Running normal migrate..."
    php artisan migrate
fi
echo ""

# 7. Final Polish & Permissions
echo "[7/7] Finalizing & Fixing Permissions..."
php artisan storage:link
php artisan route:cache
php artisan view:cache
php artisan config:cache

# Set permissions (Approximation, adjust user:group as needed)
chmod -R 775 storage bootstrap/cache
echo "Permissions set for storage and bootstrap/cache."

echo ""
echo "==================================================="
echo "     INSTALLATION COMPLETED SUCCESSFULLY!"
echo "==================================================="
echo ""
