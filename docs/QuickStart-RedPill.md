# Getting Started - The Red Pill Route

Starting in the root directory of this repository 
(e.g. ~/projects/nodejs-docker-template), run the following commands:

 1. Use the Node Version Manager to ensure the correct version of node is installed:
 
   <pre>
   nvm install
   </pre>
   
 2. Install the microservice development dependencies:
 
   <pre>
   npm install**   
   </pre>

 3. Add the PM2 binaries to your *$PATH* variable:
 
   <pre>
   export PATH="./node_modules/.bin:$PATH"
   </pre>

 3. Create a directory to contain the microservice logfiles:
 
   <pre>
   mkdir logs
   </pre>    
 
 4. Create a directory to sandbox deployment dependencies:
 
   <pre>
   mkdir sandbox
   </pre>
 
 5. Clone my okay fork of a MongoDB image:
 
   <pre>
   git clone git@github.com:djaqua/docker-mongodb ./sandbox/docker-mongodb
   </pre>
 
 
## Development 

You don't need to install PM2 globally (sudo npm -g install pm2) if you 
took the easy route and sourced the SourceMe file. That will install PM2 
locally (for development) and add the dependency bin directory to $PATH.


Here is the general workflow for the _Development_ stage of the microservice:

 1. Start the microservice:
    <pre>
    npm run start
    </pre>
    
    or
    
    <pre>  
    pm2 start pm2.config.json
    </pre>
    
 2. Show the status of a process or omit the process-id to show the status of all processes:
 
    <pre>
    pm2 status &lt;process-id&gt;
    </pre>
    
 3. Tail the log for a process or omit the process-id to tail the combined log for all processes:
 
    <pre>
    pm2 logs &lt;process-id&gt;
    </pre>

 4. Stop the microservice, flush the logs, then restart the microservice: 
 
    <pre>
    pm2 stop &lt;process-id&gt; ; pm2 flush ; pm2 start &lt;process-id&gt;     
    </pre>
    
 5. Kill all the pm2 processes:
 
    <pre>
    pm2 delete all
    </pre>
    
## Integration Testing
Follow these steps if you have modified *./config*, *./src*, *./package.json*, 
or *./pm2.config.json* and need to test your changes in a production-like 
environment
 
 1. Ensure that the development ecosystem is up and running:
    <pre>
    docker run --detach --name dev-mongo --publish 27017:27017 \
    --env MONGODB_USERNAME=janie \
    --env MONGODB_PASSWORD="BylmOlirt5owEew#" \
    --env MONGODB_DBNAME=template_microservice \
    djaqua/mongodb
    </pre>
     
 2. Build and run the microservice docker image: 
    <pre>
 
    docker stop &lt;template-microservice-container-name&gt;
   
    docker rm &lt;template-microservice-container-name&gt;
    
    docker rmi &lt;template-microservice-image-tag&gt;
    
    docker build -t &lt;template-microservice-image-tag&gt; .
    
    docker create --link dev-mongo:mongo \
    
    &#9;--port 8080:8080 \
      
    &#9;--env NODE_ENV=testing \
      
    &#9;--name &lt;template-microservice-name&gt; \
      
    &#9;&lt;template-microservice-image-tag&gt;
    
    docker run &lt;template-microservice-name&gt;
    
    </pre>

  3. For each running container (**dps** or **docker ps**), run the following 
      commands: 
   
     <pre>
     docker stop &lt;template-microservice-container-tag&gt;
     </pre>
   
  4. Once all the containers have been stopped, run the following command: 
   
     <pre>
     docker prune -a
     </pre>
    
