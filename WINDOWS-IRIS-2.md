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


#### Adding the QEWD Back-end Login Handler Module 

So we'll now move our attention to the QEWD back-end, and write the first handler, in this
case to authenticate/validate the *username* and *password* credentials.

After you started QEWD for the first time, you'll have noticed that a number of files and folders
were added: we've already mentioned some of them and have made use of them.

One such folder that we haven't mentioned yet is the *qewd-apps* folder.  You'll see it amongst the others,
directly under your QEWD installation folder, eg:


        C:\qewd
            |
            |_ package.json
            |
            |_ package-lock.json
            |
            |_ configuration
            |
            |- node_modules
            |
            |- www
            |
            |- qewd-apps
            |


The *qewd-apps* folder is reserved by QEWD for back-end message handler modules for interactive
applications.

If you look in *qewd-apps*, you'll see that one application's back-end handlers has already been
created for you:

        C:\qewd
            |
            |- qewd-apps
                    |
                    |- qewd-monitor-adminui                <=== application name
                                 |
                                 |- changeNodeValue        <=== message type name
                                 |       |
                                 |       |- index.js       <=== handler module
                                 |
                                 |- createNode
                                 |       |
                                 |       |- index.js
                                 |
                                 ..etc


So, as you can see:

- the application name(s) are specified directly under the *qewd-apps* sub-folder

- Under each application name sub-folder are sub-folders whose names correspond to QEWD WebSocket message types

- under each message-type sub-folder is a file named *index.js* which is a module containing the actual hander logic 


In our case, we've named the application *demo*.  If you remember, we did that in the *app.js* file here:

          QEWD.start({
            application: 'demo'   <==== ****
          });


So the first step is to add a sub-folder named *demo* under the *qewd-apps* folder.

The message we're going to handle is named *login*.  If you remember that's from this logic in the modal login's
button handler:


                  let responseObj = await QEWD.reply({
                    type: 'login',                         <===== ***
                    params: form.fieldValues
                  });


So, under the *demo* sub-folder, create a sub-folder named *login*.

Then, within the *login* sub-folder, create a text file named *index.js*.  To summarise, you should now have this
structure:

        C:\qewd
            |
            |- qewd-apps
                    |
                    |- qewd-monitor-adminui
                    |            |
                    |            ...etc
                    |
                    |- demo
                         |
                         |- login
                               |
                               |- index.js


Paste the following content into *index.js*:


        module.exports = function(messageObj, session, send, finished) {

          if (!messageObj.params) {
            return finished({error: 'Invalid login attempt'});
          }

          let username = messageObj.params.username;

          if (!username || username === '') {
            return finished({error: 'Invalid login attempt'});
          }

          let password = messageObj.params.password;

          if (!password || password === '') {
            return finished({error: 'Invalid login attempt'});
          }

          // hard-coded example validation check

          if (username !== 'rob' || password !== 'secret') {
            return finished({error: 'Invalid login attempt'});
          }

          // successfully validated

          session.authenticated = true;
          session.timeout = 3600;
          finished({ok: true});

        };


Let me explain what's happening here.

##### Message Handler Module Signature

All message handler modules for interactive QEWD applications have the same outer signature:

        module.exports = function(messageObj, session, send, finished) {
          // logic goes here
        };


The arguments available to your handler logic are:

- *messageObj*: the incoming message from the browser

- *session*: the QEWD Session that will have been automatically created for the user by this point

- *send*: an optional function that you can use to send what's termed an *intermediate* WebSocket message back to the
browser, even if processing has not yet completed

- *finished*: a mandatory function that serves two purposes:

  - it returns to the browser a WebSocket message containing the object defined as the *finished()* function's argument

  - it signals to QEWD that your processing is complete, and that the QEWD Worker process that has been used for your
handler method can be returned to the available pool so that it can be re-used for another queued incoming message.


##### What our *login* handler module wll be doing

For the purposes of this example, we'e going to use a simple, hard-coded authentication mechanism, 
whereby the username must be *rob* and the password must be *secret*.

In a real-world scenario, you'd perform the validation against an authentication database of some sort, and/or
do so using APIs that you already use for many other applications.  Hopefully, on the basis of this hard-coded
example, you'll be able to see how you could adapt the code to use your own user authentication process.
 
If the username and/or password are invalid, we'll return an object containing an error.

If the username and password are valid, we'll:

- flag the user as having been authenticated within their QEWD Session

- extend the session timeout to a more reasonable length

- return a simple *{ok: true}* response to denote successful login.


##### How that functionality is implemented

We're expecting the *login* message to have been sent using:

                  let responseObj = await QEWD.reply({
                    type: 'login',
                    params: form.fieldValues
                  });

and, as you saw from your browser's console, a message like this was sent:

        {
          "type":"login",
          "params":{
            "username":"sdfds",
            "password":"sdf"
          }
        }

This will be passed to you as the module's *messageObj* argument.

So the first thing we need to confirm is that *messageObj.params* exists.  If not we return an error
object as the argument of the *finished()* function.  Note that if the object returned by the
*finished()* function has an *error* property, it is treated as a special, reserved response type that
should return an error response to the browser:


          if (!messageObj.params) {
            return finished({error: 'Invalid login attempt'});
          }


Next, we check that it contains a non-empty *username* and *password* value.  If not, again we
return an error object and finish processing.  Note that we're sending the same error message regardless
of the reason, so that a malicious user isn't given any clues as to which part of what they have 
typed might be correct or not:


          let username = messageObj.params.username;

          if (!username || username === '') {
            return finished({error: 'Invalid login attempt'});
          }

          let password = messageObj.params.password;

          if (!password || password === '') {
            return finished({error: 'Invalid login attempt'});
          }

Next we perform the validation on the received *username* and *password* values. In the example
we're just doing a simple hard-coded validation:

          if (username !== 'rob' || password !== 'secret') {
            return finished({error: 'Invalid login attempt'});
          }


If it got this far, the username and password must be valid. So we flag in the user's QEWD Session
that they are authenticated.  You'll see later how/why that is used:

          session.authenticated = true;

Initially, when QEWD sessions are created automatically, they are deliberately given a short timeout of 5 minutes.
After login, you'll probably want to extend this to a more reasonable amount of time.  Here we set it to an hour:

          session.timeout = 3600;

And finally we signal that we're finished processing and return a simple object denoting successful login:


          finished({ok: true});


#### Restart QEWD to Load the new *qewd-apps* Handlers

Whenever you first add a new application sub-folder to the *qewd-apps* folder, you **must** restart
QEWD in order to register it.  This is a one-off step for each application you add.

So, stop QEWD (eg if you're running it in a Windows Console session, just type CTRL & C).

Then start it up again:

        npm start


In your browser, reload the page by clicking the *refresh* button.

The login modal form should appear as before.  Enter some invalid text for the *username* and *password* fields and
press the *Enter* key (or click the *Login* button).

If everything was entered correctly and if it all worked, you should see a red *toastr* error panel pop up
in the top right-hand corned saying: *Invalid login attempt*

Now try entering the correct *username* and *password*, ie *rob* and *secret* respectively.  You should see the
modal login panel disappear, and if you look in the browser's JavaScript console, you should see:

        sent: {"type":"login","params":{"username":"rob","password":"secret"}}

        received: {"type":"login","finished":true,"message":{"ok":true},"responseTime":"55ms"}

So you can see that the QEWD back-end authenticated correctly

Then you'll see:


        *** modal header component was removed!
        2 *** form field component was removed!
        *** form component was removed!
        *** modal body component was removed!
        *** button component was removed!
        *** modal footer component was removed!
        *** modal root component was removed!

This shows all the constituent Web Components of the modal panel being removed, along with any handler
that were added to them.

If you check in the browser's Developer Tools Elements view, you'll no longer see the modal panel Components.


#### Updating the UI Panels After Successful Login

Let's summarise what we next need to achieve: now that the user has successfully logged in, we want to
give them access to all the options our application is designed to give them.  In our example, it will
actually just be two things:

- the ability to maintain a Person record via CRUD UI controls
- a means of logging out of the application.

In practice this will mean:

- repopulating the *sidebar* menu with two options:

  - maintain the Person record
  - log out

- since the user has logged in, displaying a welcome message in the *topbar* 

- displaying the initial UI control for maintaining the Person record in the *content panel*


As always there's a variety of ways these things can be done, so I'll be showing you just one possible
solution.  Feel free to think up alternatives once you understand what you have to do and the options
available to you with *mg-webComponents*.


There will be quite a lot of different things to put together for this step, so, rather than implement the
whole thing at once, I'll build it up bit by bit, and try to explain the ideas.


##### How and Where to Trigger this Step

The first question is how and where this UI updating process will be triggered?

Let's backtrack a little and look again at the *hook* method we've created so far for the *Login* button,
specifically the button's *click* handler:

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

So, if you remember, if we don't get an error back from the QEWD *login* message handler, it must
mean the user has successfully logged in, so we removed the modal login panel:

                  if (!responseObj.message.error) {
                    let modal = _this.getComponentByName('adminui-modal-root', 'modal-login');
                    modal.hide();
                    modal.remove();
                  }

So the place to update the UI for a logged-in user must be immediately after that *modal.remove()*
command.  Now, let's think about the context we're in at this point: this is a *hook* method for the
Login button's *adminui-button* component.  If it is to execute some logic to load new/additional
Assembly Modules into the UI, then it will either:

- need access to the *mg-webComponents* module (because it
provides the necessary APIs to load more Assembly modules into the UI); or 

- it needs to be able to execute UI updating logic that we define in the *app.js* Loader Module.


The former could be done, but we'd need to do the following:

- change the first line of the *login-modal.js* Assembly Module from:

        export function login_modal_assembly(QEWD) {

to:

        export function login_modal_assembly(QEWD, webComponents) {


and in the *app.js* file, change:

            webComponents.addComponent('login_modal', login_modal_assembly(QEWD));

to:

            webComponents.addComponent('login_modal', login_modal_assembly(QEWD, webComponents));

We could then write the API calls to load the additional Assemblies.

I don't personally like this approach, because it means that logic related to the UI and its
constituent Assembly Modules ends up hidden inside another Assembly Module, specifically the
*login-modal* one.  That will potentially make maintenance more difficult and make the
logic more difficult for others to understand.

I prefer everything to do with the UI's make-up, in terms of the Assemblies it uses, to be in the one
place: the *app.js* Module, which already has access to all the necessary *mg-webComponents* APIs anyway.

So the question is how to make some logic that we define in the *app.js* Module accessible from
the *hook* method for the *Login* button within the *login-modal* Assembly?

Again, there's a couple of ways this could be done, but the simplest is to make use of the *context*
object, since that is something that is always automatically made available to every WebComponent 
within your Assembly Modules.

So, my approach would be to modify the *Login* button's *hook* method as follows:

                  if (!responseObj.message.error) {
                    let modal = _this.getComponentByName('adminui-modal-root', 'modal-login');
                    modal.hide();
                    modal.remove();
                    _this.context.loadMainView();    <====== *****
                  }

And to make this work, we'll need to define this *loadMainView()* function in the *app.js* Module and add it to the
*context* object.

Where in the *app.js* Module you define this function is up to you, but again, my preference would be
within the callback invoked when we initially loaded the *adminui-root* Component, ie in here:

            let body = document.getElementsByTagName('body')[0];
            webComponents.loadWebComponent('adminui-root', body, context, function(root) {
              webComponents.loadGroup(webComponents.components.initial_sidebar, root.sidebarTarget, context);
              webComponents.loadGroup(webComponents.components.footer, root.footerTarget, context);
              webComponents.loadGroup(webComponents.components.login_modal, body, context);
            });

The reason is that we can make use of the closure created by this callback function, since it already
contains pointers to all the objects and targets we'll need to use.  Hopefully you'll see what I
mean by that as I build out the logic.

First I'm going to tidy that logic up a little to make it more efficient and succinct, by
setting a pointer to *webComponents.components*.  We'll be using that over and over again:


            let body = document.getElementsByTagName('body')[0];
            webComponents.loadWebComponent('adminui-root', body, context, function(root) {
              let components = webComponents.components;
              webComponents.loadGroup(components.initial_sidebar, root.sidebarTarget, context);
              webComponents.loadGroup(components.footer, root.footerTarget, context);
              webComponents.loadGroup(components.login_modal, body, context);
            });


Now we'll add that function to the *context* object.  Initially, within it, I'm just going
to load the new *sidebar_menu* Assembly (which is described in the next section below).


            let body = document.getElementsByTagName('body')[0];
            webComponents.loadWebComponent('adminui-root', body, context, function(root) {
              let components = webComponents.components;
              webComponents.loadGroup(components.initial_sidebar, root.sidebarTarget, context);
              webComponents.loadGroup(components.footer, root.footerTarget, context);
              webComponents.loadGroup(components.login_modal, body, context);

              context.loadMainView = function() {
                webComponents.loadGroup(components.sidebar_menu, root.sidebarTarget, context);
              };

            });

So, by defining the *loadMainView* function here, we're able to make use of the closure around
the *components*, *root* and *context* objects needed by the *loadGroup()* API.

Let's test that this is going to work before going to the next step.  To do that, make a temporary
edit to the *loadMainView()* function:

              context.loadMainView = function() {
                console.log('UI will now be updated...');
                //webComponents.loadGroup(components.sidebar_menu, root.sidebarTarget, context);
              }

In other words, we'll temporarily comment out the *loadGroup()* API since we haven't yet defined
the *sidebar_menu* Assembly, but we'll just confirm that the *Login* button's *hook* method 
correctly invokes it.

Click the browser's *refresh* button and, after logging in with the correct *username* and *password*,
you should see the modal panel disappear, and in the browser's JavaScript console you should see
our *console.log* message appear: *UI will now be updated...*.

So now we know this will work, remove the *console.log* command and the comment from the *loadGroup()* API.

We're now ready to define the *sidebar* menu.


##### Create the New *sidebar* Menu Contents

Initially, during login, we just displayed a title at the top of the
*sidebar*.  We're now going to append a further Assembly to the *sidebar*, containing the menu for a logged-in
user.  Let's call this additional Assembly Module *sidebar-menu.js".

So in your application's *js* folder, create a new text file named *sidebar-menu.js* and paste the following
content:

        export function sidebar_menu_assembly() {

          let component = [
            {
              componentName: 'adminui-sidebar-divider',
              state: {
                isTop: true
              }
            },
            {
              componentName: 'adminui-sidebar-nav-item',
              state: {
                title: 'Person Editor',
                icon: 'user',
                contentPage: 'person',
                active: true
              }
            }
          ];

          return {component};

        };

Initially I'm just adding an array of two *adminui* WebComponents:

- *adminui-sidebar-divider*: this simply displays a horizontal divider bar across the *sidebar* to create a visual
break

- *adminui-sidebar-nav-item*: this creates a clickable menu option and associated icon.  The idea is that clicking
the menu option will load a specified Assembly into the UI's *content area*.  This is specified by the *contentPage*
property which, in the example above, is going to load an Assembly named *person* into the *content area*.  

  This will be the default option in this example, and, in fact, as you'll see later, we're going to pre-load the
*person* Assembly into the *content area* anyway, so we'll want this menu option to be highlighted as the
actively-selected option.  We do that by specifying *active: true*


##### Load the Sidebar Menu Assembly:

So now make the following changes to your *app.js* file:

Near the top, import the Sidebar Menu Assembly Module:

        import {sidebar_menu_assembly} from './sidebar-menu.js';

Then load/register it:

            webComponents.addComponent('sidebar_menu', sidebar_menu_assembly());

It will now be available when the *loadMainView()* function loads it into the UI.

To summarise, at this stage, here's what your *app.js* file should look now look like:

        import {webComponents} from '../../mg-webComponents.js';
        import {QEWD} from '../../qewd-client.js';
        import {initial_sidebar_assembly} from './initial-sidebar.js';
        import {footer_assembly} from './footer.js';
        import {login_modal_assembly} from './login-modal.js';
        import {sidebar_menu_assembly} from './sidebar-menu.js';
        
        document.addEventListener('DOMContentLoaded', function() {
          QEWD.on('ewd-registered', function() {
            webComponents.addComponent('initial_sidebar', initial_sidebar_assembly());
            webComponents.addComponent('footer', footer_assembly());
            webComponents.addComponent('login_modal', login_modal_assembly(QEWD, webComponents));
            webComponents.addComponent('sidebar_menu', sidebar_menu_assembly());
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
              let components = webComponents.components;
              webComponents.loadGroup(components.initial_sidebar, root.sidebarTarget, context);
              webComponents.loadGroup(components.footer, root.footerTarget, context);
              webComponents.loadGroup(components.login_modal, body, context);

              context.loadMainView = function() {
                webComponents.loadGroup(components.sidebar_menu, root.sidebarTarget, context);
              }
              
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


and your *login-modal.js* Module file should look like this:

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
                    _this.context.loadMainView();
                  }
                };
                this.addHandler(fn);
              }
            }
          };

          return {component, hooks};

        };


Try out this latest by clicking your browser's *refresh* button.

This time, after successfully logging in, not only should you see the modal panel disappear, but the new 
*Person Editor* menu item should now appear in the *sidebar*.

Clicking on the menu option won't do anything, but you'll also see that it doesn't generate any errors, even though
we've not yet defined the *person* Content Page.


##### Update the *topbar* with a Greeting

Within your application's *js* folder, create a new text file named *topbar.js*.  Paste the following content into it:

        export function topbar_assembly() {
          let component = [
            {
              componentName: 'adminui-topbar-text',
              state: {
                text: 'Welcome to the Person Editor!'
              }
            }
          ];
          return {component};
        };

The *adminui-topbar-text* Web Component is designed to display text in the UI's *topbar* panel.

The next steps should be beginning to become familiar.  In your *app.js* module:

Near the top, import the Sidebar Menu Assembly Module:

        import {topbar_assembly} from './topbar.js';

Then load/register it:

            webComponents.addComponent('topbar', topbar_assembly());

and finally, load it within the *loadMainView()* function:


              context.loadMainView = function() {
                webComponents.loadGroup(components.sidebar_menu, root.sidebarTarget, context);
                webComponents.loadGroup(components.topbar, root.topbarTarget, context);
              }

Try out this version in your browser: you should now see the welcome text in the *topbar*.


##### Displaying a Personalised Greeting

Of course, what we've displayed is static text.  If, instead, you wanted to display a personalised greeting,
eg: *Welcome to the Person Editor, Rob*, how could that be done?

Well, of course, for this to be possible, the back-end user authentication system would need to have
available to it some kind of greeting name property associated with each username, and this would have
to be retrieved in order to display it in the *topbar* text.

Let's hard-code a version to show how it could be done.

Return to the QEWD back-end *login* handler module you created earlier.  If you remember, this was in
the *C:\qewd\qewd-apps\demo\login\index.js* file and looked like this:

        module.exports = function(messageObj, session, send, finished) {

          if (!messageObj.params) {
            return finished({error: 'Invalid login attempt'});
          }

          let username = messageObj.params.username;

          if (!username || username === '') {
            return finished({error: 'Invalid login attempt'});
          }

          let password = messageObj.params.password;

          if (!password || password === '') {
            return finished({error: 'Invalid login attempt'});
          }

          // hard-coded example validation check

          if (username !== 'rob' || password !== 'secret') {
            return finished({error: 'Invalid login attempt'});
          }

          // successfully validated

          session.authenticated = true;
          session.timeout = 3600;
          finished({ok: true});

        };

For this example, I'm just going to hard-code a greeting name.  The key trick is that I'm going
to save it into the user's QEWD session.  I'll edit this bit:

          session.authenticated = true;
          session.timeout = 3600;

to this:

          session.authenticated = true;
          session.timeout = 3600;
          session.data.$('greetingName').value = 'Rob';

What we're doing here is using the QEWD Session's custom data, which is made available to you as a 
QEWD-JSdb DocumentNode Object: *session.data*.  We're adding a property to it named *greetingName* with
a hard-coded value of *Rob*.

Of course, in a real-world application, that name would have been fetched from the user authentication database.
However, you'd still put it into the user's QEWD Session.  You'll see why in a minute.


The next step is to edit the *topbar.js* Assembly Module.  Instead of defining a static piece of text, we'll
add a *hook* method that fetches the greeting text using a QEWD WebSocket message.

Replace the contents of your *topbar.js* Module file with this:

        export function topbar_assembly(QEWD) {
          let component = [
            {
              componentName: 'adminui-topbar-text',
              hooks: ['getGreeting']
            }
          ];

          let hooks = {
            'adminui-topbar-text': {
              getGreeting: async function() {
                let responseObj = await QEWD.reply({
                  type: 'getGreeting'
                });
                if (!responseObj.message.error) {
                  this.setState({
                    text: 'Welcome to the Person Editor, ' + responseObj.message.greetingName
                  });
                }
              }
            }
          };
          
          return {component, hooks};
        };

        
Let me highlight the changes:

- the first line has been changed to make the *qewd-client* APIs available to the Assembly Module:

        export function topbar_assembly(QEWD) {

 
- we're now invoking a *hook* method when the *adminui-topbar-text* Component is loaded and rendered:


            {
              componentName: 'adminui-topbar-text',
              hooks: ['getGreeting']
            }


and that *hook* method is defined as follows:

          let hooks = {
            'adminui-topbar-text': {
              getGreeting: async function() {
                let responseObj = await QEWD.reply({
                  type: 'getGreeting'
                });
                if (!responseObj.message.error) {
                  this.setState({
                    text: 'Welcome to the Person Editor, ' + responseObj.message.greetingName
                  });
                }
              }
            }
          };

It simply sends a QEWD message with a type of *getGreeting*:

                let responseObj = await QEWD.reply({
                  type: 'getGreeting'
                });

and uses its response to dynamically set the *text* state property of the Component.

                  this.setState({
                    text: 'Welcome to the Person Editor, ' + responseObj.message.greetingName
                  });


So that's the front-end functionality in place.  Now let's write the QEWD back-end message handler
method for that *getGreeting* message.

Create a new path for it:

        C:\qewd
            |
            |- qewd-apps
                    |
                    |- demo
                         |
                         |- getGreeting
                               |
                               |- index.js


and paste the following contents in the *index.js* file

        module.exports = function(messageObj, session, send, finished) {
          if (session.authenticated) {
            finished({greetingName: session.data.$('greetingName').value});
          }
          else {
            finished({error: 'Not authenticated'});
          }
        };
          
  
Note that QEWD will automatically use the correct QEWD Session when the message is handled.  This
is accomplished via a randomly-generated token that is exchanged between the browser and QEWD when
the initial connection and registration takes place.

You'll notice that we're first checking whether or not the user is authenticated: this is to
prevent malicious attempts to access this back-end handler method from the browser's console
by an unauthenticated user who will nevertheless have a valid QEWD Session token if they
simply load the *demo* application into their browser.

If authenticated, you'll see that what is returned is the same QEWD Session custom data as
we set in the *login* handler.

Save the *index.js* file.


##### IMPORTANT: Stop all QEWD Worker Processes

If you were to try out the application at this point, you'd find that an error would be reported
when it tries to send the *getGreeting* message.  That's because the Worker Processes that actually
invoke your message handler methods cache existing ones and can't automatically find new ones.

So, whenever you add or edit a back-end handler method
for an existing application, you must first do one of two things:

- *restart QEWD*: this isn't my recommended approach, but it will always work

- *stop all QEWD Worker Processes*: This is my recommendation.  Use the *qewd-monitor-adminui* application
to do this.  Login using the *managementPassword* that you specified in the *config.json* file, then select
the Processes menu option.  Stop **all** the Worker processes by clicking the red X button next to each one
in the Worker Processes panel.  I always keep a copy of *qewd-monitor-adminui* running during application
development for this purpose.

  Note that you'll find that when you stop the last Worker process, a new one will
automatically appear: that's OK, just ignore that one, and at this point you're ready to re-try the
*demo* application.

##### Try out the *demo* Application

Login and you should now see the message appear in the *topbar*:

        Welcome to the Person Editor, Rob

If you look in the browser's JavaScript console, you should see the response received from QEWD that
was used for that message text, eg:

        received: {"type":"getGreeting","finished":true,"message":{"greetingName":"Rob"},"responseTime":"10ms"}


##### Making the UI Truly Responsive

There's two more small additions we can now make to the *sidebar* and the *topbar* to make the UI really 
responsive and behave nicely within the small area available in a mobile device.

We do this by adding special *toggler* WebComponents.

First, change the *sidebar_menu.js* Assembly Module as follows:

        export function sidebar_menu_assembly() {

          let component = [
            {
              componentName: 'adminui-sidebar-divider',
              state: {
                isTop: true
              }
            },
            {
              componentName: 'adminui-sidebar-nav-item',
              state: {
                title: 'Person Editor',
                icon: 'user',
                contentPage: 'person',
                active: true
              }
            },
            {
              componentName: 'adminui-sidebar-divider',
            },
            {
              componentName: 'adminui-sidebar-toggler',
            }
          ];

          return {component};

        };


And then change the *topbar.js* Assembly Module to this:

        export function topbar_assembly(QEWD) {
          let component = [
            {
              componentName: 'adminui-topbar-toggler'
            },
            {
              componentName: 'adminui-topbar-text',
              hooks: ['getGreeting']
            }
          ];

          let hooks = {
            'adminui-topbar-text': {
              getGreeting: async function() {
                let responseObj = await QEWD.reply({
                  type: 'getGreeting'
                });
                if (!responseObj.message.error) {
                  this.setState({
                    text: 'Welcome to the Person Editor, ' + responseObj.message.greetingName
                  });
                }
              }
            }
          };
          
          return {component, hooks};
        };


Try it out by clicking the browser's *refresh* button.  You should now see an arrow widget at the bottom of the
*sidebar* menu which, if clicked, will collapse the sidebar.

If you then try running the application in a mobile device's browser, you'll see another toggler device appears
that collapses the menu into a "hamburger" menu widget.


It's always a good idea to add both these WebComponents to any of your applications' *sidebar* and *topbar* Assemblies.


##### Add a Logout Menu Option

Let's now add another option to the *sidebar* menu, allowing the user to log out and terminate their
QEWD Session.  

The way this will work is that, when the *logout* menu option is clicked, a modal panel will appear, asking
the user to confirm that they really do want to logout: in case the option was clicked by accident.

The modal confirmation panel will allow the user to:

- *cancel*: in which case the modal will disappear and the user can carry on as before

- *accept*: in which case the user is logged out and returned to the login sequence

So, first, edit the *sidebar_menu.js* Assembly Module as follows:

        export function sidebar_menu_assembly() {

          let component = [
            {
              componentName: 'adminui-sidebar-divider',
              state: {
                isTop: true
              }
            },
            {
              componentName: 'adminui-sidebar-nav-item',
              state: {
                title: 'Person Editor',
                icon: 'user',
                contentPage: 'person',
                active: true
              }
            },
            {
              componentName: 'adminui-sidebar-divider',
            },
            {
              componentName: 'adminui-sidebar-nav-item',
              state: {
                title: 'Logout',
                icon: 'power-off',
                use_modal: 'logout-modal'
              }
            },
            {
              componentName: 'adminui-sidebar-divider',
            },
            {
              componentName: 'adminui-sidebar-toggler',
            }
          ];

          return {component};

        };


The crucial bit we've added is this:

            {
              componentName: 'adminui-sidebar-nav-item',
              state: {
                title: 'Logout',
                icon: 'power-off',
                use_modal: 'logout-modal'
              }
            },


As you can see it's another *adminui-sidebar-nav-item* Component, but this time, instead of
loading an Assembly into the "content area", it is specifying that a modal panel Assembly with a name
property of *modal-logout* should be brought into play when the option is clicked:

                use_modal: 'logout-modal'


The next step is to create the modal logout Assembly Module.  In your application's *js* 
folder, create a file named *logout_modal.js*.  Paste the following content into it:

        export function define_logout_modal(QEWD) {

          let component = {
            componentName: 'adminui-modal-root',
            state: {
              name: 'logout-modal'
            },
            children: [
              {
                componentName: 'adminui-modal-header',
                state: {
                  title: 'Logout'
                },
                children: [
                  {
                    componentName: 'adminui-modal-close-button',
                  }
                ]
              },
              {
                componentName: 'adminui-modal-body',
                state: {
                  text: 'Are you sure you want to logout?'
                }
              },
              {
                componentName: 'adminui-modal-footer',
                children: [
                  {
                    componentName: 'adminui-modal-cancel-button',
                  },
                  {
                    componentName: 'adminui-button',
                    state: {
                      text: 'Logout',
                      colour: 'danger',
                      cls: 'btn-block'
                    },
                    hooks: ['logout']
                  }
                ]
              }
            ]
          };

          QEWD.on('socketDisconnected', function() {
            toastr.warning('You have successfully logged out');
            setTimeout(function() {
              location.reload();
            }, 3000);
          });

          let hooks = {
            'adminui-button': {
              logout: function() {
                let fn = async function() { 
                  let responseObj = await QEWD.reply({
                    type: 'logout'
                  });
                  QEWD.disconnectSocket();
                };
                this.addHandler(fn);
              }
            }
          };

          return {component, hooks};
        };

Let's go through this and see what it's going to do.

It's another instance of an *adminui* modal panel with a header, body and footer, just as we saw in
the *login-modal* Assembly.

There's a few differences though:

- we've given the *adminui-modal-root* Component a name of *logout-modal*, ie:

          let component = {
            componentName: 'adminui-modal-root',
            state: {
              name: 'logout-modal'
            },

  This matches the name we specified earlier in the *sidebar* nav menu item, ie:

            {
              componentName: 'adminui-sidebar-nav-item',
              state: {
                title: 'Logout',
                icon: 'power-off',
                use_modal: 'logout-modal'
              }
            },


- the header now includes a close button:

              {
                componentName: 'adminui-modal-header',
                state: {
                  title: 'Logout'
                },
                children: [
                  {
                    componentName: 'adminui-modal-close-button',
                  }
                ]
              },


- the body is simply some fixed text:

              {
                componentName: 'adminui-modal-body',
                state: {
                  text: 'Are you sure you want to logout?'
                }
              },

- it's actually the footer that does all the work, containing the
*Cancel* and *Logout* (ie confirm) buttons:

              {
                componentName: 'adminui-modal-footer',
                children: [
                  {
                    componentName: 'adminui-modal-cancel-button',
                  },
                  {
                    componentName: 'adminui-button',
                    state: {
                      text: 'Logout',
                      colour: 'danger',
                      cls: 'btn-block'
                    },
                    hooks: ['logout']
                  }
                ]
              }

Notice that the Cancel button's display and functionality is encapsulated into a
single, re-usable Web Component - *adminui-modal-cancel-button* - since its behaviour
will always be the same in every Modal panel: it simply hides the modal panel when clicked.

The behaviour of the *Logout* button is described and controlled by a *hook* method named,
unsurprisiungly, *logout*.  So let's now take a look at that hook method:

          let hooks = {
            'adminui-button': {
              logout: function() {
                let fn = async function() { 
                  let responseObj = await QEWD.reply({
                    type: 'logout'
                  });
                  QEWD.disconnectSocket();
                };
                this.addHandler(fn);
              }
            }
          };

This adds a click event handler to the *Logout* button - we analysed this kind of logic 
in detail previously how this works when we looked at the *Login* button.

What the handler will do when the button is clicked is to send a QEWD message with a type of
*logout*:


                  let responseObj = await QEWD.reply({
                    type: 'logout'
                  });

We'll see later below what actually happens at the QEWD back end when that message is
received, but when the response is returned, it invokes this QEWD API:


                  QEWD.disconnectSocket();

As its name implies, this tells the browser to disconnect the WebSocket connection to
QEWD.

However, at this point we want the browser to somehow redirect itself back to the
login prompt.  That trick is done by making use of an event that the QEWD Client fires 
(*socketDisconnected*) when the QEWD WebSocket is disconnected:

          QEWD.on('socketDisconnected', function() {
            toastr.warning('You have successfully logged out');
            setTimeout(function() {
              location.reload();
            }, 3000);
          });


So, a *toastr* warning will appear:

            toastr.warning('You have successfully logged out');

and, after 3 seconds, the browser will reload

              location.reload();

and of course, as you've
seen every time you click the browser's *refresh* button, a reload will restart the whole process and
the login modal panel will appear.


We now need to connect this *logout-modal* Assembly Module into the *app.js* file:

Near the top, import the Sidebar Menu Assembly Module:

        import {logout_modal_assembly} from './logout-modal.js';

Then load/register it:

            webComponents.addComponent('logout_modal', logout_modal_assembly());

and finally, load it within the *loadMainView()* function.  Notice that its target is the
DOM's *body* tag:


              context.loadMainView = function() {
                webComponents.loadGroup(components.sidebar_menu, root.sidebarTarget, context);
                webComponents.loadGroup(components.topbar, root.topbarTarget, context);
                webComponents.loadGroup(components.logout_modal, body, context);
              }



##### The QEWD Back-end *logout* Handler

The final part of the logout functionality we need to put in place is the QEWD back-end message
handler for the *logout* message type.

Create the folder path for its *index.js* module file:

        C:\qewd
            |
            |- qewd-apps
                    |
                    |- demo
                         |
                         |- logout
                               |
                               |- index.js


and paste the following contents into the *index.js* file:

        module.exports = function(messageObj, session, send, finished) {

          if (!session.authenticated) {
            return finished({error: 'Not authenticated'});
          }

          session.delete();
          finished({ok: true});

        };


Once again, we ensure that the incoming request is for an authenticated user, and if so, it's simply
a matter of invoking the *delete()* method for the QEWD Session:


          session.delete();

and then returning an OK response:

          finished({ok: true});


Save the *index.js* file and use the *qewd-monitor-adminui* application to stop all the Worker Processes.



We should now be ready to try out the logout functionality in the browser: this time when you log in,
the *sidebar* menu should include a *Logout* option which, when clicked, should bring up a modal dialogue
panel that asks you to confirm that you really do want to log out.  

Try clicking the Cancel button (or the modal panel's close button, or simply click anywhere outside the panel).

Then try again, and this time click the Logout button to confirm that's what you really want to do.  You should see
a *toastr* warning that you've successfully logged out, and then 3 seconds later, the page will reload and
you'll be asked to login again.


#### The CRUD Assembly

We've now reached the point where everything in the application is working, **apart** from the very bit we really want
it to do and set out to describe!

It's taken a while to get here, but by now you've learned most of the core surrounding functionality that 
you'll need to implement in pretty much any *adminui* / QEWD Application, so it's been time well spent.  








