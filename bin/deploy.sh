#!/bin/bash

# TODO: this stuff is terrible ... need utilize docker-compose
docker build -t template-microservice .
docker create --link dev-mongo:mongo --publish 8080:8080 \
    --env NODE_ENV=testing \
    template-microservice


