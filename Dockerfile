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

<<<<<<< HEAD
# Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*
=======
# Establecer archivo ini
RUN ln -s $PHP_INI_DIR/php.ini $PHP_INI_DIR/php.ini
# Instalar y configurar Xdebug
#RUN pecl install xdebug && docker-php-ext-enable xdebug
#RUN install-php-extensions xdebug && docker-php-ext-enable xdebug
#COPY /php/dev/xdebug.ini /usr/local/etc/php/conf.d/xdebug.ini
>>>>>>> f795e8f (feat:se ajusta docker-compose para purebas automatizadas con php)

# Install composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

RUN curl -sS https://get.symfony.com/cli/installer | bash
RUN mv /root/.symfony/bin/symfony /usr/local/bin/symfony
RUN git config --global user.email "user@email.com" \
    && git config --global user.name "user name"

RUN pecl install -f xdebug apcu \
    && docker-php-ext-enable xdebug apcu

COPY /php/dev/xdebug.ini /usr/local/etc/php/conf.d/xdebug.ini

#install node
RUN curl -sL https://deb.nodesource.com/setup_16.x | bash -
RUN apt-get install -y nodejs
#install yarn
RUN curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt update && apt install yarn
WORKDIR /var/www/html
RUN a2enmod rewrite
