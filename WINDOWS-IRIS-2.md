# Standalone Interactive WebSocket-based CRUD Application, using Cach&eacute; or IRIS Natively on Windows

## Contents

- [Introduction](#introduction)
- [Initial Steps](#initial-steps)

----

# Introduction

The instructions below explain how to create an interactive, browser-based application
using QEWD's WebSocket communication with a back-end running on Windows with
either Cach&eacute; or IRIS.

The back-end will implement a set of CRUD message handlers for a *Person* record implemented
as both a QEWD-JSdb persistent JSON document and a Cach&eacute;/IRIS Class.

Note, this will be the same *Person* record as used in the [REST example](./WINDOWS-IRIS-1.md).

The front-end will be built using the  
[SB Admin 2 Themed Template](https://github.com/robtweed/wc-admin-ui)
which, in turn, uses the [*mg-webComponents* technology](https://github.com/robtweed/wc-admin-ui).
The [SB Admin 2 Theme](https://startbootstrap.com/themes/sb-admin-2/) is a 
[Bootstrap 4](https://getbootstrap.com/)-based, fully responsive User Interface that we've found to be an
ideal basis for many applications.

Pre-built versions of the files used and referred to in this example can be found in the
[*/src/windows-iris-2*](./src/windows-iris-2) folder within this repo.


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


# Set up your QEWD System

## Create a QEWD Installation Folder

Create a new folder/direcory on your Windows System where you will run your QEWD System.  This will
be referred to withing this tutorial as your *QEWD Installation Folder*.

The directory name is up to you, but in these instructions I'll assume you've created:

        C:\qewd


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

        C:\qewd
            |
            |_ package.json



## Create the QEWD Configuration Folder and Files

### Configuration Folder

Under the installation folder, create a sub-folder named *configuration*, ie you should now have a 
structure like this:


        C:\qewd
            |
            |_ package.json
            |
            |_ configuration


### *config.json* File

Next, create a text file named *config.json* within the *configuration* folder.  

You'll now have the following structure:

        C:\qewd
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
            "port": 8080,
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
          }
        }



#### IRIS

        {
          "qewd": {
            "poolSize": 2,
            "port": 8080,
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


        "port": 8080,

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


## Install QEWD

All the configuration files are now ready for use, but first we must install QEWD and its
dependencies. This step only needs doing once.


Open a Windows Command session and type the following:


        cd \qewd

        npm install


You'll see it installing QEWD, and in the QEWD Installation folder (*c:\qewd*), 
you'll see a sub-folder named *node_modules* and a file named *package-lock.json* appear, 
eg your top-level folder structure should look like this:


        C:\qewd
            |
            |_ package.json
            |
            |_ package-lock.json
            |
            |_ configuration
            |
            |- node_modules



When it completes, you're ready to start QEWD


## Starting QEWD

Each time you want to start QEWD, within your Windows Console session, 
first make sure you're in your QEWD Installation folder, eg

        cd \qewd

and then start QEWD by typing:

        npm start


QEWD is ready for use when you see this (the poolsize and port will depend on your *config.json* settings):



        webServerRootPath = C:\qewd-orchestrator/orchestrator/www/
        route /api will be handled by qx.router
        Worker Bootstrap Module file written to node_modules/ewd-qoper8-worker.js
        ========================================================
        ewd-qoper8 is up and running.  Max worker pool size: 2
        ========================================================
        ========================================================
        QEWD.js is listening on port 3000
        ========================================================



The first time you start your QEWD system, it installs a bunch of extra things, so you'll see
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


# Start Developing

Everything is now ready for you to begin developing the example application!


## The QEWD Interactive Application Development Environment

After starting QEWD for the first time, it's automatically installed and configured everything you'll need to begin
developing the example application described in this tutorial.  You'll find most of it in the *www* directory that
will have been created.  Look for the following:

        C:\qewd
            |
            |- www
                |
                |- qewd-client.js
                |
                |- mg-webComponents.js
                |
                |- components
                         |
                         |- adminui



- *qewd-client.js*: This ES6 module is used within the browser-side code to communicate securely with the
QEWD back-end

- *mg-webComponents.js*: A lightweight but highly functional Web Component framework

- *components/adminui*: A suite of *mg-webComponent assembly* files that implement the SB Admin 2 Theme
as re-usable building blocks, allowing you to fully customise its behaviour.


## The *mg-webComponents Framework

We'll be making use of the *mg-webComponents* framework.  Although it's not essential for the
purposes of this tutorial, [click here](https://github.com/robtweed/mg-webComponents) 
if you want to find out more about this framework: there you'll find a full explanation of it and a tutorial
that examines its fundamentals in detail.

A key part of understanding the *mg-webComponents* framework is understanding its four tiers which are
summarised in this diagram:


                                Name by convention

          -------------------
          | HTML Loader Page |   index.html
          -------------------
                   |
           -------------------
           | mg-webComponents |
           |  Load/Render     |    app.js
           |   ES6 Module     |
            ------------------
                   |
          ---------------------
         |   WebComponents     |
         | Assembly Definition |  application-specific
         |    ES6 Module       |
          ---------------------
                  /|\
          ---------------------
         |   WebComponents     |
         |   Module Library    |  adminui
         |                     |
          ---------------------


The folder structure I'd recommend you use for applications is as follows:

          c:\qewd                         QEWD Installation Directory
               |
               |- www                     QEWD WebServer Root Directory
                   |
                   |- demo                Name of your application (your choice)
                        |
                        |- index.html     HTML Loader Page
                        |
                        |- js             JavaScript Module Directory
                            |
                            |- app.js     Load/Render Module
                            |
                            |- your Assembly Modules


With these in mind, let's start developing!


## Step 1: Decide on a name for your application

I'm going to call this application *demo*, but you can use any name you like.

Create the appropriately-named folder under your QEWD WebServer Root Directory, eg in my case:


          c:\qewd                         QEWD Installation Directory
               |
               |- www                     QEWD WebServer Root Directory
                   |
                   |- demo                Application folder



## Step 2: Create the HTML Loader Page

Within the application folder you created in the step above, create a text file named *index.html* and
paste the following content into it:

        <!DOCTYPE html>
        <html lang="en">
          <head>
          <title>QEWD Interactive CRUD Demo</title>
          <link rel="icon" href="data:,">
          </head>

          <body>
          <script type="module" src="js/app.js"></script>
          </body>
        </html>


You can actually use this as the basis for *all* your applications: simply change the text within the
*title* element as appropriate to your application.

As you can see, what this means is that all the work will be done by an Es6 module named *app.js*.
We refer to this as the *Load/Render Module*.


## Step 3: Create the Load/Render Module

First, create a sub-folder named *js* below your application folder, eg in my case:

          c:\qewd
               |
               |- www
                   |
                   |- demo
                        |
                        |- index.html
                        |
                        |- js      <===== ****


Within this *js* folder, create a text file named *app.js* and paste the following into it:

        import {webComponents} from '../../mg-webComponents.js';
        
        document.addEventListener('DOMContentLoaded', function() {
        
          // create the context for running the web components
        
          let context = {
            paths: {
              adminui: './components/adminui/'
            }
          };

          // load the root adminui WebComponent

          let body = document.getElementsByTagName('body')[0];
          webComponents.loadWebComponent('adminui-root', body, context);
        });


Save this file.


## Step 4: Try out the application.

The *mg-webComponents* framework makes use of ES6 modules that can be dynamically-loaded direct from
the QEWD WebServer, so there's no bundling/compilation step.  As soon as you create or amend your
JavaScript module files, you can try them out immediately.

So, point your browser at:

        http://xx.xx.xx.xx:8080/demo

Use the IP address/domain name of the machine hosting your QEWD system, and modify the port
if you changed it in the *config.json* file.

If you used a different name from *demo*, change the URL path appropriately

If you've set everything up properly, you should now see the basic 4 panels of the 
SB Admin 2 Theme User Interface (UI), albeit with nothing showing in the panels:


![SB Admin 2 Theme](https://github.com/robtweed/qewd-microservices-examples/raw/master/adminui-1.png)


Each of the 4 panels in the UI are referred to by the names shown in the diagram above.  In the rest 
of this tutorial, we'll basically be defining what will be displayed in each of the panels.

But first, let's do a step-by-step study into the logic you pasted into the *app.js* file and how and
why the UI appeared.

- the process is kicked off by the *index.html* file which is what you actually asked the browser to load

- this line in the *index.html* file fetched your *app.js* file from the QEWD Web Server and loaded it
as an ES6 module:


          <script type="module" src="js/app.js"></script>


- the first thing the *app.js* module did was to import the *mg-webComponents* framework module,
downloading it from the QEWD Web Server's root path:

        import {webComponents} from '../../mg-webComponents.js';

- we wait for all the DOM components to fully load before continuing:

        document.addEventListener('DOMContentLoaded', function() {


- we tell *mg-webComponents* where to find the component libraries that we'll be using.  In our case
we're just using the *adminui* component library:

          let context = {
            paths: {
              adminui: './components/adminui/'
            }
          };

- and finally we tell *mg-webComponents* to load the *adminui-root* WebComponent into the
*body* tag of the DOM within the browser.

        let body = document.getElementsByTagName('body')[0];
        webComponents.loadWebComponent('adminui-root', body, context);


  The *adminui-root* WebComponent loads all the dependencies that are needed by the
UI (eg Bootstrap's JavaScript and CSS files, jQuery etc), before rendering the four
empty panels, ready for use.

Take a look, using the browser's Developer Tools, at the elements now loaded in the DOM: you'll
see a whole host of <link> and <script> tags that have been dynamically added to the DOM to download
all the required resources.  You should also see the *adminui-root* custom tag, inside of which
you'll see the Bootstrap 4 markup that renders the four UI panels.


## Step 5: Add a Login Sequence

Before a user is allowed to manipulate the Person record on your Cach&eacute;/IRIS server, you'll
probably want to authenticate them using a username/password challenge.  So let's first build out that
piece of the functionality.

There's a variety of ways this could be done, but a nice approach is to use a modal popup window
for the username/password challenge.  

Within the modal popup we'll use a form containing
the two input fields for *username* and *password*, along with a button which, when clicked, will send
the *username* and *password* to the QEWD back-end which will perform the authentication.

During this login sequence, let's initially populate the UI's *sidebar* panel with a heading that confirms the
application name, so the user knows he/she has loaded the correct application.

We'll also populate the UI's *footer* panel with a copyright notice, but for now we'll leave the *topbar*
and *content area* empty.

### Step 5a: Load the QEWD-Client Module

So the first thing we need to do is to edit the *app.js* file.

In order to communicate with the QEWD back end, first add this line at the top of your *app.js* file:

        import {QEWD} from '../../qewd-client.js';

This will import the ES6 module named *qewd-client.js* from the QEWD WebServer's root path.

At the end of the *DOMContentLoaded* callback, add this to start the QEWD client connection:

        QEWD.start({
          application: 'demo',
        });

and move the rest of the logic that was within the *DOMContentLoaded* callback within a new, additional
callback which triggers when the QEWD WebSocket connection is established and ready for use:


        QEWD.on('ewd-registered', function() {
          // perform the application logic here
        });


So, to summarise, your *app.js* file should now look like this:

        import {webComponents} from '../../mg-webComponents.js';
        import {QEWD} from '../../qewd-client.js';

        document.addEventListener('DOMContentLoaded', function() {
          QEWD.on('ewd-registered', function() {

            let context = {
              paths: {
                adminui: './components/adminui/'
              }
            };

            let body = document.getElementsByTagName('body')[0];
            webComponents.loadWebComponent('adminui-root', body, context);

          });
          
          QEWD.start({
            application: 'demo',
          });
        });


We'll see how the QEWD Client is used for logging in later. 

You can test this change by clicking your browser's reload button.  Provided you haven't introduced any
JavaScript syntax errors into the *app.js* module, you should see no change in the rendered content.  However, 
if you open the browser's Developer Tools and look at the JavaScript console, you should see this:

        demo registered

You'll also see some activity in your QEW back-end console log, showing an exchange of messages between
your browser and the QEWD back-end.


### Step 5b: Define the initial sidebar Assembly Module

We describe the content of the various UI Panels by defining what are known in *mg-webComponents* parlance as
*Assembly Modules*.  These describe two things:

- the hierarchy of *adminui* WebComponents that we want to plug together to render the desired content

- any JavaScript logic that should be invoked when each of the constituent *adminui* WebComponents are
initially loaded: these are known as *hooks*.

Let's start with the Assembly Module that we'll use to define what to initially display in the UI's *sidebar*
panel during the login sequence.

Create, within your application's *js* folder, a file named *initial-sidebar.js* and paste the following
content into it:

        export function initial_sidebar_assembly() {

          let component = {
            componentName: 'adminui-sidebar-brand',
            state: {
              title: 'Person Editor',
              icon: 'user-alt'
            }
          };

          return {component};
        };


This simple Assembly Module will load the *adminui-sidebar-brand* WebComponent.  This WebComponent will 
display a title and icon.  Bootstrap 4 uses the *Font Awesome* library which you can 
[search here](https://fontawesome.com/icons?d=gallery).

You'll notice that the Assembly Module actually exports a function: you'll see how that is applied in the next step.


### Step 5c: Import the initial sidebar Assembly Module into the *app.js* Module


Near the top of the *app.js* file, we now import the *initial-sidebar* Assembly Module:

        import {initial_sidebar_assembly} from './initial-sidebar.js';


### Step 5d: Load/Register the initial sidebar Assembly Module


Next, within your *app.js* file, within the *DOMContentLoaded* callback, we load and register 
the *initial-sidebar* Assembly Module using the *mg-webComponents* *addComponent()* method:

        webComponents.addComponent('initial_sidebar', initial_sidebar_assembly());

Note that we've now assigned a name - *initial_sidebar* - to it.  So it will now be accessible
via *webComponents.components.initial_sidebar*.

### Step 5e: Render the initial sidebar

To render the initial sidebar, we need to edit this line:

        webComponents.loadWebComponent('adminui-root', body, context);

to this instead:

    webComponents.loadWebComponent('adminui-root', body, context, function(root) {
      webComponents.loadGroup(webComponents.components.initial_sidebar, root.sidebarTarget, context);
    });

Notice:

- we render the initial sidebar Assembly from within the callback of the *loadWebComponent()* method, which
will fire when the *adminui-root* is rendered and ready for use

- we access the registered instance of the *initial_sidebar* Assembly via *webComponents.components.initial_sidebar*

- we're using the *mg-webComponents loadGroup()* method to render the initial sidebar assembly

- the target into which the initial sidebar Assembly markup is added is accessed via the *adminui-root* WebComponent's
*sidebarTarget* property (*root.sidebarTarget*)

To summarise these changes, your *app.js* file should now look like this:

        import {webComponents} from '../../mg-webComponents.js';
        import {QEWD} from '../../qewd-client.js';
        import {initial_sidebar_assembly} from './initial-sidebar.js';

        document.addEventListener('DOMContentLoaded', function() {
          QEWD.on('ewd-registered', function() {
            webComponents.addComponent('initial_sidebar', initial_sidebar_assembly());
            let context = {
              paths: {
                adminui: './components/adminui/'
              }
            };
            
            let body = document.getElementsByTagName('body')[0];
            webComponents.loadWebComponent('adminui-root', body, context, function(root) {
              webComponents.loadGroup(webComponents.components.initial_sidebar, root.sidebarTarget, context);
            });

          });
          
          QEWD.start({
            application: 'demo'
          });
          
        });


Save this and let's test out your changes so far by clicking your browser's reload button

The UI should load its four panels as before, but now you should see the *Person Editor* title and an icon at
the top of the *sidebar* panel.


### Step 5f: Add a *footer*

The steps for this are similar to those above for the sidebar:

- first create a text file named *footer.js* within your application's *js* folder

- paste the following logic in it to create a *footer* Assembly Module:

        export function footer_assembly() {

          let component = {
            componentName: 'adminui-footer-copyright',
            state: {
              copyright_text: 'M/Gateway Developments Ltd'
            }
          };

          return {component};
        };

  Again, this is a very simple Assembly Module that will load a single *adminui* WebComponent: *adminui-footer-copyright*.
This WebComponent is specifically designed for displaying a copyright notice in the UI's *footer* panel.

- In your *app.js* file:

  - import the *footer* Assembly Module:

        import {footer_assembly} from './footer.js';

  - register it into *mg-webComponents*:

        webComponents.addComponent('footer', footer_assembly());

  - render it into the UI's footer target tag:

        webComponents.loadGroup(webComponents.components.footer, root.footerTarget, context);


To summarise, your *app.js* file should now look like this:


        import {webComponents} from '../../mg-webComponents.js';
        import {QEWD} from '../../qewd-client.js';
        import {initial_sidebar_assembly} from './initial-sidebar.js';
        import {footer_assembly} from './footer.js';
        
        document.addEventListener('DOMContentLoaded', function() {
          QEWD.on('ewd-registered', function() {
            webComponents.addComponent('initial_sidebar', initial_sidebar_assembly());
            webComponents.addComponent('footer', footer_assembly());
            let context = {
              paths: {
                adminui: './components/adminui/'
              }
            };
            
            let body = document.getElementsByTagName('body')[0];
            webComponents.loadWebComponent('adminui-root', body, context, function(root) {
              webComponents.loadGroup(webComponents.components.initial_sidebar, root.sidebarTarget, context);
              webComponents.loadGroup(webComponents.components.footer, root.footerTarget, context);
              });

          });
          
          QEWD.start({
            application: 'demo'
          });
          
        });


Try these changes out by clicking your browser's *reload* button.  You should now see the
copyright message appearing in the UI's footer panel!


### Step 5g: Add the Login Modal Panel

We're now ready to add the logic that will display a modal login panel.

This is a little bit trickier as it requires two steps:

- adding the modal panel's Bootstrap markup to the DOM's *body* tag
- once everything else is ready, bring the modal panel into view

Let's start with the first step, which follows a similar pattern to what we've done previously.

#### Create the *login-modal* Assembly module

We'll start with just the basic "bare-bones" superstructure of a modal panel that we'll build up later into a login form.

Within your application's *js* folder, create a text file named *login-modal.js* and paste the following content 
into it:

        export function login_modal_assembly() {

          let component = {
            componentName: 'adminui-modal-root',
            state: {
              name: 'modal-login',
              static: true
            },
            children: [
              {
                componentName: 'adminui-modal-header',
                state: {
                  title: 'Login'
                }
              },
              {
                componentName: 'adminui-modal-body',
                state: {
                  text: 'Login form will go here...'
                }
              },
              {
                componentName: 'adminui-modal-footer',
                state: {
                  text: 'Login button will go here...'
                }
              }
            ]
          };

          return {component};

        };


A typical modal *adminui* panel will be built from the following WebComponents:

- a modal root component (adminui-modal-root), with three child components:
  - a header component, used for the title (adminui-modal-header)
  - body component, used for the modal's main content: in our case this will be where the form will go,
but for now we'll just set some text into it (adminui-modal-body) 
  - a footer component, typically used if you need to have buttons that invoke actions.  Again, for now,
we'll just set some text into it (adminui-modal-footer);

So let's initially use the bare-bones modal panel and see how we get on.


#### Hook the *modal-login* Assembly into your *app.js* Module

Just follow the same pattern as we used for the other panel Assembly modules:

- In your *app.js* file:

  - import the *login-modal* Assembly Module:

        import {login_modal_assembly} from './login-modal.js';

  - register it into *mg-webComponents*:

        webComponents.addComponent('login_modal', login_modal_assembly());

  - render it into the *body* tag:

        webComponents.loadGroup(webComponents.components.login_modal, body, context);

To summarise, your *app.js* file should now look like this:


        import {webComponents} from '../../mg-webComponents.js';
        import {QEWD} from '../../qewd-client.js';
        import {initial_sidebar_assembly} from './initial-sidebar.js';
        import {footer_assembly} from './footer.js';
        import {login_modal_assembly} from './login-modal.js';
        
        document.addEventListener('DOMContentLoaded', function() {
          QEWD.on('ewd-registered', function() {
            webComponents.addComponent('initial_sidebar', initial_sidebar_assembly());
            webComponents.addComponent('footer', footer_assembly());
            webComponents.addComponent('login_modal', login_modal_assembly());
            let context = {
              paths: {
                adminui: './components/adminui/'
              }
            };
            
            let body = document.getElementsByTagName('body')[0];
            webComponents.loadWebComponent('adminui-root', body, context, function(root) {
              webComponents.loadGroup(webComponents.components.initial_sidebar, root.sidebarTarget, context);
              webComponents.loadGroup(webComponents.components.footer, root.footerTarget, context);
              webComponents.loadGroup(webComponents.components.login_modal, body, context);
            });

          });
          
          QEWD.start({
            application: 'demo'
          });
          
        });


Try it out by clicking the browser's *refresh* button

You should just see the UI panels as before, without any apparent difference.  However, if you use the
browser's Developer Tools and view the Elements, you should see that the *adminui-modal-root* custom tag
has been added into the *body*.

So the modal is there, but just not visible.


#### Bringing the Modal Login Panel into View

This is a bit more tricky behind the scenes than might appear.  Whilst everything in the initial view
is loading and rendering, it's also loading the various JavaScript libraries that are used by the
Bootstrap components: in particular the jQuery library.  This must be fully loaded before the
modal panel's *show()* method can be invoked.

For this reason, the *adminui-root* WebComponent has been written such that it will fire an event to signal that 
everything is ready and loaded.  The trick is therefore to
hook into and use that event to bring the modal login panel into view, because then it will be safe to do so.

Here's how it's done, all from within your *app.js* Module.

- add a *ready* Event to the *context* object.  Adding it to *context* makes it available 
for use by the *adminui-modal-root* component

            let context = {
              paths: {
                adminui: './components/adminui/'
              },
              readyEvent: new Event('ready')
            };


- add a *ready* event handler that will fire when it's triggered by the *adminui-modal-root* Component when it's
loaded and ready:

           document.addEventListener('ready', function() {
             // bring the modal into view 
           });

- and within that event handler, locate the *adminui-modal-root* WebComponent and invoke its *show()* method

           document.addEventListener('ready', function() {
              let modal = webComponents.getComponentByName('adminui-modal-root', 'modal-login');
              modal.show();
            });

Note that we are locating an instance of the *admin-modal-root* WebComponent that has a name property of
*modal-login*.  That's because, in the *modal-login* Assembly module, if you take a look, we assigned that name:

        export function login_modal_assembly() {

          let component = {
            componentName: 'adminui-modal-root',
            state: {
              name: 'modal-login',     <======== ****
              static: true
            },
            ...etc


So, in summary, your *app.js* file should now look like this:

        import {webComponents} from '../../mg-webComponents.js';
        import {QEWD} from '../../qewd-client.js';
        import {initial_sidebar_assembly} from './initial-sidebar.js';
        import {footer_assembly} from './footer.js';
        import {login_modal_assembly} from './login-modal.js';
        
        document.addEventListener('DOMContentLoaded', function() {
          QEWD.on('ewd-registered', function() {
            webComponents.addComponent('initial_sidebar', initial_sidebar_assembly());
            webComponents.addComponent('footer', footer_assembly());
            webComponents.addComponent('login_modal', login_modal_assembly());
            let context = {
              paths: {
                adminui: './components/adminui/'
              },
              readyEvent: new Event('ready')
            };
            
            document.addEventListener('ready', function() {
              let modal = webComponents.getComponentByName('adminui-modal-root', 'modal-login');
              modal.show();
            });
            
            let body = document.getElementsByTagName('body')[0];
            webComponents.loadWebComponent('adminui-root', body, context, function(root) {
              webComponents.loadGroup(webComponents.components.initial_sidebar, root.sidebarTarget, context);
              webComponents.loadGroup(webComponents.components.footer, root.footerTarget, context);
              webComponents.loadGroup(webComponents.components.login_modal, body, context);
            });

          });
          
          QEWD.start({
            application: 'demo'
          });
          
        });


Click the browser's *refresh* button and see what happens this time.

This time, the *bare-bones* modal panel should appear automatically, with the UI's main panels
greyed out in the background.


#### Add the Login Form and its Input Fields

Now we have the modal panel in place and coming into view at the right time, we can modify its 
contents and add a form with the *username* and *password* input fields.

These will go in the *adminui-modal-body* Component.  So, edit the *login-modal.js* Module file 
and replace this:

        {
          componentName: 'adminui-modal-body',
          state: {
            text: 'Login form will go here...'
          }
        },

with this:

        {
          componentName: 'adminui-modal-body',
          children: [
            {
              componentName: 'adminui-form',
              state: {
                name: 'loginForm',
                cls: 'user'
              },
              children: [
                {
                  componentName: 'adminui-form-field',
                  state: {
                    label: 'Username:',
                    placeholder: 'Enter username...',
                    name: 'username',
                    focus: true
                  }
                },
                {
                  componentName: 'adminui-form-field',
                  state: {
                    type: 'password',
                    label: 'Password:',
                    placeholder: false,
                    name: 'password'
                  }
                }
              ]
            }
          ]
        },


Save the file and click the browser's *refresh* button.  You should now see the modal panel appearing with
the *username* and *password* fields.


#### Add the Login Button

The next step is to replace that placeholder text in the modal panel's *adminui-modal-footer* Web Component
with a Login button.

Edit the *login-modal.js* Module file again, but this time replace this:


        {
          componentName: 'adminui-modal-footer',
          state: {
            text: 'Login button will go here...'
          }
        }

with this:

        {
          componentName: 'adminui-modal-footer',
          children: [
            {
              componentName: 'adminui-button',
              state: {
                text: 'Login',
                colour: 'success',
                cls: 'btn-block'
              },
            }
          ]
        }


Save the file and click the browser's *refresh* button.  You should now see the button in the modal panel's footer.
So in terms of markup we now have everything we need.


#### Enabling the Login Button

Visually everything looks good now, but you'll find that clicking the *Login* button doesn't actually do anything.

That's because we haven't defined a *click* handler for it.  So let's add that now.  Initially we'll just add
one that confirms that the button has been clicked within the browser's JavaScript console.

This step introduces another feature of *mg-webComponents*: **hooks**.  These are functions that you define, and
that are invoked when the specified WebComponent has been loaded and rendered.  They provide a way for you to
customise and tailor the behaviour of a WebComponent specifically for your purposes.

In our case, we need to add a *hook* to the *adminui-button* component that we just added in the previous step.

So, once again, edit the *modal-login.js* file and edit this:

            {
              componentName: 'adminui-button',
              state: {
                text: 'Login',
                colour: 'success',
                cls: 'btn-block'
              }
            }
            

and add a hook property:

            {
              componentName: 'adminui-button',
              state: {
                text: 'Login',
                colour: 'success',
                cls: 'btn-block'
              },
              hooks: ['login']
            }

This is telling *mg-webComponents* to invoke a hook function named *login* when the *adminui-button* Component
is loaded and rendered.

Hook functions are specific to a named WebComponent, and defined in an object named *hooks*.  We therefore add
the following into the *login-modal.js* Module file:

        let hooks = {
          'adminui-button': {
            login: function() {
              let fn = function() {
                console.log('button was clicked!');
              };
              this.addHandler(fn, 'click');
            }
          }
        };

Notes:

- the *hooks* object defines *hook* functions specific to the relevant WebComponent: in this case it defines a *login()*
function that is specific to the *adminui-button* Component

- the *login* hook is defining a *click* handler.  By using the Component's *addHandler()* method (which
is added automatically to all your Components by *mg-webComponents*), you're ensuring that if the Component is
removed from the DOM (via the Component's *remove()* method), then the handler will also be removed to prevent
memory leaks.  In fact, the *addHandler()* method assumes that the event will be *click* by default, so we could
simply specify:

              this.addHandler(fn);


The final step is to ensure that the *hooks* object is exported from your Assembly module.  So you need to
change this:

        return {component};


to this:

        return {component, hooks};


So in summary, your *login-modal.js* file should now look like this:

        export function login_modal_assembly() {

          let component = {
            componentName: 'adminui-modal-root',
            state: {
              name: 'modal-login',
              static: true
            },
            children: [
              {
                componentName: 'adminui-modal-header',
                state: {
                  title: 'Login'
                }
              },
              {
                componentName: 'adminui-modal-body',
                children: [
                  {
                    componentName: 'adminui-form',
                    state: {
                      name: 'loginForm',
                      cls: 'user'
                    },
                    children: [
                      {
                        componentName: 'adminui-form-field',
                        state: {
                          label: 'Username:',
                          placeholder: 'Enter username...',
                          name: 'username',
                          focus: true
                        }
                      },
                      {
                        componentName: 'adminui-form-field',
                        state: {
                          type: 'password',
                          label: 'Password:',
                          placeholder: false,
                          name: 'password'
                        }
                      }
                    ]
                  }
                ]
              },
              {
                componentName: 'adminui-modal-footer',
                children: [
                  {
                    componentName: 'adminui-button',
                    state: {
                      text: 'Login',
                      colour: 'success',
                      cls: 'btn-block'
                    },
                    hooks: ['login']
                  }
                ]
              }
            ]
          };

          let hooks = {
            'adminui-button': {
              login: function() {
                let fn = function() {
                  console.log('button was clicked!');
                };
                this.addHandler(fn);
              }
            }
          };

          return {component, hooks};

        };


Save this version of the file and try it by clicking the browser's *refresh* button.

You should now see *button was clicked!* in the browser's JavaScript console when you click the
*Login* button.


#### Optional: Clicking the Login Button via the *Enter* Key

Something that can be very useful to enable in a login form like this is to cause the *Login* button
to be implicitly clicked if the user presses the *Enter* Key.

It's pretty simple to enable by adding another (albeit a little more complex) handler within the *hook* method:

        let modal = this.getParentComponent('adminui-modal-root');
        let _this = this;
        let kpfn =  function(e){
          if(e.which == 13) {
            _this.rootElement.focus();
            _this.rootElement.click();
          }
        };
        modal.addHandler(kpfn, 'keypress');


Let me explain what this logic is doing

This event handler is actually added to the *adminui-modal-root* Component: it will detect any key press, and
specifically filter out the *Enter* key.

So we first get a pointer to the *adminui-modal-root* Component.  Within this specific *hook* method, the
context is the *adminui-button* Component which is within the *adminui-modal-footer* Component.  So the easiest
and most efficient way to access the *adminui-modal-root* Component is to go up the DOM hierarchy from the
current *adminui-button* Component until we reach the *adminui-modal-root* Component.  That is what this line
is doing:

        let modal = this.getParentComponent('adminui-modal-root');

To allow use of the current context within the closure created by the handler function, we add this line:

        let _this = this;


We're going to define a *keypress* handler which will be added to the *adminui-modal-root* Component thus:

        modal.addHandler(kpfn, 'keypress');

and the actual event handler function is as follows:

        let kpfn =  function(e){

          // filter out the Enter Keypress

          if(e.which == 13) {
            // click the button to submit the form

            // first set focus to the actual Login button element

            _this.rootElement.focus();

           // and then invoke its click method

            _this.rootElement.click();
          }
        };


So, in summary, your *hooks* object should now look like this:


        let hooks = {
          'adminui-button': {
            login: function() {
              let modal = this.getParentComponent('adminui-modal-root');
              let _this = this;
              let kpfn =  function(e){
                if(e.which == 13) {
                  _this.rootElement.focus();
                  _this.rootElement.click();
                }
              };
              modal.addHandler(kpfn, 'keypress');

              let fn = function() {
                console.log('button was clicked!');
              };
              this.addHandler(fn);
            }
          }
        };


Once again, save the file and click the browser's *refresh* button to try out this change.

When the modal panel appears, try clicking the *Enter* key.  You should see *button was clicked!* appear
in the browser's JavaScript console.


#### Getting the *username* and *password* to the QEWD Back-end

Now that we have the *Login* button's *click* event handler working nicely, we now need
to hook it up to the QEWD back-end where the user authentication/validation will take place.

We'll make use of the *qewd-client*'s *reply()* method.

The first change we'll need to make is to the first line of the *login-modal.js* Assembly module.  Change:

        export function login_modal_assembly() {

to:

        export function login_modal_assembly(QEWD) {


Accordingly, in your *app.js* we need to change the way it is registered.

Change:

            webComponents.addComponent('login_modal', login_modal_assembly());
to:

            webComponents.addComponent('login_modal', login_modal_assembly(QEWD));



So we now have access to *qewd-client*'s methods within the *login.modal.js* Assembly module.


The next question is how we get access to the *username* and *password* values entered by the user into
the login form?  The *adminui* WebComponents have been deliberately written to make this very straightforward:
the *adminui-form-field* Component automatically passes any value changes into an object within the
parent *adminui-form* Component: *fieldValues*.

So all we have to do is send the *adminui-form* Component's *fieldValues* object to the QEWD back-end.
This code will do it within the Login button's *click* handler:

          // get get a pointer to the form component:

          let form = _this.getComponentByName('adminui-form', 'loginForm');

          // then send the form's field values as a QEWD WebSocket message with
          // a type of 'login'

          // the response will be returned as responseObj

          let responseObj = await QEWD.reply({
            type: 'login',
            params: form.fieldValues
          });


Note that in this instance we can't use *this.getParentComponent()* to go up the DOM hierarchy to 
find the *adminui-form* component
because the *adminui-button* Component resides in the modal panel's footer while the form resides in the
body.  So we use the more generic *getComponentByName()* API instead.
  
Note also that the *QEWD.reply()* method is asynch and therefore uses an *await* keyword.  This means we
must change the handler function from:

        let fn = function() {

to 

        let fn = async function() {


The *responseObj* returned by the QEWD back-end will signal one of two eventualities:

- the username and/or password were invalid, so an error message object is returned.  If so, we'll want to
display the error and the user can try again to login; or

- the username and password were valid, so the user has successfully logged in.  If so, we'll want to remove
the modal login panel and re-display the UI with the full sidebar and any other initial content displayed 
for the user.


Handling the first eventuality is very simple.  In fact we can provide a generic mechanism in the *app.js*
file that will trap and handle all errors using a library named *toastr*:


          QEWD.on('error', function(response) {
            if (response.type === 'error') {
              toastr.error('Programming logic error: ' + response.message);
            }
            else {
              toastr.error(response.message.error);
            }
          });


Note that the *toastr* library is automatically installed as part of the *adminui-root* Component.

While we're at it, it will be a good idea to also add this line to your *app.js* file to
aid in debugging QEWD communication errors during development:

          QEWD.log = true;

So in our *Login* button handler we just need to deal with the eventuality where the user has
successfully logged in.  Let's start by doing this, which will locate the 'adminui-modal-root'
component, and then invoke its *hide()* and *remove()* methods.  The latter actually
recurses down through all any child/grandchild etc sub-components and cleanly removes them also:

          if (!responseObj.message.error) {
            let modal = _this.getParentComponent('adminui-modal-root');
            modal.hide();
            modal.remove();
          }


So, in summary, at this stage your *app.js* file should look like this:

        import {webComponents} from '../../mg-webComponents.js';
        import {QEWD} from '../../qewd-client.js';
        import {initial_sidebar_assembly} from './initial-sidebar.js';
        import {footer_assembly} from './footer.js';
        import {login_modal_assembly} from './login-modal.js';
        
        document.addEventListener('DOMContentLoaded', function() {
          QEWD.on('ewd-registered', function() {
            webComponents.addComponent('initial_sidebar', initial_sidebar_assembly());
            webComponents.addComponent('footer', footer_assembly());
            webComponents.addComponent('login_modal', login_modal_assembly(QEWD));
            let context = {
              paths: {
                adminui: './components/adminui/'
              },
              readyEvent: new Event('ready')
            };
            
           document.addEventListener('ready', function() {
              let modal = webComponents.getComponentByName('adminui-modal-root', 'modal-login');
              modal.show();
            });
            
            let body = document.getElementsByTagName('body')[0];
            webComponents.loadWebComponent('adminui-root', body, context, function(root) {
              webComponents.loadGroup(webComponents.components.initial_sidebar, root.sidebarTarget, context);
              webComponents.loadGroup(webComponents.components.footer, root.footerTarget, context);
              webComponents.loadGroup(webComponents.components.login_modal, body, context);
            });

          });
          
          QEWD.on('error', function(response) {
            if (response.type === 'error') {
              toastr.error('Programming logic error: ' + response.message);
            }
            else {
              toastr.error(response.message.error);
            }
          });

          QEWD.log = true;
          
          QEWD.start({
            application: 'demo'
          });
          
        });



and your *login-modal.js* Assembly file should look like this:


        export function login_modal_assembly(QEWD) {

          let component = {
            componentName: 'adminui-modal-root',
            state: {
              name: 'modal-login',
              static: true
            },
            children: [
              {
                componentName: 'adminui-modal-header',
                state: {
                  title: 'Login'
                }
              },
              {
                componentName: 'adminui-modal-body',
                children: [
                  {
                    componentName: 'adminui-form',
                    state: {
                      name: 'loginForm',
                      cls: 'user'
                    },
                    children: [
                      {
                        componentName: 'adminui-form-field',
                        state: {
                          label: 'Username:',
                          placeholder: 'Enter username...',
                          name: 'username',
                          focus: true
                        }
                      },
                      {
                        componentName: 'adminui-form-field',
                        state: {
                          type: 'password',
                          label: 'Password:',
                          placeholder: false,
                          name: 'password'
                        }
                      }
                    ]
                  }
                ]
              },
              {
                componentName: 'adminui-modal-footer',
                children: [
                  {
                    componentName: 'adminui-button',
                    state: {
                      text: 'Login',
                      colour: 'success',
                      cls: 'btn-block'
                    },
                    hooks: ['login']
                  }
                ]
              }
            ]
          };

          let hooks = {
            'adminui-button': {
              login: function() {
                let modal = this.getParentComponent({match: 'adminui-modal-root'});
                let _this = this;

                let kpfn =  function(e){
                  if(e.which == 13) {
                    // click the button to submit the form
                    _this.rootElement.focus();
                    _this.rootElement.click();
                  }
                };

                modal.addHandler(kpfn, 'keypress');

                let fn = async function() {
                  let form = _this.getComponentByName('adminui-form', 'loginForm');
                  let responseObj = await QEWD.reply({
                    type: 'login',
                    params: form.fieldValues
                  });
                  if (!responseObj.message.error) {
                    let modal = _this.getComponentByName('adminui-modal-root', 'modal-login');
                    modal.hide();
                    modal.remove();
                  }
                };
                this.addHandler(fn);
              }
            }
          };

          return {component, hooks};

        };


Time to try these changes out again.  Click the browser *refresh* button.  This time, try
entering something into the username and password fields and click the button.  You should
see the *toastr* library bring up a red error message in the top-right corner of the display,
saying *Unable to load handler module for: demo*.

If you look in the browser's JavaScript console, you'll see more information:

        sent: {"type":"login","params":{"username":"sdfds","password":"sdf"}}

        received: {"type":"login","finished":true,"message":{"error":"Unable to 
        load handler module for: demo","reason":{"code":"MODULE_NOT_FOUND",
        "requireStack":["C:\\qewd\\node_modules\\qewd\\lib\\appHandler.js",
        "C:\\qewd\\node_modules\\qewd\\lib\\worker.js",
        "C:\\qewd\\node_modules\\qewd\\lib\\qewd.js",
        "C:\\qewd\\node_modules\\qewd\\index.js",
        "C:\\qewd\\node_modules\\ewd-qoper8\\lib\\worker\\proto\\init.js",
        "C:\\qewd\\node_modules\\ewd-qoper8\\lib\\ewd-qoper8.js",
        "C:\\qewd\\node_modules\\ewd-qoper8\\index.js",
        "C:\\qewd\\node_modules\\ewd-qoper8-worker.js"]}},"responseTime":"28ms"}

If you see this, then the good news is that the front-end is successfully communicating
with the QEWD back-end.  You'll see in this message that the values I entered into
the *username* and *password* fields were successfully sent as the *params* payload
of a *type: 'login'* message:

        sent: {"type":"login","params":{"username":"sdfds","password":"sdf"}}

The reason QEWD then returned an error is, as the received message indicates, that
it couldn't find a message handler module for our *demo* application's *login* message type.

That's because we haven't yet written one, so it's hardly surprising!

 








