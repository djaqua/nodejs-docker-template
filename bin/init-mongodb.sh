#!/bin/bash

# init-mongodb.sh

PROJECT_HOME=${MICROSERVICE_PROJECT_HOME:-.}
DOCKER_MONGODB_HOME="${PROJECT_HOME}/sandbox/docker-mongodb"

if [[ ! -d "$DOCKER_MONGODB_HOME" ]]; then
    # pull this useful docker image down
    git clone git@github.com:frodenas/docker-mongodb.git $DOCKER_MONGODB_HOME
fi


