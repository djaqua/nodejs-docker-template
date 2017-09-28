# nodejs-docker-template
Template repo for a Dockerizable NodeJS microservice

## Architectural Overview
The **main entry point** is [**src/server.js**](src/server.js), which initializes and configures
this microservice and listens for incoming connections. The **configuration** 
engine is provided by [**src/configuration.js**](src/configuration.js) and follows the convention that dynamic 
configurations (e.g. command line parameters and environment variables) are 
prefered over static configurations (e.g. configuration files). 

### Configuration
This microservice uses a layered configuration based on both command line 
arguments and configuration files in the config directory. The configuration 
files are processed so that the last (and most specific) configuration is the 
winner. In example, [**default.json**](config/default.json) provides a generic template configuration, 
but [**development.json**](config/development.json) can override properties from the other or it can 
define new properties. The [README.md](config/README.md) in that directory 
has more information about the order in which the configuration files are 
processed. 


## Developing the Microservice
This microservice template is designed with developers in mind. The project is
laid out to make the _Development_ and _Integration Testing_ process as 
painless as possible. 

 * **SourceMe** - Non-destructively creates directories, sets environment 
  variables, initializes the project, and provides several intuitive utilities.

 * **./config/** - Provides runtime configurations for the microservice. Out of
  the box, this template includes configurations for both _Development_ 
  (development.json) and _Testing_ (testing.json).
 
 * **./src** - Location of the microservice source code, both public 
  and private.

 * **package.json** - Contains the metadata for this Node-based microservice as
  well as a list of module dependencies.
 
 * **pm2.config.json** - Provides a PM2 runtime configuration that supports,
  with consistency, the Development process as well as the Testing process.
 
 * **docker-compose.yml** - Embodies the integration test plan; specifies a
  production-like relationship between the components of the "bigger picture"
  with the added benefit of playing an active role during _Development_.

 * **Dockerfile** - Builds a production-ready Docker image for the 
  microservice. **TREAD LIGHTLY** and consider changes with respect to the 
  runtime configurations specified in _./config/_, _pm2.config.json_,
  and _docker-compose.yml_.

### Getting Started

Starting in the root directory of this repository 
(e.g. ~/projects/nodejs-docker-template), run the following commands:
    
Choose the blue pill; use the *SourceMe* file to make life easy:

 1. Initialize the project and and get a bunch of aliases and utilities:
 
    **source SourceMe** 

Or choose the red pill; do it manually because pain is what makes us human:

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
 
 
### Development 

You don't need to install PM2 globally (sudo npm -g install pm2) if you 
took the easy route and sourced the SourceMe file. That will install PM2 
locally (for development) and add the dependency bin directory to $PATH.


Here is the general workflow for the _Development_ stage of the microservice:

 1. Start the microservice:
 
    **npm run start**
  
    or
  
    **pm2 start pm2.config.json**
    
 2. Show the status of a process or omit the process-id to show the status of all processes:
 
    **pm2 status _process-id_**
  
    or if you chose the blue pill,
  
    **pps _process-id_** 
     
 3. Tail the log for a process or omit the process-id to tail the combined log for all processes:
 
    **pm2 logs _process-id_**  
  
    or if you chose the blue pill,
  
    **plogs _process-id_**  

 4. Stop the microservice, flush the logs, then restart the microservice: 
 
    **pm2 stop _process-id_ ; pm2 flush ; pm2 start _process-id_**     
  
    or if you chose the blue pill, you get step 3 for free :)
  
    **pcycle _process-id_**

 5. Kill all the pm2 processes:
 
    **pm2 delete all**
  
    Or if you chose the blue pill,
   
    **pnuke**
    
### Integration Testing
Follow these steps if you have modified *./config*, *./src*, *./package.json*, 
or *./pm2.config.json* and need to test your changes in a production-like 
environment
 
 1. Ensure that the development ecosystem is up and running:

    **dcup dev-mongo**
     
 2. Build and run the microservice docker image:
  
    **docker stop _template-microservice-container-name_**
    
    **docker rm _template-microservice-container-name_**
    
    **docker rmi _template-microservice-image-tag_**
    
    **docker build -t _template-microservice-image-tag_ .**
    
    **docker create --link dev-mongo:mongo \
     --port 8080:8080 \
     --env NODE_ENV=testing \
     --name _template_microservice_name_ \
     _template-microservice-image-tag_**
     
    **docker run _template-microservice-name_**
   
     Or, if you used *SourceMe*, just run

    **dcycle --image _template-microservice-image-tag_**    
     
 3. Nuke **all** the containers and images. If you used *SourceMe*, run the
    following command:

     **pnuke**

   But, if you chose the red pill, run the following commands:

  1. For each running container (**dps** or **docker ps**), run the following 
      commands:
   
     **docker stop _template-microservice-container-tag_**
   
  2. Once all the containers have been stopped, run the following command:
   
     **docker prune -a**
    
