#!/bin/sh

# Log the directory structure
echo "Directory structure before caching views:"
ls -l resources/views

# Log environment variables
echo "Environment variables:"
env

# Log view path configuration using Artisan command
echo "View path configuration:"
php artisan log:view-paths

# Run database migrations
php artisan migrate --force

# Cache views
#php artisan view:cache

# Start PHP-FPM and Node.js server
php-fpm & node server-socket.js
