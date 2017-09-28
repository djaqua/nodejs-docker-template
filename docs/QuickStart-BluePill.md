# Getting Started - The Blue Pill Route

Starting in the root directory of this repository 
(e.g. ~/projects/nodejs-docker-template), run the following commands:
    
Choose the blue pill; use the *SourceMe* file to make life easy:

 1. Initialize the project and and get a bunch of aliases and utilities:
 
    **source SourceMe** 
 
## Development 

Here is the general workflow for the _Development_ stage of the microservice:

 1. Start the microservice:
 
   **npm run start**
  
    or
  
   **pm2 start pm2.config.json**
    
 2. Show the status of a process or omit the process-id to show the status of all processes:
  
   **pps _process-id_** 
     
 3. Tail the log for a process or omit the process-id to tail the combined log for all processes:
 
   **plogs _process-id_**  

 4. Stop the microservice, flush the logs, then restart the microservice: 
 
   **pcycle _process-id_**

 5. Kill all the pm2 processes:
   
   **pnuke**
    
## Integration Testing
Follow these steps if you have modified *./config*, *./src*, *./package.json*, 
or *./pm2.config.json* and need to test your changes in a production-like 
environment
 
 1. Ensure that the development ecosystem is up and running:

    **dcup dev-mongo**
     
 2. Build and run the microservice docker image:

    **dcycle --image _template-microservice-image-tag_**    
     
 3. Nuke **all** the containers and images. If you used *SourceMe*, run the
    following command:

     **dnuke**

    
