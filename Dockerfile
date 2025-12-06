FROM php:8.4-apache

# Variables de entorno para versiones de Apache y dependencias
ARG DEBIAN_FRONTEND=noninteractive
# Install dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpng-dev \
    libjpeg62-turbo-dev \
    libfreetype6-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    locales \
    zip \
    jpegoptim optipng pngquant gifsicle \
    vim \
    unzip \
    git \
    curl \
    zlib1g-dev \
    libjpeg-dev

RUN docker-php-ext-configure gd --with-freetype-dir=/usr/include/ --with-jpeg-dir=/usr/include/ && \
    docker-php-ext-install gd

RUN docker-php-ext-install mysqli pdo pdo_mysql

RUN docker-php-ext-configure zip --with-libzip && \
    docker-php-ext-install zip

# Install extensions
RUN docker-php-ext-install mysqli mbstring exif pcntl bcmath zip
RUN docker-php-source delete

# Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Install composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

RUN curl -sS https://get.symfony.com/cli/installer | bash
RUN mv /root/.symfony/bin/symfony /usr/local/bin/symfony
RUN git config --global user.email "user@email.com" \
    && git config --global user.name "user name"

RUN pecl install -f xdebug apcu \
    && docker-php-ext-enable xdebug apcu

COPY /php/dev/xdebug.ini /usr/local/etc/php/conf.d/xdebug.ini

<<<<<<< HEAD
#install node
RUN curl -sL https://deb.nodesource.com/setup_16.x | bash -
RUN apt-get install -y nodejs
#install yarn
RUN curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt update && apt install yarn
WORKDIR /var/www/html
RUN a2enmod rewrite
=======
# ===============================
# 4️⃣ Configuración PHP personalizada
# ===============================
COPY config/php.ini /usr/local/etc/php/

# ===============================
# 5️⃣ Copiar código del proyecto
# ===============================
COPY www/ /var/www/html

# ===============================
# 6️⃣ Configurar cron jobs
# ===============================
COPY docker/cronjobs/my-cron /etc/cron.d/my-cron
RUN chmod 0644 /etc/cron.d/my-cron

# ===============================
# 7️⃣ Script de inicio
# ===============================
#COPY docker/start.sh /start.sh
#RUN chmod +x /start.sh    

COPY scripts/start-with-ngrok-choice.sh /start-with-ngrok-choice.sh
RUN chmod +x /start-with-ngrok-choice.sh

# ===============================
# 8️⃣ Crear carpeta logs y permisos
# ===============================
RUN mkdir -p /var/www/html/logs \
    && chown -R www-data:www-data /var/www/html/logs \
    && chmod -R 775 /var/www/html/logs

# ===============================
# 9️⃣ Configurar Apache
# ===============================
RUN a2enmod headers rewrite

# ===============================
# 🔟 Iniciar servicios
# ===============================
CMD ["/start-with-ngrok-choice.sh"]
>>>>>>> d7c3d81 (feat:se aplican scripts de creacion de servicios)
