# Getting Started - The Blue Pill Route

Starting in the root directory of this repository 
(e.g. ~/projects/nodejs-docker-template), run the following commands:
    
Choose the blue pill; use the *SourceMe* file to make life easy:

 1. Initialize the project and and get a bunch of aliases and utilities:
 
    <pre>
    source SourceMe
    </pre>
 
## Development 

Here is the general workflow for the _Development_ stage of the microservice:

 1. Ensure that the database service is running with the following commands:
   <pre>
   dbinit
   dcup dev-mongo
   </pre>

 2. Start the microservice:
 
   <pre>
   npm run start
   </pre> 
     or 
   <pre>
   pm2 start pm2.config.json
   </pre>
    
 3. Show the status of a process or omit the process-id to show the status of all processes:
  
   <pre>
   pps &lt;process-id&gt;
   </pre> 
     
 4. Tail the log for a process or omit the process-id to tail the combined log for all processes:
 
   <pre>
   plogs &lt;process-id&gt;
   </pre>

 5. Stop the microservice, flush the logs, then restart the microservice: 
 
   <pre>
   pcycle &lt;process-id&gt;
   </pre>

 6. Kill all the pm2 processes:
   
   <pre>
   pnuke
   </pre>
    
## Integration Testing
Follow these steps if you have modified *./config*, *./src*, *./package.json*, 
or *./pm2.config.json* and need to test your changes in a production-like 
environment
 
 1. Ensure that the development ecosystem is up and running:

    <pre>
    dbinit
    dcup dev-mongo
    </pre>
     
 2. Stop, rebuild images, and start multiple docker services:

    <pre>
    dcycle service-1 service-2 service-3 ...
    </pre>
     
 3. Nuke **all** the containers and images. If you used *SourceMe*, run the
    following command:

     <pre>
     dnuke
     </pre>

    
