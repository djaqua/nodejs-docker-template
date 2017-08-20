FROM google/nodejs

WORKDIR /template_microservice

ADD package.json /template_microservice
RUN npm install pm2 -g
RUN npm install
ADD . /template_microservice

ENV NODE_ENV production
EXPOSE 80 

# -- start the microservice
CMD ["pm2-docker", "src/server.js"]


