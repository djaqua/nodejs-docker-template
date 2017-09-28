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
You have before you two option; you can take the Blue Pill to make your life 
easy, or you can the Red Pill and do everything manually, because suffering 
is what makes us human.

  * [**The Red Pill**](docs/GettingStarted-RedPill.md)
  * [**The Blue Pill**](docs/GettingStarted-BluePill.md)
  
