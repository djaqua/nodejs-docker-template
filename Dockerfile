FROM google/nodejs

# WORKDIR doesn't necessarily have to match the directory name of the 
# microservice. But, whatever WORKDIR is specified here also needs to 
# be used in the docker-compose file with respect to mounted volumes.
WORKDIR /template_microservice_workdir

ADD package.json /template_microservice_workdir
RUN npm install pm2 --global
RUN npm install
ADD . /template_microservice_workdir

ENV NODE_ENV production
EXPOSE 80 

# -- start the microservice
CMD ["pm2-docker", "src/server.js"]


