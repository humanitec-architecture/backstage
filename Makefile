# Disable all the default make stuff
MAKEFLAGS += --no-builtin-rules
.SUFFIXES:

## Display a list of the documented make targets
.PHONY: help
help:
	@echo Documented Make targets:
	@perl -e 'undef $$/; while (<>) { while ($$_ =~ /## (.*?)(?:\n# .*)*\n.PHONY:\s+(\S+).*/mg) { printf "\033[36m%-30s\033[0m %s\n", $$2, $$1 } }' $(MAKEFILE_LIST) | sort

.PHONY: .FORCE
.FORCE:

WORKLOAD_NAME = backstage
CONTAINER_NAME = backstage
CONTAINER_IMAGE = ${WORKLOAD_NAME}:test

.score-compose/state.yaml:
	score-compose init \
		--no-sample

compose.yaml: score.yaml .score-compose/state.yaml Makefile
	mkdir -p credentials && touch credentials/github-app-backstage-humanitec-credentials.yaml
	score-compose generate score.yaml \
		--build '${CONTAINER_NAME}={"context":".","tags":["${CONTAINER_IMAGE}"]}' \
		--override-property containers.${CONTAINER_NAME}.variables.GITHUB_ORG_ID="" \
		--override-property containers.${CONTAINER_NAME}.variables.GITHUB_APP_CLIENT_ID="" \
		--override-property containers.${CONTAINER_NAME}.variables.GITHUB_APP_CLIENT_SECRET="" \
		--override-property containers.${CONTAINER_NAME}.variables.HUMANITEC_ORG_ID="" \
		--override-property containers.${CONTAINER_NAME}.variables.HUMANITEC_TOKEN="" \
		--override-property containers.${CONTAINER_NAME}.variables.CLOUD_PROVIDER=""

## Generate a compose.yaml file from the score spec and launch it.
.PHONY: compose-up
compose-up: compose.yaml
	docker compose up --build -d --remove-orphans
	sleep 5

## Generate a compose.yaml file from the score spec, launch it and test (curl) the exposed container.
.PHONY: compose-test
compose-test: compose-up
	curl $$(score-compose resources get-outputs dns.default#${WORKLOAD_NAME}.dns --format '{{ .host }}:8080')

## Delete the containers running via compose down.
.PHONY: compose-down
compose-down:
	docker compose down -v --remove-orphans || true