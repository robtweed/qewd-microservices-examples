# Standalone QEWD MicroServices with Cach&eacute; or IRIS Natively on Windows


The instructions below explain how to get a set of QEWD Microservices 
running on a Windows system with Cach&eacute; or IRIS, capable of handling
a set of REST APIs, each of which will be handled on a specific MicroService.

Pre-built versions of the files used in this example can be found in the
[*/src/windows-iris-1*](./src/windows-iris-1) folder within this repo.

You can run each QEWD MicroService on the same or different Windows systems.

In fact, some
of the QEWD MicroServices can be running on Linux or a Raspberry Pi with Cach&eacute;, IRIS
or YottaDB, and can be running either natively or as Docker Containers, but this example
will assume that each MicroService is running on Windows natively with Cach&eacute; or IRIS.

If you are running more than one QEWD MicroService on the same physical Windows machine, then:

- each one must be configured to listen on a different port;

- each one can be connected to the same instance of Cach&eacute; or IRIS

  - and you may choose to connect to the same or different Cach&eacute; or IRIS namespaces from each MicroService


# Ensure the Cach&eacute; or IRIS C Callin Service is Enabled

QEWD uses the [*mg-dbx*](https://github.com/chrisemunt/mg-dbx) 
module to integrate with Cach&eacute; and IRIS, and *mg-dbx* requires the
C Callin Interface to be enabled on Cach&eacute; and IRIS.

To check and/or change this, open the Cach&eacute; / IRIS System Management Portal in the usual way.

Next, navigate the System Management Portal menus as follows:

- System Administration
  - Security
    - Services
      - %Service_Callin: Click on the link, then:

- Check the *Service Enabled* box and Click *Save*


# Install Node.js

You first need to [install Node.js](https://nodejs.org) on your Windows machine(s). Node.js versions 12.x and 14.x are supported.

Do not install earlier versions of Node.js, and if you already have an earlier version of Node.js
installed, you will need to update it.


# The Orchestrator

Every QEWD MicroService configuration must have one master QEWD service, known as the *Orchestrator*,
through which all external traffic flows, and whose purpose is to route the incoming requests
to the correct MicroService to handle each individual request.

Follow the instructions below to set up the Orchestrator system.


## Create a QEWD Installation Folder

Create a new folder/direcory on your Windows System where you will run your QEWD *Orchestrator*.

The directory name is up to you, but in these instructions I'll assume you've created:

        C:\qewd-orchestrator


## Create a *package.json* File

Under this installation folder, create a text file named *package.json*.  This is used to
control how QEWD is installed and started.  It should contain the following:

        {
          "name": "qewd-up",
          "version": "1.0.0",
          "description": "Automated QEWD Builder",
          "author": "Rob Tweed <rtweed@mgateway.com>",
          "scripts": {
            "start": "node node_modules/qewd/up/run_native"
          },
          "dependencies": {
            "qewd": ""
          }
        }


So you should now have a structure like this:

        C:\qewd-orchestrator
            |
            |_ package.json



## Create the QEWD Configuration Folder and Files

### Configuration Folder

Under the installation folder, create a sub-folder named *configuration*, ie you should now have a 
structure like this:


        C:\qewd-orchestrator
            |
            |_ package.json
            |
            |_ configuration


### *config.json* File

Next, create a text file named *config.json* within the *configuration* folder.  

You'll now have the following structure:

        C:\qewd-orchestrator
            |
            |_ package.json
            |
            |_ configuration
                 |
                 |- config.json



For our example, use the following as a starting point: copy and paste the content below into
your *config.json* file:

#### Cach&eacute;

        {
          "qewd": {
            "poolSize": 2,
            "port": 3000,
            "managementPassword": "rtyr56jh61!)ye5",
            "database": {
              "type": "dbx",
              "params": {
                "database": "Cache",
                "path": "C:\\InterSystems\\Cache2015\\Mgr",
                "username": "_SYSTEM",
                "password": "SYS",
                "namespace": "USER"
              }
            }
          },
          "microservices": [
            {
              "name": "login_service",
              "host": "192.168.1.74",
              "port": 3001,
              "apis": {
                "import": true,
                "imported": true
              }
            },
            {
              "name": "info_service",
              "host": "192.168.1.74",
              "port": 3002,
              "apis": {
                "import": true,
                "imported": true
              }
            }
          ],
          "jwt": {
            "secret": "f4b5659e-1556-451f-a80f-7afc70ca1f06"
          }
        }



### IRIS

        {
          "qewd": {
            "poolSize": 2,
            "port": 3000,
            "managementPassword": "rtyr56jh61!)ye5",
            "database": {
              "type": "dbx",
              "params": {
                "database": "IRIS",
                "path": "C:\\InterSystems\\IRIS\\Mgr",
                "username": "_SYSTEM",
                "password": "SYS",
                "namespace": "USER"
              }
            }
          },
          "microservices": [
            {
              "name": "login_service",
              "host": "192.168.1.74",
              "port": 3001,
              "apis": {
                "import": true,
                "imported": true
              }
            },
            {
              "name": "info_service",
              "host": "192.168.1.74",
              "port": 3002,
              "apis": {
                "import": true,
                "imported": true
              }
            }
          ],
          "jwt": {
            "secret": "f4b5659e-1556-451f-a80f-7afc70ca1f06"
          }
        }

### Edit the *config.json* to Match your Environment

You'll need to edit your *config.json* file to match your particular Windows configuration(s).
Let's go through the relevant settings you may want/need to change, one by one:

#### PoolSize

        "poolSize": 2,

- *poolsize*: allows you to specify the maximum number of Worker Processes that QEWD will create.
Keep this at or below your Cach&eacute; or IRIS license limit.  Any excess traffic will be queued
until a Worker Process is available, so you will never run out of license slots when using QEWD.  
As a rough rule of thumb, start with the poolsize equal to one less than the number of CPU cores
you have available.  By default, the poolsize is 1.

  Note that if you are going to be running one or more of the other QEWD MicroServices on the same physical Windows system (ie in addition to the *Orchestrator*), then the SUM of poolsizes for all your
co-located QEWD instances MUST NOT exceed your total Cach&eacute; or IRIS license process limit.

#### Port


        "port": 3000,

- *port*: the port on which QEWD's web server will listen. The *port* defaults to 8080.  If you are
going to be running one or more of the other QEWD MicroServices on the same physical Windows
system, each one (including the *Orchestrator*) **MUST** listen on a different port.


#### Management Password


        "managementPassword": "rtyr56jh61!)ye5",

- *managementPassword*: this is used by the *qewd-monitor* and *qewd-monitor-adminui* 
applications to authenticate its use.  Defaults to *keepThisSecret!*.  It is recommended that you always specify your own password to prevent anyone trying the default!


#### Database Parameters


        "database": "IRIS",
        "path": "C:\\InterSystems\\IRIS\\Mgr",
        "username": "_SYSTEM",
        "password": "SYS",
        "namespace": "USER"


- the *database* parameters must be either *Cache* or *IRIS*, depending on which technology you
are using.  Note that the values are case-sensitive.

- the *path* parameter specifies the location of the *mgr* directory of your Cach&eacute; or IRIS
installation.  Note that the path MUST use doubled-up back-slash characters, since this value is
used in a JavaScript setting where a single back-slash character denotes that the following
character is to be escaped.

- the *username* and *password* settings may need changing from the default values shown, 
depending on how you've set up the security settings for your Cach&eacute; or IRIS system.

- change the *namespace* if required, to connect your QEWD Worker processes to a different
Cach&eacute; or IRIS namespace.


#### JSON Web Token (JWT) Secret

        "jwt": {
          "secret": "f4b5659e-1556-451f-a80f-7afc70ca1f06"
        }

If you want, you can leave out this section from the *config.json* file.  If so, you'll find
that a randomly-generated uuid-formatted secret value will be automatically added to your
*config.json* file when QEWD is first started.

Alternatively you can opt to define/specify your own JWT secret value: it can be any
string value, but if you use your own, it is recommended that it is a long and complex-enough
value to prevent it being guessed: the JWT secret is a very important part of QEWD's
built-in security: traffic between the *Orchestrator* and QEWD MicroServices is only allowed
if the requests include a valid, unexpired JWT that each can recognise (which is all handled automatically by each QEWD instance).

**NOTE:** whether you use an automatically-generated or you own JWT secret value,
it is extremely important to understand that the same *JWT secret* value **MUST**
be defined on all of the QEWD MicroService instances.  So, if you allow QEWD to automatically
assign one to your *Orchestrator*, you must check and use that value in the modified *config.json*
file after you've started the *Orchestrator* for the first time.

Note also that you can start the *Orchestrator* without having actually defined and set up any of
the MicroService systems.  The QEWD *Orchestrator* system will automatically connect to
its configured MicroServices whenever they become available, but will just wait for them if
they don't yet physically exist.  So you can start the *Orchestrator* as soon as it's all set up
and configured, and then check its *config.json* file for the JWT secret value to use in the
other QEWD MicroService setups.



#### MicroService Definitions

The *Orchestrator* needs to know the logical names you'll use for each of your MicroServices,
and their physical connection details so it can connect to them.

Each MicroService is defined within the *microservices* array:

        "microservices": [
          ...
        ]

Each MicroService is defined by an object within this array, eg:

        {
          "name": "login_service",
          "host": "192.168.1.74",
          "port": 3001,
          "apis": {
            "import": true,
            "imported": true
          }
        }

Again, we'll describe these one by one:

##### name

        "name": "login_service",

This defines the logical name that will be used for this physical QEWD MicroService instance.
For this example, you must leave the names of the two MicroServices unchanged.  When you 
create your own MicroServices, the name can be any text string you like, but it MUST be
applied consistently across your MicroServices and Orchestrator.

##### host

        "host": "192.168.1.74",

This specifies the physical IP address or hostname of the MicroService.  The *host*
address MUST be accessible by the *Orchestrator*, but can be anywhere within your local network
or the Internet (if your Windows machine has access to an Internet connection)

##### host

        "port": 3001,

This specifies the physical port on which the MicroService will be listening for
connections.  The *host* address and port MUST be accessible by the *Orchestrator*.  The
*Orchestrator* will make a WebSocket connection to the specified *host* and *port*.

##### apis

        "apis": {
          "import": true,
          "imported": true
        }

QEWD has a built-in mechanism for importing a MicroService's APIs into the *Orchestrator's*
*routes.json* file.  However, in this example we don't want to use this, so these properties
tell QEWD that we've already imported them ourselves.

**Leave these properties unchanged**.




## *routes.json* File

Although the *Orchestrator* won't, itself, be handling the REST APIs, it needs to know
what is the valid set of REST APIs that are to be allowed, and also which MicroService
will be handling each REST API.  This information is defined in a file named *routes.json*.

The *routes.json* file is created alongside the *config.json* file, ie you'll have the following
structure:


        C:\qewd-orchestrator
            |
            |_ package.json
            |
            |_ configuration
                 |
                 |- config.json
                 |
                 |- routes.json


Paste the following content into your *routes.json* file:


        [
          {
            "uri": "/api/login",
            "method": "POST",
            "on_microservice": "login_service",
            "authenticate": false
          },
          {
            "uri": "/api/person",
            "method": "POST",
            "on_microservice": "info_service" 
          },
          {
            "uri": "/api/person/:id",
            "method": "GET",
            "on_microservice": "info_service" 
          },
          {
            "uri": "/api/person/:id",
            "method": "PUT",
            "on_microservice": "info_service" 
          },
          {
            "uri": "/api/person/:id",
            "method": "DELETE",
            "on_microservice": "info_service" 
          }
        ]



**Note:** the file must contain valid JSON syntax, so all property names and string values
must be **double-quoted**.  You **cannot** add comments to the file.


The *routes.json* file defines an array of API objects.  Each REST API is therefore defined
as an object with 3 or sometimes 4 properties:

- **uri**: specifies the REST API path.  This path may include variable components (defined
by a prefix of :)

- **method**: the HTTP method for the REST API path (typically GET, POST, PUT or DELETE)

- **on_microservice**: the logical name of the MicroService that will handle the API


By default, QEWD will expect that incoming REST API requests will be authenticated with
a valid JWT, provided as a Bearer token in the HTTP *Authorization* header, eg:


        Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJI.... etc

However, you'll usually not have a JWT available until you invoke an initial REST API,
typically one that authenticates the REST user - eg via a login REST API that includes
a username and password.  To make sure QEWD doesn't reject such a login API (because it
won't/can't contain an *Authorization* header with a JWT), you can tell the *Orchestrator*
to bypass its usual JWT authentication for specific REST APIs.

So in the example above you'll see the */api/login* API specified as:

          {
            "uri": "/api/login",
            "method": "POST",
            "on_microservice": "login_service",
            "authenticate": false
          },

In other words, by specifying the *authenicate* property with a value of *false*, we are telling
QEWD that this API is to be accepted without an *Authorization* header containing a valid JWT.



## Install QEWD

The *Orchestrator* is now ready for use, but first we must install QEWD and its
dependencies. This step only needs doing once.


Open a Windows Command session and type the following:


        cd \qewd-orchestrator

        npm install


You'll see it installing QEWD, and in the QEWD Installation folder (*c:\qewd-orchestrator*), 
you'll see a sub-folder named *node_modules* and a file named *package-lock.json* appear, 
eg your top-level folder structure should look like this:


        C:\qewd-orchestrator
            |
            |_ package.json
            |
            |_ package-lock.json
            |
            |_ configuration
            |
            |- apis
            |
            |- node_modules



When it completes, you're ready to start QEWD


## Starting the QEWD Orchestrator

Each time you want to start QEWD, within your Windows Console session, 
first make sure you're in your *Orchestrator's* QEWD Installation folder, eg

        cd \qewd-orchestrator

and then start QEWD by typing:

        npm start orchestrator

**NOTE**: It is VERY IMPORTANT that you add the extra parameter - *orchestrator* - to the
*npm start* command, so QEWD knows to handle this in the special way needed for a QEWD Orchestrator
 instance.




QEWD is ready for use when you see this (the poolsize and port will depend on your *config.json* settings):

        ========================================================
        ewd-qoper8 is up and running.  Max worker pool size: 2
        ========================================================
        ========================================================
        QEWD.js is listening on port 3000
        ========================================================


The first time you start the *Orchestrator*, it installs a bunch of extra things, so you'll see
new sub-folders named *www* and *qewd-apps* appear. QEWD has loaded in everything you need
for monitoring your system and for developing interactive applications if you wish to do so.


## Optional: Try the QEWD-Monitor Application

You can check that your *Orchestrator* instance is working correctly by running the
*qewd-monitor* application that will now have been installed:

Start the QEWD-Monitor application in your browser using the URL:

        http://x.x.x.x:3000/qewd-monitor

or try the latest version:

        http://x.x.x.x:3000/qewd-monitor-adminui


You'll need to enter the QEWD Management password.  Use the value that you
specified in the *managementPassword* property in your *Orchestrator's* *config.json* file.

You'll now see the Overview panel, from where you can monitor your QEWD run-time environment, view the master and worker process activity.

If the *qewd-monitor* application works correctly, then you can be sure that the *Orchestrator*
is working correctly and is ready for use.


You're now ready to set up the two MicroServices for this example.










# QEWD Application Run-Time Modes

## Interactive Mode

Using the *npm start* command above, the QEWD process will have started in *interactive* mode 
and you will see its log output appearing in your Console window.

In this mode you can manually start, stop and restart QEWD:

### Start QEWD

        npm start

### Stop QEWD

       CTRL&C

or use the QEWD-Monitor application.


## Background Mode

To run QEWD in a production setting, you should set it up to run as a Windows Service.  There
are several ways to do this and tools to manage/automate the process.  One that is worth
checking out is [NSSM](https://www.slideshare.net/robtweed/ewd-3-training-course-part-29-running-ewdxpress-as-a-service-on-windows).




