FROM php:8.1-apache
#FROM php:5.6-apache

# Variables de entorno para versiones de Apache y dependencias
ARG DEBIAN_FRONTEND=noninteractive
ARG APACHE_VERSION=2.4.59
ARG APR_VERSION=1.7.4
ARG APR_UTIL_VERSION=1.6.3

WORKDIR /var/www/html
# Mostrar versiones durante el build
RUN echo "Apache: ${APACHE_VERSION}, APR: ${APR_VERSION}, APR-util: ${APR_UTIL_VERSION}"

# =============================== 
# 1️⃣ Actualizar repositorios y dependencias php 5.6
# ===============================
# RUN sed -ri 's|deb.debian.org/debian|archive.debian.org/debian|g; s|security.debian.org/debian-security|archive.debian.org/debian-security|g' /etc/apt/sources.list \
# 	&& sed -ri '/stretch-updates/d' /etc/apt/sources.list \
# 	&& echo 'Acquire::Check-Valid-Until "false";' > /etc/apt/apt.conf.d/99no-check-valid-until \
# 	&& echo 'Acquire::AllowInsecureRepositories "true";' > /etc/apt/apt.conf.d/99allow-insecure \
# 	&& echo 'APT::Get::AllowUnauthenticated "true";' > /etc/apt/apt.conf.d/99allow-unauthenticated \
# 	&& apt-get -o Acquire::Check-Valid-Until=false update \
# 	&& apt-get install -y --no-install-recommends --allow-unauthenticated git \
# 	&& rm -rf /var/lib/apt/lists/* YhQcK2Wy

# Instalar dependencias necesarias
RUN apt-get update && apt-get install -y \
    libssl-dev \
    unzip \
    wait-for-it \
    locales \
    libfreetype6-dev \
    libjpeg62-turbo-dev \
    libpng-dev \
    libzip-dev \
    libcurl3-dev \
    libwebp-dev \
    && echo "en_US.UTF-8 UTF-8" > /etc/locale.gen \
    && locale-gen en_US.UTF-8 \
    && update-locale LANG=en_US.UTF-8 LC_ALL=en_US.UTF-8 \
    && docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp \
    && docker-php-ext-install -j$(nproc) gd zip mysqli curl \
    && docker-php-ext-enable gd zip mysqli curl \
    && rm -r /var/lib/apt/lists/*

# Actualizar PATH para incluir Apache compilado
ENV PATH="/usr/local/apache2/bin:$PATH"
ENV LANG=en_US.UTF-8
ENV LANGUAGE=en_US:en
ENV LC_ALL=en_US.UTF-8

# Instalar extensiones
COPY --from=mlocati/php-extension-installer /usr/bin/install-php-extensions /usr/bin/
RUN install-php-extensions redis memcached mysqli pdo_mysql zip mbstring exif pcntl bcmath gd intl ldap soap

# ===============================
# 2️⃣ Instalar Composer
# ===============================
RUN curl -sS https://getcomposer.org/installer | php -- \
    --install-dir=/usr/local/bin \
    --filename=composer \
    --version=2.7.0
# ===============================
# 3️⃣ Instalar y habilitar Xdebug
# ===============================
RUN pecl install xdebug && docker-php-ext-enable xdebug
COPY php/dev/xdebug.ini /usr/local/etc/php/conf.d/xdebug.ini

#install node
#RUN curl -sL https://deb.nodesource.com/setup_22.x | bash -
#RUN apt-get install -y nodejs
#install yarn
# RUN curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
# RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
# RUN apt update && apt install yarn


# ===============================
# 4️⃣ Configuración PHP personalizada
# ===============================
COPY php/php.ini /usr/local/etc/php/


COPY php/000-default.conf /etc/apache2/sites-available/000-default.conf

# ===============================
# 5️⃣ Copiar código del proyecto
# ===============================
COPY www/ /var/www/html

# ===============================
# 6️⃣ Configurar cron jobs
# ===============================
#COPY docker/cronjobs/my-cron /etc/cron.d/my-cron
#RUN chmod 0644 /etc/cron.d/my-cron

# ===============================
# 7️⃣ Script de inicio
# ===============================
#COPY docker/start.sh /start.sh
#RUN chmod +x /start.sh    

#COPY scripts/start-with-ngrok-choice.sh /start-with-ngrok-choice.sh
#RUN chmod +x /start-with-ngrok-choice.sh

# ===============================
# 8️⃣ Crear carpeta logs y permisos
# ===============================
# RUN mkdir -p /var/www/html/logs \
#     && chown -R www-data:www-data /var/www/html/logs \
#     && chmod -R 775 /var/www/html/logs

# ===============================
# 9️⃣ Configurar Apache
# ===============================
RUN a2enmod headers rewrite

EXPOSE 80