#!/bin/bash

# pull this useful docker image down
#git clone git@github.com:frodenas/docker-mongodb.git

# put it together
docker build ./docker-mongodb
docker run \
    --detach \
    --name dev-mongo \
    --publish 27017:27017 \
    --env MONGODB_USERNAME="janie" \
    --env MONGODB_PASSWORD="alphabeta" \
    --env MONGODB_DBNAME="template_microservice" \
    frodenas/mongodb



