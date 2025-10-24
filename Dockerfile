FROM php:8.4-apache

# Variables de entorno para versiones de Apache y dependencias
ARG DEBIAN_FRONTEND=noninteractive
ARG APACHE_VERSION=2.4.59
ARG APR_VERSION=1.7.4
ARG APR_UTIL_VERSION=1.6.3

WORKDIR /var/www/html
# Mostrar versiones durante el build
RUN echo "Apache: ${APACHE_VERSION}, APR: ${APR_VERSION}, APR-util: ${APR_UTIL_VERSION}"

# Instalar dependencias necesarias
RUN apt-get update && apt-get install -y libssl-dev unzip \
   # cron \
    && rm -r /var/lib/apt/lists/*

# Actualizar PATH para incluir Apache compilado
ENV PATH="/usr/local/apache2/bin:$PATH"

# Instalar extensiones
COPY --from=mlocati/php-extension-installer /usr/bin/install-php-extensions /usr/bin/
RUN install-php-extensions redis memcached mysqli pdo_mysql zip mbstring exif pcntl bcmath gd intl

# Establecer archivo ini
RUN ln -s $PHP_INI_DIR/php.ini-production $PHP_INI_DIR/php.ini
# Instalar y configurar Xdebug
#RUN pecl install xdebug && docker-php-ext-enable xdebug
#RUN install-php-extensions xdebug && docker-php-ext-enable xdebug
#COPY /php/dev/xdebug.ini /usr/local/etc/php/conf.d/xdebug.ini


# ===============================
# 2️⃣ Instalar Composer
# ===============================
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# ===============================
# 3️⃣ Instalar y habilitar Xdebug
# ===============================
#RUN pecl install xdebug && docker-php-ext-enable xdebug
#COPY /php/dev/xdebug.ini /usr/local/etc/php/conf.d/xdebug.ini

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
COPY docker/start.sh /start.sh
RUN chmod +x /start.sh    

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
CMD ["/start.sh"]
