#!/bin/bash

# buildmongodb.sh

PROJECT_HOME=${MICROSERVICE_PROJECT_HOME:-.}
DOCKER_MONGODB_HOME="${PROJECT_HOME}/sandbox/docker-mongodb"

if [[ ! -d "$DOCKER_MONGODB_HOME" ]]; then
    init-mongodb.sh
fi

#docker build -t frodenas/mongodb $DOCKER_MONGODB_HOME
docker build -t djaqua/mongodb $DOCKER_MONGODB_HOME


