# nodejs-docker-template
Template repo for a Dockerizable NodeJS microservice


## Getting Started
Starting in the root directory of this repository 
(e.g. ~/projects/nodejs-docker-template), run the following commands:
    
Make life easy by sourcing the SourceMe file:
  1. **source SourceMe**  
     - obtain useful aliases and environment variables for this template  
     - run a bunch of boilerplate operations  

Or do it manually because pain is what makes us human:  
  1. **nvm install** - installs the correct version of NodeJS  
  2. **npm install** - installs the microservice dependencies  


## Developing the Microservice

### Architectural Overview
The **main entry point** is **src/server.js**, which initializes and configures
this microservice and listens for incoming connections. The **configuration** 
engine is provided by **src/konf.js** and follows the convention that dynamic 
configurations (e.g. command line parameters and environment variables) are 
prefered over static configurations (e.g. configuration files). 



### Configuration
This microservice uses a layered configuration based on both command line 
arguments and configuration files in the config directory. The configuration 
files are processed so that the last (and most specific) configuration is the 
winner. In example, **default.json** provides a generic template configuration, 
but **development.json** can override properties from the other or it can 
define new properties. The [README.md](config/README.md) in that directory 
has more information about the order in which the configuration files are 
processed. 

### Developing at the NodeJS Layer 
For simplicity and consistency, the package scripts use pm2 to start and stop the microservice.  
  1. Start and stop the server through the package  
   **npm run start** - uses the development dependency version of PM2 to start the microservice  
   **npm run nuke** - stops the microservice, flushes the logs, and deletes the server process  

  2. Add and remove modules and packages to the microservice  
   **npm --save-dev install _package_**  
   **npm --save install _package_**  
   **npm install _package_**  
   **npm -g install _cli-package_**  

### PM2 Layer
You don't need to install PM2 globally (sudo npm -g install pm2) if you 
took the easy route and sourced the SourceMe file. That will install PM2 
locally (for development) and add the dependency bin directory to $PATH.

Here are some useful commands for administering pm2 processes:

  1. Start the microservice  
      **pm2 start src/server.js**
    
  2. Show the status of a process or omit the process-id to show the status of all processes  
      **pm2 status _process-id_**
     
  3. Tail the log for a process or omit the process-id to tail the combined log for all processes  
      **pm2 log _process-id_**  

  4. Stop a process  
      **pm2 stop _process-id_**
      
  5. Flush the logs  
      **pm2 flush**     
      
  6. Delete a process  
      **pm2 delete _process-id_**

    
## Deployment

  1. Utilize the configuration layer by providing command line arguments 
  to override those settings. 

    a. Passing command line arguments through PM2:
        pm2 start src/server.js -x -- --loglevel=debug --num=2 --str=Hello

    b. Passing command line arguments through Node:
        node -- --loglevel=debug

### Docker Image Layer 

  1. Build the microservice docker image  
    **docker build -t _microservice-name_ .**  
    
  2. List available images  
    **docker images**  
    
  3. Run the mocroservice docker image  
    **docker run _image-id_**  

  4. Remove an image  
    **docker rmi _image-id_**  


### Docker Container Layer
  1. List the running containers  
    **docker ps**  
     
  2. List all the containers  
    **docker ps -a**  
    
  3. Observe the microservice logs  
    **docker logs _container-id_**  
    
  4. Start and stop the microservice  
    **docker stop _container-id_**  
    **docker start _container-id_**  



