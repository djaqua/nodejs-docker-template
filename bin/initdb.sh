#!/bin/bash

docker run --detach --name dev-mongo --publish 27017:27017 \
 --env MONGODB_USERNAME=janie \
 --env MONGODB_PASSWORD="BylmOlirt5owEew#" \
 --env MONGODB_DBNAME=template_microservice \
 frodenas/mongodb

