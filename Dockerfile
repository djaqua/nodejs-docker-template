FROM node:8.9.1

# WORKDIR doesn't necessarily have to match the directory name of the
# microservice. But, whatever WORKDIR is specified here also needs to
# be used in the docker-compose file with respect to mounted volumes.
WORKDIR /template_microservice_workdir

COPY package.json /template_microservice_workdir

RUN npm install pm2 --global
RUN npm install --production
RUN mkdir logs; \
    mkdir data

# This is the default port for the microservice, which both testing
# and production inherit.
EXPOSE 80

# TODO don't set NODE_ENV here; specify it in docker-compose.yml

# -- only copy the actual microservice stuff, not the project overhead
COPY ./pm2.config.json /template_microservice_workdir/pm2.config.json
COPY ./config /template_microservice_workdir/config
COPY ./src /template_microservice_workdir/src

# -- start the microservice
CMD ["pm2-docker", "pm2.config.json"]
