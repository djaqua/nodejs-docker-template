FROM google/nodejs

WORKDIR /microservice

ADD package.json /microservice
RUN npm install pm2 -g
RUN npm install
ADD . /microservice

ENV NODE_ENV production
EXPOSE 80

# -- start the microservice
CMD ["pm2-docker", "src/server.js"]


