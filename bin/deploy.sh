#!/bin/bash

# TODO: this stuff is terrible ... need utilize docker-compose
docker build -t microservice-template .
docker create --link dev-mongo:mongo --publish 8080:8080 \
    --env NODE_ENV=testing \
    microservice-template


