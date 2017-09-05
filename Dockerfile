FROM google/nodejs

# WORKDIR doesn't necessarily have to match the directory name of the
# microservice. But, whatever WORKDIR is specified here also needs to
# be used in the docker-compose file with respect to mounted volumes.
WORKDIR /template_microservice_workdir

COPY package.json /template_microservice_workdir
RUN npm install pm2 --global
RUN npm install
RUN mkdir logs; \
    mkdir data

EXPOSE 80

COPY . /template_microservice_workdir

# -- start the microservice
CMD ["pm2-docker", "src/server.js"]
