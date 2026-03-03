
#!/bin/bash

OS := $(shell uname)

ifeq ($(OS),Darwin)
	UID = $(shell id -u)
	IP_DEBUG = host.docker.internal
else ifeq ($(OS),Linux)
	UID = $(shell id -u)
	IP_DEBUG = 172.17.0.1
else
	UID = 1000
	IP_DEBUG = host.docker.internal
endif

DOCKER_BE = local

help: ## Show this help message
	@echo 'usage: make [target]'
	@echo
	@echo 'targets:'
	@egrep '^(.+)\:\ ##\ (.+)' ${MAKEFILE_LIST} | column -t -c 2 -s ':#'

start: ## Start the containers
	docker network create www-network || true
	U_ID=${UID} docker compose up -d --build

start-wordpress: ## Start mysql + local (WordPress on PORT_LOCAL)
	U_ID=${UID} docker compose -f 'docker-compose.yml' --env-file ./docker/api.env up -d --build 'mysql' 'local'

stop: ## Stop the containers
	U_ID=${UID} docker compose stop

restart: ## Restart the containers
	$(MAKE) stop && $(MAKE) start

build: ## Rebuilds all the containers
	docker network create www-network || true
	U_ID=${UID} docker compose build --no-cache

prepare: ## Runs backend commands
	$(MAKE) composer-install

run: ## starts the test development server in detached mode
	U_ID=${UID} docker exec -it --user ${UID} ${DOCKER_BE} test serve -d

logs: ## Show test logs in real time
	U_ID=${UID} docker exec -it --user ${UID} ${DOCKER_BE} test server:log

# Backend commands
composer-install: ## Installs composer dependencies
	U_ID=${UID} docker exec --user ${UID} ${DOCKER_BE} composer install --no-interaction
# End backend commands

ssh-be: ## bash into the be container
	U_ID=${UID} docker exec -it --user ${UID} ${DOCKER_BE} bash

composer create-project drupal-composer/drupal-project:7.x-dev -n my_drupal

start-mysql: ## Start mysql container
	U_ID=${UID} docker compose -f 'docker-compose.yml' up -d --build 'mysql'

start-apache: ## Start the containers in local mode
	U_ID=${UID} docker compose -f 'docker-compose.yml' --env-file ./docker/api.env up -d --build 'local'

start-apache-wordpress: ## Alias of start-wordpress
	$(MAKE) start-wordpress

install-woocommerce: ## Wait for DB/WordPress and install WooCommerce
	bash ./scripts/install-woocommerce.sh