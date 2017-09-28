# Getting Started - The Red Pill Route

Starting in the root directory of this repository 
(e.g. ~/projects/nodejs-docker-template), run the following commands:

 1. Use the Node Version Manager to ensure the correct version of node is installed:
 
   **nvm install**     
 
 2. Install the microservice development dependencies:
 
   **npm install**     

 3. Add the PM2 binaries to your *$PATH* variable:
 
   **export PATH="./node_modules/.bin:$PATH"**

 3. Create a directory to contain the microservice logfiles:
 
   **mkdir logs**    
 
 4. Create a directory to sandbox deployment dependencies:
 
   **mkdir sandbox** 
 
 5. Clone my okay fork of a MongoDB image:
 
   **git clone git@github.com:djaqua/docker-mongodb ./sandbox/docker-mongodb**
 
 
## Development 

You don't need to install PM2 globally (sudo npm -g install pm2) if you 
took the easy route and sourced the SourceMe file. That will install PM2 
locally (for development) and add the dependency bin directory to $PATH.


Here is the general workflow for the _Development_ stage of the microservice:

 1. Start the microservice:
 
   **npm run start**
  
    or
  
   **pm2 start pm2.config.json**
    
 2. Show the status of a process or omit the process-id to show the status of all processes:
 
   **pm2 status <process-id>**
     
 3. Tail the log for a process or omit the process-id to tail the combined log for all processes:
 
   **pm2 logs <process-id>**  

 4. Stop the microservice, flush the logs, then restart the microservice: 
 
   **pm2 stop <process-id> ; pm2 flush ; pm2 start <process-id>**     

 5. Kill all the pm2 processes:
 
   **pm2 delete all**
    
## Integration Testing
Follow these steps if you have modified *./config*, *./src*, *./package.json*, 
or *./pm2.config.json* and need to test your changes in a production-like 
environment
 
 1. Ensure that the development ecosystem is up and running:

   **docker run --detach --name dev-mongo --publish 27017:27017 \**
   **--env MONGODB_USERNAME=janie \**
   **--env MONGODB_PASSWORD="BylmOlirt5owEew#" \**
   **--env MONGODB_DBNAME=template_microservice \**
   **djaqua/mongodb**
     
 2. Build and run the microservice docker image:
  
   **docker stop <template-microservice-container-name>**
    
   **docker rm <template-microservice-container-name>**
    
   **docker rmi <template-microservice-image-tag>**
    
   **docker build -t <template-microservice-image-tag> .**
    
   **docker create --link dev-mongo:mongo \**
   **--port 8080:8080 \**
   **--env NODE_ENV=testing \**
   **--name <template-microservice-name> \**
   **<template-microservice-image-tag>**
     
   **docker run <template-microservice-name>**

  3. For each running container (**dps** or **docker ps**), run the following 
      commands:
   
   **docker stop <template-microservice-container-tag>**
   
  4. Once all the containers have been stopped, run the following command:
   
   **docker prune -a**
    
