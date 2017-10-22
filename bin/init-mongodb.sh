#!/bin/bash

# init-mongodb.sh

PROJECT_HOME=${MICROSERVICE_PROJECT_HOME:-.}
MONGO_IMAGE_SRC="${PROJECT_HOME}/sandbox/docker-mongodb"

if [[ ! -d "$DOCKER_MONGODB_HOME" ]]; then
    # pull this useful docker image down
    # git clone git@github.com:frodenas/docker-mongodb.git $MONGO_IMAGE_SOURCE
    git clone git@github.com:djaqua/docker-mongodb.git $MONGO_IMAGE_SOURCE
fi


