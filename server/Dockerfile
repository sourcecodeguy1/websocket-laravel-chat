# Use an official PHP runtime as the base image
FROM php:8.2-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    npm

# Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Get latest Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Install Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && apt-get install -y nodejs

# Set the working directory
WORKDIR /var/www/html

# Copy the Laravel application code
COPY . .

# Ensure a default .env file exists
RUN cp .env.example .env || touch .env

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader

# Install Node.js dependencies
RUN npm install

# Build the frontend assets
RUN npm run production

# Generate the application key
RUN php artisan key:generate

# Create storage symlink
RUN php artisan storage:link

# Cache configuration and routes
RUN php artisan config:cache
RUN php artisan route:cache

# Change ownership and permissions of the Laravel application directory
RUN chown -R www-data:www-data /var/www/html
#RUN chmod -R 755 /var/www/html/resources/views

# Copy the initialization script
COPY init-laravel.sh /usr/local/bin/init-laravel.sh

# Make the initialization script executable
RUN chmod +x /usr/local/bin/init-laravel.sh

# Create the storage directories with correct permissions
RUN mkdir -p /var/www/html/storage/framework/{sessions,views,cache} && \
    chmod -R 775 /var/www/html/storage && \
    chown -R www-data:www-data /var/www/html/storage


# Expose ports
EXPOSE 9000
EXPOSE 3002

# Use the initialization script
ENTRYPOINT ["/usr/local/bin/init-laravel.sh"]
