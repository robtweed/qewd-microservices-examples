# Standalone QEWD MicroServices with Cach&eacute; or IRIS Natively on Windows

## Contents

- [Introduction](#introduction)
- [Initial Steps](#initial-steps)
- [The Orchestrator](#the-orchestrator)
- [Setting up the MicroServices](#setting-up-the-microservices)
  - [login_service](#setting-up-the-login_service-microservice)
  - [info_service](#setting-up-the-info_service-microservice)
- [Testing the Completed System](#testing-the-completed-system)
- [Modifying/Maintaining the REST APIs](#modifying--maintaining-the-rest-apis)
- [MicroService Security](#microservice-security)
- [QEWD Application Run-time Modes](#qewd-application-run-time-modes)

----

# Introduction

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

----

# Initial Steps


## Ensure the C Callin Service is Enabled

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


## Install Node.js

You first need to [install Node.js](https://nodejs.org) on your Windows machine(s). Node.js versions 12.x and 14.x are supported.

Do not install earlier versions of Node.js, and if you already have an earlier version of Node.js
installed, you will need to update it.

----

# The Orchestrator

Every QEWD MicroService configuration must have one master QEWD service, known as the *Orchestrator*,
through which all external traffic flows, and whose purpose is to route the incoming requests
to the correct MicroService to handle each individual request.

Follow the instructions below to set up the Orchestrator system.  You'll find pre-built
copies of the files described below [here](./src/windows-iris-1/orchestrator).


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



#### IRIS

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

So, **leave the apis properties unchanged**.




### *routes.json* File

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


        starting microService connection to http://192.168.1.74:3001
        starting microService connection to http://192.168.1.74:3002
        webServerRootPath = C:\qewd-orchestrator/orchestrator/www/
        route /api will be handled by qx.router
        Worker Bootstrap Module file written to node_modules/ewd-qoper8-worker.js
        ========================================================
        ewd-qoper8 is up and running.  Max worker pool size: 2
        ========================================================
        ========================================================
        QEWD.js is listening on port 3000
        ========================================================


Notice these lines which show that your *orchestrator* will attempt to
connect to your MicroServices using the credentials that were in the *config.json*
file:

        starting microService connection to http://192.168.1.74:3001
        starting microService connection to http://192.168.1.74:3002


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


----

# Setting Up the MicroServices

You're now ready to set up the two MicroServices for this example.

If you remember from the *config.json* file, their logical names are *login_service* and
*info_service*:

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
          ]


----


## Setting Up the *login_service* MicroService

In this example, I'll be creating the *login_service* MicroService as a standalone QEWD
instance on the same Windows machine as the *Orchestrator*.  However, it could be created on any
other Windows (or Linux / Raspberry Pi) server.

In this example, the IP address of the Windows server is assumed to be *192.168.1.74*

Setting up a MicroService is actually very similar to setting up the *Orchestrator*, so where 
detailed explanations of steps are required, look back at the equivalent step in the *Orchestrator*
instructions previously in this document.

Since, in this example, I'm running on the same Windows server and using the same instance
of Cach&eacute; or IRIS as the *Orchestrator*, I don't need to worry about 
[installing Node.js](#install-nodejs) or 
[enabling the C Callin Interface](#ensure-the-c-callin-service-is-enabled).  
Of course, if you're setting up the MicroService on a different
Windows server, you'll need to check and possibly repeat those steps.


### Create a QEWD Installation Folder

The first step is to create a new QEWD installation folder (ie separate from the one you
created for the *Orchestrator*). In this example I'll create the folder:

        C:\qewd-login-service


### Create the *package.json* file

Within this new QEWD installation folder, create a file named *package.json*.  Its contents
will be indentical to the one you created for the *Orchestrator*, ie:

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

### Create the *configuration* folder

Next, create a folder named *configuration* within the QEWD installation folder


### Create the *config.json* file

Within the *configuration* folder, you now create the *config.json* file.  This is similar to
 the one you created for the *Orchestrator*, but a lot simpler. Refer back to
the [*Orchestrator*](#configjson-file) for an explanation of the properties.

Copy and paste the following content into it:

        {
          "ms_name": "login_service",
          "qewd": {
            "poolSize": 2,
            "port": 3001,
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
          "imported": true,
          "jwt": {
            "secret": "f4b5659e-1556-451f-a80f-7afc70ca1f06"
          }
        }


Four key things to notice:

- in the *config.json* file for a MicroService, you **MUST** add the *ms_name* property, 
set to the correct logical name for the MicroService, ie
in this instance:

          "ms_name": "login_service",

- the listener port must be different from that used by the *Orchestrator*, so we're using port
3001 in this example

- the JWT Secret **MUST** be the same as that defined in the *Orchestrator's* *config.json* file

- in this example we'll be connecting to the same Cach&eacute; system as the *Orchestrator,
and using the same namespace.  Depending on your circumstances you could use a different
namespace for this service.


### Create the *routes.json* file

Within the *configuration* folder, you next create the *routes.json* file.  This is somewhat
different from the one we defined for the *Orchestrator* and just defines the
routes handled by the MicroService.  In this example there is only one: the API used to
login.

Copy and paste the following content into it:

        [
          {
            "uri": "/api/login",
            "method": "POST",
            "handler": "login",
            "authenticate": false
          }
        ]

Most of the route object properties are the same as [described earlier](#routesjson-file),
but MicroService route objects include the name of the JavaScript module that will actually
handle the REST API.  In this case, it will be a module named *login*.  We'll see how and where
that is defined in a moment.

You'll see that otherwise, this is almost identical to the corresponding route object defined
in the *Orchestrator*.

Every REST API that you want to make available in a MicroService **must** also be defined
in the *Orchestrator's* *routes.json* file.


### Create the *login* Handler Module

We now must create the module that will handle the *POST /api/login* REST API.

Within your MicroService's QEWD installation folder, create a sub-folder named *apis*.
Your MicroService's folder structure should now look like this:

        C:\qewd-login-service
            |
            |_ package.json
            |
            |_ configuration
            |     |
            |     |- config.json
            |     |
            |     |- routes.json
            |
            |- apis


Each of your MicroService's handler names are defined within this *apis* sub-folder. In the
case of this *login_service* MicroService, we only have one, named *login*, so create that as a 
sub-folder of *apis*, ie:

        C:\qewd-login-service
            |
            |_ package.json
            |
            |_ configuration
            |     |
            |     |- config.json
            |     |
            |     |- routes.json
            |
            |- apis
                 |
                 |- login


QEWD REST API handlers are defined as a Node.js module file named *index.js* within the
correspondingly-named api sub-folder, so next, create a text file named *index.js* within the
*login* sub-folder, ie:

        C:\qewd-login-service
            |
            |_ package.json
            |
            |_ configuration
            |     |
            |     |- config.json
            |     |
            |     |- routes.json
            |
            |- apis
                 |
                 |- login
                       |
                       |- index.js


Paste the following content into the *index.js* file:


        module.exports = function(args, finished) {
          
          let body = args.req.body;
          if (!body) {
            return finished({error: 'Invalid login attempt'});
          }
          let username = body.username;
          if (!username || username === '') {
            return finished({error: 'Invalid login attempt'});
          }
          let password = body.password;
          if (!password || password === '') {
            return finished({error: 'Invalid login attempt'});
          }
          
          if (username !== 'rob' || password !== 'secret') {
            return finished({error: 'Invalid login attempt'});
          }
          
          args.session.timeout = 1200;
          args.session.authenticated = true;
          args.session.username = username;
          
          finished({
            ok: true
          });
        };


Let's step through this handler module:

- the signature of **all** QEWD REST API handler modules is:

        module.exports = function(args, finished) {
          // module logic goes here
        };

  - the *args* argument provides access to all the content of the incoming REST request
  - the *finished* argument provides the function you should invoke when your handler
module logic completes.  The *finished()* function does two things:

    - it returns the JSON response object you specify as its argument back to the REST client
    - it tells QEWD that you have finished with the Worker Process, allowing QEWD to return it
to its available pool ready for handling the next queued incoming request


- the */api/login* request is a POST request that should include a JSON body payload
containing the username and password.  The POSTed body is made available by QEWD in
*args.req.body*, so the first thing we'll do is check that a body exists.  If it
is we'll send an error object back to the REST Client and finish processing:

          let body = args.req.body;
          if (!body) {
            return finished({error: 'Invalid login attempt'});
          }

- next we'll check that a *username* property has been sent in the body JSON payload, and
that it isn't simply an empty string.  An error object is returned to the REST client in
either of these situations:

          let username = body.username;
          if (!username || username === '') {
            return finished({error: 'Invalid login attempt'});
          }

- we then do a similar test for the password:

          let password = body.password;
          if (!password || password === '') {
            return finished({error: 'Invalid login attempt'});
          }

- now that we have detected a username and password in the incoming request, we
must check that they are valid.  In a production system you'd usually do that by
checking in a user authentication class or global in your Cach&eacute; or IRIS system.

  However, in this example I've simply hard-coded a check:

  - the username must be *rob*
  - the password must be *secret*


          if (username !== 'rob' || password !== 'secret') {
            return finished({error: 'Invalid login attempt 4'});
          }

  Feel free to modify the module to make use of your own authentication database.

- if the username and password are valid, we now do the following:

          args.session.timeout = 1200;
          args.session.authenticated = true;
          args.session.username = username;

  The JWT that has been created automatically at this point by QEWD is made available
to your API handler module as *args.session*, and you can augment its content.

  Some of the JWT properties are reserved names and have a special meaning: *timeout* and
*authenticated* are two such properties:

  - timeout: sets the expiry timeout in seconds of the JWT.  The JWT's expiry time will
be automatically extended by this amount every time a request authenticated with the JWT
is processed by a QEWD MicroService.

  - authenticated: flags the user/owner of the JWT as having been authenticated, and
therefore a valid user

You can also add properties of your own that have a meaning relevant to you and not QEWD.
In this case we're adding the *username* property to hold the user's username within
the JWT:

          args.session.username = username;

- Finally, we tell QEWD that we have finished and return a response object that simply
denotes a successful login:

          finished({
            ok: true
          });


### Install QEWD

We've now created everything needed for the *login_service* MicroService.

We now install QEWD in the same way as for the *Orchestrator*.  So, open another
Windows Console session and type:

        cd \qewd-login-service

        npm install


### Start the MicroService

A MicroService is started similarly to the *Orchestrator*, but we add the MicroService's
logical name after *npm start*, ie:


        npm start login_service


As with the *Orchestrator*, the first time you start the MicroService, QEWD installs a
bunch of additional stuff for you, such as the *qewd-monitor* application.  It will then start and
you should see:


        ========================================================
        ewd-qoper8 is up and running.  Max worker pool size: 2
        ========================================================
        ========================================================
        QEWD.js is listening on port 3001
        ========================================================


If everything has been correctly configured on the *Orchestrator* and your
MicroService, after a second or so, you'll then see activity on both the
*Orchestrator* and MicroService - something like the following:

#### MicroService:

        Thu, 14 May 2020 17:18:16 GMT; worker 5068 received message: {"type":"ewd-regist
        er","application":"login_service","jwt":true,"socketId":"OpEFvhCtopEsk-jmAAAA","
        ipAddress":"::ffff:192.168.1.74"}
        **** jwtHandler encrypt: key = d8693c03147ce74398256b3a8bf21b5b98dfa874b310aeed3
        be0201f2597fe04
        **** jwtHandler encrypt: iv = eeb6596f1af5bb87e20adba0c15fc7b2
        Thu, 14 May 2020 17:18:16 GMT; master process received response from worker 5068
        : {"type":"ewd-register","finished":true,"message":{"token":"eyJ0eXAiOiJKV1QiLCJ
        hbGciOiJIUzI1NiJ9.eyJleHAiOjE1ODk0NzY5OTYsImlhdCI6MTU4OTQ3NjY5NiwiaXNzIjoicWV3ZC
        5qd3QiLCJhcHBsaWNhdGlvbiI6ImxvZ2luX3NlcnZpY2UiLCJ0aW1lb3V0IjozMDAsInFld2QiOiI0Mz
        I5MjY3YzY0ZTYxNThhNzE4ODIzNjJiZWZjMjJmNTEzYTQ0NTFmY2E0ZmVmMWIyNzgxZjI5YzEwNjJmOD 
        IyMWMyMmY0Mzk5ZWQxZTIxNzg1ZGVmYzQ1YzA1MGY0NzE0YjU3MDAzOTYxMTIzMTBiMmI1ODQwMTZlMT
        g0YTE1Y2FhOGU1ZjRhOWU2MWIzMjBiYWI3MGJiZjk0Y2NlZTZjNzNiYTE1Zjk1MWQ3MTY5ZTlmMGE2OT
        I3NGQ0MjYyMGQifQ.PmWplqTjV0uAdd6u1bxk2zZJEtQ2-IMWiUheAclA4B0"}}


#### Orchestrator

        login_service registered
        http://192.168.1.74:3001 micro-service ready


What has happened is that the *Orchestrator* has noticed that the *login_service*
MicroService has come online, and it automatically establishes a WebSocket connection
to it.

Should that connection be lost for whatever reason, the *Orchestrator* will automatically
attempt to reconnect.

You can stop and restart the *Orchestrator* and/or MicroServices in any sequence, but once
both are online, the *Orchestrator* will automatically reconnect.


### Try the Login REST API

Although we've only set up the first MicroService - *login_service*, we can try out its
REST API.

Using a REST Client (such as PostMan), send a *POST /api/login* request to the
Orchestrator, and include a JSON payload like this:

        {
          "username": "rob",
          "password": "secret"
        }

Make sure the *Content-type* for your request is *application/json*

You should see activity in both Window Consoles (for the *Orchestrator* and *login_service*
QEWD systems), and you should get a 200 Response with a JSON response similar to this:

        {"ok":true,"token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.
        eyJleHAiOjE1ODk0Nzg0ODUsImlhdCI6MTU4OTQ3NzI4NSwiaXNzIjo
        icWV3ZC5qd3QiLCJhcHBsaWNhdGlvbiI6ImxvZ2luX3NlcnZpY2UiL
        CJ0aW1lb3V0IjoxMjAwLCJxZXdkIjoiNDMyOTI2N2M2NGU2MTU4YTcxOD
        gyMzYyYmVmYzIyZjUxM2E0NDUxZmNhNGZlZjFiMjc4MWYyOWMxMDYyZj
        gyMjFjMjJmNDM5OWVkMWUyMTc4NWRlZmM0NWMwNTBmNDcxNGI1NzAwMz
        k2MTEyMzEwYjJiNTg0MDE2ZTE4NGExNWNhYThlNWY0YTllNjFiMzIw
        YmFiNzBiYmY5NGNjZWU2Y2JiMDlmMzVhYWUyMzQwNjhlNTRjYmFkYWQ4O
        DYwYzMwIiwidXNlcm5hbWUiOiJyb2IifQ.En4yej5F3tvXwESjnpP9640
        4kSaArjwTkCQsgcC-27g"}

This denotes a successful login!

You'll notice the response that the *login* API handler module returned:

       {ok: true}

but you'll also notice that the response also includes a *token* property which
is the JWT created by QEWD and returned automatically with the response from
the API handler module.

The idea is that every subsequent request sent from our REST Client should now include
this JWT in the HTTP *Authorization* header.

We can actually inspect the JWT and see what it contains.  The easiest way to do this
is to bring up [*https:jwt.io*](https://jwt.io) in your browser, and paste the
JWT your received from the *login* API response into its Debugger window panel.

You should see something like this in its Decoded *payload* panel:

        {
          "exp": 1589478485,
          "iat": 1589477285,
          "iss": "qewd.jwt",
          "application": "login_service",
          "timeout": 1200,
          "qewd": "4329267c64e6158a71882362befc22f5
              13a4451fca4fef1b2781f29c1062f8221c22f
              4399ed1e21785defc45c050f4714b5700396112
              310b2b584016e184a15caa8e5f4a9e61b320ba
              b70bbf94ccee6cbb09f35aae234068e54cb
              adad8860c30",
          "username": "rob"
        }


You can see the *timeout* and *username* properties that we added in the *login* API
handler method logic, which, as shown earlier was:

          args.session.timeout = 1200;
          args.session.authenticated = true;
          args.session.username = username;

but what seems to be missing in the JWT payload is the *authenticated* property.  In fact it
is there, but encrypted into the special, reserved *qewd* property.  It can't therefore
be seen by a REST user, but, as you'll see, it's automatically decrypted and made available
to you in your QEWD REST API handler methods via the *args* argument.

So that's it, the *login_service* MicroService is now up and running.

----

## Setting Up the *info_service* MicroService

In this example, I'll also be creating the *info_service* MicroService as a standalone QEWD
instance on the same Windows machine as the *Orchestrator* and the *login_service*
MicroService.  However, as berfore, it could be also created on any other Windows (or Linux / Raspberry Pi) server.

So, as before, the IP address of the Windows server is assumed, in this example, to be *192.168.1.74*

Setting up the *info_service* MicroService is actually very similar to how we set up
 the *login_service* MicroService, so where 
detailed explanations of steps are required, look back at the equivalent step in the
instructions previously in this document for the *login_service* MicroService.


### Create a QEWD Installation Folder

Create a new QEWD installation folder for
the *info_service* MicroService. In this example I'll create the folder:

        C:\qewd-info-service


### Create the *package.json* file

Within this new QEWD installation folder, create a file named *package.json*.  Its contents
will be indentical to the one you created for the *Orchestrator*, ie:

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

### Create the *configuration* folder

Next, create a folder named *configuration* within the QEWD installation folder


### Create the *config.json* file

Within the *configuration* folder, you now create the *config.json* file.  This is similar to
 the one you created for the *Orchestrator*, but a lot simpler. Refer back to
the [*Orchestrator*](#configjson-file) for an explanation of the properties.

Copy and paste the following content into it:

        {
          "ms_name": "info_service",
          "qewd": {
            "poolSize": 2,
            "port": 3002,
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
          "imported": true,
          "jwt": {
            "secret": "f4b5659e-1556-451f-a80f-7afc70ca1f06"
          }
        }


This is almost identical to the version for the *login_service* MicroService.  The
differences are:

- the different *ms_name* value:

          "ms_name": "info_service",

- the different (and unique) listener port:

          "port": 3002,

Remember that:

- the JWT Secret **MUST** be the same as that defined in the *Orchestrator's* *config.json* file

- in this example we'll be connecting to the same Cach&eacute; system as the *Orchestrator,
and using the same namespace.  Depending on your circumstances you might want/need to use a different
namespace for this service.


### Create the *routes.json* file

Within the *configuration* folder, you next create the *routes.json* file.  As with
the *login_service's* *routes.json* file, this just defines the
routes handled by the *info_service* MicroService.

In this example, the *info_service* will be supporting four CRUD REST APIs for a simple
person document/class.

Copy and paste the following content into it:

        [
          {
            "uri": "/api/person",
            "method": "POST",
            "handler": "addPerson"
          },
          {
            "uri": "/api/person/:id",
            "method": "GET",
            "handler": "getPerson"
          },
          {
            "uri": "/api/person/:id",
            "method": "PUT",
            "handler": "editPerson"
          },
          {
            "uri": "/api/person/:id",
            "method": "DELETE",
            "handler": "deletePerson"
          }
        ]


### Create the Handler Modules

We now must create the modules that will handle the four CRUD REST APIs defined in
the *routes.json* file above.

Within your MicroService's QEWD installation folder, create a sub-folder named *apis*.
Your MicroService's folder, and within the *apis* sub-folder, create sub-folders
using the same names as the handler property values shown above.  Then, in each
of those folders, create a text file named *index.js*.  In other words, the folder/file structure
should look like this:



        C:\qewd-info-service
            |
            |_ package.json
            |
            |_ configuration
            |     |
            |     |- config.json
            |     |
            |     |- routes.json
            |
            |- apis
                 |
                 |- addPerson
                 |     |
                 |     |- index.js
                 |
                 |- getPerson
                 |     |
                 |     |- index.js
                 |
                 |- editPerson
                 |     |
                 |     |- index.js
                 |
                 |- deletePerson
                 |     |
                 |     |- index.js
                 |


I'm going to show two versions of each handler module:

- one that demonstrates a simple *Person* persistent JSON document using the built-in QEWD-JSdb
abstraction of the Cach&eacute; / IRIS Global Storage.  In this example, the *Person* record
 will have the structure:

        {
          "by_id": {
            {{id}}: {
              "name": {{name}},
              "gender": {{gender}},
              "city": {{city}}
            }
          }
        }


- one that demonstrates a *person* class using Cach&eacute; / IRIS classes.  In this example,
I'm using the following (deliberately simple) class definition:

        Class User.Person Extends %Persistent
        {
          Property Name As %String;
          Property Gender As %String;
          Property City As %String;
        }


Note that the former version using QEWD-JSdb could be ported without change to YottaDB if
required, whereas the second version is proprietary to Cach&eacute; and/or IRIS.

So in the next sections below, I'll explain what the content of each of the four
*index.js* handler modules should look like, implemented both ways:


#### *addPerson / index.js*

This will create a new Person record using the name, gender and city values
within the JSON body payload of a POST /api/person request.  If successful,
it will return the id allocated to the new Person record.

A typical request will be:

        POST /api/person

        Content-type: application/json
       
        {
          "name": "Rob Tweed",
          "gender": "male",
          "city": "Redhill"
        }


##### QEWD-JSdb

        module.exports = function(args, finished) {

          /*
            Check the JWT to make sure it's for a user who has logged in
            and has therefore authenticated

            Note that even though this is a reserved/secret property within
            the JWT, it is automatically decrypted and made available for
            your use in your handler modules
          */

          if (!args.session.authenticated) {
            return finished({error: 'Not authenticated'});
          }

          /*
            Next, check the incoming POST body to make sure
            it exists and contains valid values

            If an error is detected, return an error object as
            the response

          */

          let body = args.req.body;
          if (!body) {
            return finished({error: 'Invalid request'});
          }
          let name = body.name;
          if (!name || name === '') {
            return finished({error: 'Missing name value'});
          }

          let gender = body.gender;
          if (!gender || gender === '') {
            return finished({error: 'Missing gender value'});
          }

          let city = body.city;
          if (!city || city === '') {
            return finished({error: 'Missing city value'});
          }

          /*

            The incoming request contained valid values
            so now we'll save them as a new Person record

            First, instantiate a Document Node object that
            represents the Person Global

          */

          let persons = this.db.use('Person');

          /*
            Create a new Person Id by incrementing the id_counter value
          */


          let id = persons.$('id_counter').increment();

          /*
            Instantiate a Document Node Object representing the
            new Person record using the id
          */

          let person = persons.$(['by_id', id]);

          /*
            Save the data for this new Person record
          */

          person.setDocument({
            name: name,
            gender: gender,
            city: city
          }); 
          
          /*
            Finish processing, and return the new Person id
          */

          finished({
            ok: true,
            id: id
          });
        };


##### Cach&eacute; / IRIS Class


        module.exports = function(args, finished) {

          /*
            Check the JWT to make sure it's for a user who has logged in
            and has therefore authenticated

            Note that even though this is a reserved/secret property within
            the JWT, it is automatically decrypted and made available for
            your use in your handler modules
          */

          if (!args.session.authenticated) {
            return finished({error: 'Not authenticated'});
          }

          /*
            Next, check the incoming POST body to make sure
            it exists and contains valid values

            If an error is detected, return an error object as
            the response

          */

          let body = args.req.body;
          if (!body) {
            return finished({error: 'Invalid request'});
          }
          let name = body.name;
          if (!name || name === '') {
            return finished({error: 'Missing name value'});
          }

          let gender = body.gender;
          if (!gender || gender === '') {
            return finished({error: 'Missing gender value'});
          }

          let city = body.city;
          if (!city || city === '') {
            return finished({error: 'Missing city value'});
          }

          /*

            The incoming request contained valid values
            so now we'll save them as a new Person record

            mg-dbx provides the classmethod API which
            gives us access to Cache/IRIS Classes

            In QEWD, it's exposed via this.db.dbx

          */       

          let db = this.db.dbx;

          /*
            Instantiate a new Person instance
          */

          let person = db.classmethod('User.Person', '%New');

          /*
            mg-dbx allows us to set properties using the setproperty method
          */

          person.setproperty('Name', name);
          person.setproperty('Gender', gender);
          person.setproperty('City', city);
          
          /*
            person methods are invoked using the mg-dbx method function

            We'll save the person instance, get the id that was allocated to it
            and close the instance

          */

          person.method('%Save');
          let id = person.method('%Id');
          person.method('%Close'); 
          
          /*
            Finish processing, and return the new Person id
          */

          finished({
            ok: true,
            id: id
          });
        };



#### *getPerson / index.js*

This will try to fetch a Person record (name, gender, city) with the specified id

It will be handling a GET request, with the id specified as a variable part of the REST API URI path, 
eg to fetch the details for a Person with an Id of 23:

        GET /api/person/23


##### QEWD-JSdb

        module.exports = function(args, finished) {

          /*
            Check the JWT to make sure it's for a user who has logged in
            and has therefore authenticated
          */

          if (!args.session.authenticated) {
            return finished({error: 'Not authenticated'});
          }

          /*
            Next, check that an id has been specified. Variables within the
            URI path are exposed as properties of args, so:

          */

          if (!args.id || args.id === '') {
            return finished({error: 'Invalid request'});
          }

          /*
            Instantiate a DocumentNode Object representing the
            Global node for the specified Person record
          */

          let person = this.db.use('Person', 'by_id', args.id);

          /*
            Check if a Person record with that id was found

            If not, return an error object

          */
          
          if (!person.exists) {
            return finished({error: 'No person exists with id ' + args.id});
          }

          /*
            Map the persistent record into a local JavaScript object
            by using the getDocument() method

            We could have alternatively fetched each value using the 
            value method for each property
          */

          let record = person.getDocument();

          /*
            Finish processing, and return the Person data
          */

          finished({
            ok: true,
            data: record
          });
          
        };


##### Cach&eacute; / IRIS Class


        module.exports = function(args, finished) {

          /*
            Check the JWT to make sure it's for a user who has logged in
            and has therefore authenticated
          */

          if (!args.session.authenticated) {
            return finished({error: 'Not authenticated'});
          }

          /*
            Next, check that an id has been specified. Variables within the
            URI path are exposed as properties of args, so:

          */

          if (!args.id || args.id === '') {
            return finished({error: 'Invalid request'});
          }

          /*
            Access the mg-dbx classmethod function to check if
            a Person record with that id exists

            If not, return an error object

          */

          let db = this.db.dbx;

          let exists = db.classmethod('User.Person', '%ExistsId', args.id);
          
          if (exists !== '1') {
            return finished({error: 'No person exists with id ' + args.id});
          }

          /*
            instantiate the specified Person record
          */

          let person = db.classmethod('User.Person', '%OpenId', args.id);

          /*
            Properties are accessed via the mg-dbx getproperty function
          */

          let name = person.getproperty("Name");
          let gender = person.getproperty("Gender");
          let city = person.getproperty("City");
          
          /*
            Close the Person object
          */

          person.method('%Close');

          /*
            Finish processing, and return the Person data
          */

          finished({
            ok: true,
            data: {
              name: name,
              gender: gender,
              city: city
            }
          });
          
        };



#### *editPerson / index.js*

This will try to edit a Person record with the specified id. If found, the
Person record will be updated with new values for name, gender and/or city.

It will be handling a PUT request, with the id specified as a variable part of the REST API URI path, 
and the new data values specified in the JSON Body payload.

eg to edit the city details for a Person with an Id of 23:

        PUT /api/person/23

        Content-type: application/json

        {
          "city": "London"
        }


##### QEWD-JSdb

        module.exports = function(args, finished) {

          /*
            Check the JWT to make sure it's for a user who has logged in
            and has therefore authenticated
          */

          if (!args.session.authenticated) {
            return finished({error: 'Not authenticated'});
          }

          /*
            Next, check that an id has been specified. Variables within the
            URI path are exposed as properties of args, so:

          */

          if (!args.id || args.id === '') {
            return finished({error: 'Invalid request'});
          }

          /*
            Next, check the incoming PUT body to make sure
            it exists
          */

          let body = args.req.body;
          if (!body) {
            return finished({error: 'Invalid request'});
          }

          /*
            Instantiate a DocumentNode Object representing the
            Global node for the specified Person record
          */

          let person = this.db.use('Person', 'by_id', args.id);

          /*
            Check if a Person record with that id was found
          */
          
          if (!person.exists) {
            return finished({error: 'No person exists with id ' + args.id});
          }

          /*
            Check for each Person property in the body, and
            if a new value exists, update the Person record
          */

          let name = body.name;
          if (name && name !== '') {
            person.$('name').value = name;
          }

          let gender = body.gender;
          if (gender && gender !== '') {
            person.$('gender').value = gender;
          }

          let city = body.city;
          if (city && city !== '') {
            person.$('city').value = city;
          }

          /*
            Finish processing and return a success flag as the response
          */
          
          finished({
            ok: true
          });
          
        };

##### Cach&eacute; / IRIS Class


        module.exports = function(args, finished) {

          /*
            Check the JWT to make sure it's for a user who has logged in
            and has therefore authenticated
          */

          if (!args.session.authenticated) {
            return finished({error: 'Not authenticated'});
          }

          /*
            Next, check that an id has been specified. Variables within the
            URI path are exposed as properties of args, so:

          */

          if (!args.id || args.id === '') {
            return finished({error: 'Invalid request'});
          }

          /*
            Next, check the incoming PUT body to make sure
            it exists
          */

          let body = args.req.body;
          if (!body) {
            return finished({error: 'Invalid request'});
          }

          /*
            Access the mg-dbx classmethod function to check if
            a Person record with that id exists

            If not, return an error object

          */

          let db = this.db.dbx;

          let exists = db.classmethod('User.Person', '%ExistsId', args.id);
          
          if (exists !== '1') {
            return finished({error: 'No person exists with id ' + args.id});
          }

          /*
            instantiate the specified Person record
          */

          let person = db.classmethod('User.Person', '%OpenId', args.id);

          /*
            Check for each Person property in the body, and
            if a new value exists, update the Person record
            using the mg-dbx setproperty function
          */

          let name = body.name;
          if (name && name !== '') {
            person.setproperty('Name', name);
          }

          let gender = body.gender;
          if (gender && gender !== '') {
            person.setproperty('Gender', gender);
          }

          let city = body.city;
          if (city && city !== '') {
            person.setproperty('City', city);
          }

          /*
            Save the updated record and close the person object
          */

          result = person.method('%Save');
          person.method('%Close');

          /*
            Finish processing and return a success flag as the response
          */
          
          finished({
            ok: true
          });
          
        };


#### *deletePerson / index.js*

This will try to delete a Person record with the specified id

It will be handling a DELETE request, with the id specified as a variable part of the REST API URI path, 
eg to delete the record for a Person with an Id of 23:

        DELETE /api/person/23


##### QEWD-JSdb

        module.exports = function(args, finished) {

          /*
            Check the JWT to make sure it's for a user who has logged in
            and has therefore authenticated
          */

          if (!args.session.authenticated) {
            return finished({error: 'Not authenticated'});
          }

          /*
            Next, check that an id has been specified. Variables within the
            URI path are exposed as properties of args, so:

          */

          if (!args.id || args.id === '') {
            return finished({error: 'Invalid request'});
          }

          /*
            Instantiate a DocumentNode Object representing the
            Global node for the specified Person record
          */

          let person = this.db.use('Person', 'by_id', args.id);

          /*
            Check if a Person record with that id was found
          */
          
          if (!person.exists) {
            return finished({error: 'No person exists with id ' + args.id});
          }

          /*
            Delete the specified Person record
          */

          person.delete();

          /*
            Finish processing and return a success flag as the response
          */

          finished({
            ok: true
          });
          
        };


##### Cach&eacute; / IRIS Class


        module.exports = function(args, finished) {

          /*
            Check the JWT to make sure it's for a user who has logged in
            and has therefore authenticated
          */

          if (!args.session.authenticated) {
            return finished({error: 'Not authenticated'});
          }

          /*
            Next, check that an id has been specified. Variables within the
            URI path are exposed as properties of args, so:

          */

          if (!args.id || args.id === '') {
            return finished({error: 'Invalid request'});
          }

          /*
            Access the mg-dbx classmethod function to check if
            a Person record with that id exists

            If not, return an error object

          */

          let db = this.db.dbx;

          let exists = db.classmethod('User.Person', '%ExistsId', args.id);
          
          if (exists !== '1') {
            return finished({error: 'No peron exists with id ' + args.id});
          }

          /*
            Delete the specified Person record
          */

          db.classmethod('User.Person', '%DeleteId', args.id);

          /*
            Finish processing and return a success flag as the response
          */

          finished({
            ok: true
          });
          
        };




### Install QEWD

We've now created everything needed for the *info_service* MicroService.

We now install QEWD in the same way as for the *Orchestrator*.  So, open another
Windows Console session and type:

        cd \qewd-info-service

        npm install


### Start the MicroService


        npm start info_service


As with the *Orchestrator*, the first time you start the MicroService, QEWD installs a
bunch of additional stuff for you, such as the *qewd-monitor* application.  It will then start and,
just as you saw for the *login_service* MicroService,
you should see the *info_service* MicroService being connected to by the *Orchestrator*.


----

# Testing the Completed System

You should now have everything working and ready to try out the complete suite of REST APIs
supported by your MicroServices.

## Login

Using a REST Client such as PostMan, send a login request:

        POST /api/login

        Content-type: application/json

        {
          "username": "rob",
          "password": "secret"
        }


Note that **all** REST requests must be sent to the *Orchestrator*, so in my example, I'd
send the *login* URI to:

        http://192.168.1.74:3000/api/login


You should get back a response that includes the authenticated JWT as a property named *token*.

Copy the JWT value.


## Create a New Person


        POST /api/person

        Content-type: application/json
        Authorization: Bearer {{JWT}}

        {
          "name": "Rob Tweed",
          "gender": "male",
          "city": "Redhill"
        }

Note: paste the value of the authenticated JWT from the Login response after the word *Bearer*
in the Authorization header

You should get back a response that includes the id of the new Person record, and an updated
version of the JWT.  You should find that the only difference in the JWT is that the expiry
date/time has been updated.

The first time you run this, it should return an id of 1.


## Fetch a Person Record

        GET /api/person/1

        Authorization: Bearer {{JWT}}


You should get back a response containing the values for the name, gender and city properties
of the specified Person record.  You'll also get a new copy of the JWT with an updated expiry.


## Edit a Person


eg to edit the city value for a Person with an id of 1:

        PUT /api/person/1

        Content-type: application/json
        Authorization: Bearer {{JWT}}

        {
          "city": "London"
        }

You should get back *ok: true* and an updated copy of the JWT.


## Delete a Person


eg to delete a Person with an id of 1:

        DELETE /api/person/1

        Authorization: Bearer {{JWT}}


You should get back *ok: true* and an updated copy of the JWT.

----

# Modifying / Maintaining the REST APIs

Feel free to modify the API Handler methods, and try experimenting with adding new
REST APIs.  You can also try adding another MicroService.

Notes:

- if you modify the *config.json* or *routes.json* file of either the *Orchestrator*
or a MicroService, you **must** stop and restart that QEWD instance.  QEWD only
reads and registers the contents of these files at startup.

- if you modify a REST API Handler module, for your changes to take effect, 
you **must** either:

  - stop and restart the QEWD instance;

  - better still, simply use the *qewd-monitor* or *qewd-monitor-adminui* application
on that QEWD system to stop all the Worker Processes.  You can do this quite safely at any time.
QEWD will automatically restart new Worker processes as it requires them.  Indeed, when you stop
the last of the currently-working Worker Processes, you'll see a new one immediately re-appear.

- If you create a new MicroService, you must ensure that the *Orchestrator* knows where to find
it by adding it to the array of MicroServices in the *Orchestrator's config.json* file.  You
must also add the new MicroService's API route objects to the *Orchestrator's routes.json* file.
You must then restart the *Orchestrator*.

- Take care when you modify any of the *routes.json* or *config.json* files. They **must** only
contain syntactically-valid JSON.  The QEWD system will start improperly if it cannot parse
the JSON.  All property names **must be double quoted** and any string values must also
be double-quoted.  Make sure you don't include extraneous commas - that's something that
always catches me out.  If in doubt, use an online JSON validator such as
[jsonlint](https://jsonlint.com/) to find any syntax errors in your JSON.  

----

# MicroService Security

If you are making your REST service publicly available, you should only expose the port
of the *Orchestrator*, and make sure the QEWD MicroService instances are hidden behind a 
firewall.

However, you can set up MicroServices on any Internet-facing server, in which case you should
firewall them to only accept incoming requests from the designated Orchestrator IP address.

----

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




