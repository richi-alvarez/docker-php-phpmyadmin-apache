
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

DOCKER_BE = wordpress
E2E_BASE_URL ?= http://localhost:81

help: ## Show this help message
	@echo 'usage: make [target]'
	@echo
	@echo 'targets:'
	@egrep '^(.+)\:\ ##\ (.+)' ${MAKEFILE_LIST} | column -t -c 2 -s ':#'

stop: ## Stop the containers
	U_ID=${UID} docker compose stop  

restart: ## Restart the containers
	$(MAKE) stop && $(MAKE) start-mysql  && $(MAKE) start-wordpress 

build: ## Rebuilds all the containers
	docker network create www-network || true
	U_ID=${UID} docker compose build --no-cache

prepare: ## Runs backend commands
	$(MAKE) composer-install


logs: ## Show test logs in real time
	U_ID=${UID} docker exec -it --user ${UID} ${DOCKER_BE} test server:log

ssh-be: ## bash into the be container
	U_ID=${UID} docker exec -it --user ${UID} ${DOCKER_BE} bash

start-mysql: ## Start mysql container
	U_ID=${UID} docker compose -f 'docker-compose.yml' up -d --build 'mysql'

start-wordpress: ## Start the containers in local mode
	U_ID=${UID} docker compose -f 'docker-compose.yml' --env-file ../api.env up -d --build ${DOCKER_BE}

test-e2e: ## Run Playwright E2E tests (BASE URL configurable)
	cd ./www/e2e && BASE_URL=${E2E_BASE_URL} npx playwright test --reporter=line

test-payment: ## Run checkout payment flow with trace
	cd ./www/e2e && BASE_URL=${E2E_BASE_URL} npx playwright test checkout.spec.js --reporter=line --trace=on

test-payment-headed: ## Run checkout payment flow in headed mode
	cd ./www/e2e && BASE_URL=${E2E_BASE_URL} npx playwright test checkout.spec.js --reporter=line --trace=on --headed