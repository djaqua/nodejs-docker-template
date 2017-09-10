#!/bin/bash

PROJECT_HOME=${MICROSERVICE_PROJECT_HOME:-.}
DOCKER_MONGODB_HOME="${PROJECT_HOME}/sandbox/docker-mongodb"

if [[ ! -d "$DOCKER_MONGODB_HOME" ]]; then
    # pull this useful docker image down
    git clone git@github.com:frodenas/docker-mongodb.git $DOCKER_MONGODB_HOME
    docker build -t frodenas/mongodb $DOCKER_MONGODB_HOME
fi

docker run --detach --name dev-mongo --publish 27017:27017 \
 --env MONGODB_USERNAME=janie \
 --env MONGODB_PASSWORD="BylmOlirt5owEew#" \
 --env MONGODB_DBNAME=template_microservice \
 frodenas/mongodb

