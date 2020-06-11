# Standalone Interactive WebSocket-based CRUD Application, using Cach&eacute; or IRIS Natively on Windows

## Contents

- [Introduction](#introduction)
- [Initial Steps](#initial-steps)
- [Set up your QEWD System](#set-up-your-qewd-system)
- [Stage 1: Loading and Rendering the Admin UI Framework](#stage-1-loading-and-rendering-the-admin-ui-framework)
- [Stage 2: Adding the QEWD Client Module](#stage-2-adding-the-qewd-client-module)
- [Stage 3: Adding a Login Sequence](#stage-3-adding-a-login-sequence)
- [Stage 4: Add a Footer](#stage-4-add-a-footer)
- [Stage 5: Add the Login Modal Panel](#stage-5-add-the-login-modal-panel)
- [Stage 6: Displaying the Login Modal Panel](#stage-6-displaying-the-login-modal-panel)
- [Stage 7: Add the Login Form to the Modal Panel](#stage-7-add-the-login-form-to-the-modal-panel)
- [Stage 8: Clicking the Login Button via the Enter Key](#stage-8-clicking-the-login-button-via-the-enter-key)
- [Stage 9: Integrating with the QEWD Back-end](#stage-9-integrating-with-the-qewd-back-end)
- [Stage 10: Adding the QEWD Back-end Login Handler Module](#stage-10-adding-the-qewd-back-end-login-handler-module)
- [Stage 11: Updating the UI Panels After Successful Login](#stage-11-updating-the-ui-panels-after-successful-login)
- [Stage 12: Updating the Sidebar after Login](#stage-12-updating-the-sidebar-after-login)
- [Stage 13: Update the topbar with a Greeting after Login](#stage-13-update-the-topbar-with-a-greeting-after-login)
- [Stage 14: Personalise the Greeting](#stage-14-personalise-the-greeting)
- [Stage 15: Making the Admin UI Truly Responsive](#stage-15-making-the-admin-ui-truly-responsive)
- [Stage 16: Add a Logout Menu Option](#stage-16-add-a-logout-menu-option)
- [Stage 17: The CRUD Assembly](#stage-17-the-crud-assembly)
- [Stage 18: Customising the CRUD Page](#stage-18-customising-the-crud-page)
- [Stage 19: Customising the Summary Card](#stage-19-customising-the-summary-card)
- [Stage 20: Creating a Person Record](#stage-20-creating-a-person-record)
- [Stage 21: Customise the Summary Table Display](#stage-21-customise-the-summary-table-display)
- [Stage 22: Implementing the Update Step of the CRUD Cycle](#stage-22-implementing-the-update-step-of-the-crud-cycle)
- [Stage 23: Customise the Edit Person Card](#stage-23-customise-the-edit-person-card)
- [Stage 24: Saving an Edited Person Record](#stage-24-saving-an-edited-person-record)
- [Stage 25: Deleting Person Records](#stage-25-deleting-person-records)


----

# Introduction

The instructions below explain how to create an interactive, browser-based application
using QEWD's WebSocket communication with a back-end running on Windows with
either Cach&eacute; or IRIS.

[Watch this video](https://www.youtube.com/watch?v=d-NICYqv_2s) for a preview of
the application you'll build in the tutorial, and also for a summary of the technology
stack used during development and for run-time.

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


## Starting QEWD for the First Time

Start QEWD for the first time as follows:

        cd \qewd
        npm start

The first time you start QEWD, it installs a bunch of extra things, so you'll see
new sub-folders named *www* and *qewd-apps* appear. QEWD has loaded in everything you need
for monitoring your system and for developing interactive applications if you wish to do so.

When you're running QEWD with Cach&eacute; or IRIS on Windows, it will also have
automatically downloaded and installed the correct version of the
[*mg-dbx*](https://github.com/chrisemunt/mg-dbx) interface along with its associated
ObjectScript code interface for Cach&eacute; or IRIS SQL.

After this initial installation has completed, QEWD will stop and ask you
to restart.  See the instructions below:


## Re-starting QEWD

Each time you subsequently want to start QEWD, first make sure you're in your QEWD Installation folder, eg

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


## The QEWD Interactive Application Development Environment

After QEWD started for the first time, it had automatically installed and configured everything you'll need to begin
developing the example application described in this tutorial.  You'll find most of what's needed
 in the *www* directory that QEWD created for you.  Look for the following:

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


## The *mg-webComponents* Framework

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



## You're Ready to Start Developing

Everything is now ready for you to begin developing the example application!

This tutorial will show you how to build out the application in a series of incremental stages, so let's begin

----


# Stage 1: Loading and Rendering the Admin UI Framework


## Decide on a name for your application

I'm going to call this application *demo*, but you can use any name you like.

Create the appropriately-named folder under your QEWD WebServer Root Directory, eg in my case:


          c:\qewd                         QEWD Installation Directory
               |
               |- www                     QEWD WebServer Root Directory
                   |
                   |- demo                Application folder



## Create the HTML Loader Page

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


## Create the Load/Render Module

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


## Try out the application.

To summarise, [see here](https://github.com/robtweed/qewd-microservices-examples/tree/master/src/windows-iris-crud/stage_1) to confirm what your application's folder layout and files should look like at
this stage of this tutorial.

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


## How It All Works

But first, let's do a step-by-step study into the logic you pasted into the *app.js* file and 
discover how and why the UI appeared.

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


----

# Stage 2: Adding the QEWD Client Module

## Background

Our application will need to communicate with the QEWD back-end.  The
 [QEWD Client ES6 Module](https://github.com/robtweed/qewd-client) handles all that for you,
so we should load that into our front-end logic.


## Loading the QEWD-Client Module

Edit the *app.js* file.

Add this line at the top of your *app.js* file:

        import {QEWD} from '../../qewd-client.js';

This will import the ES6 module named *qewd-client.js* from the QEWD WebServer's root path.

At the end of the *DOMContentLoaded* callback, add this to start the QEWD client connection:

        QEWD.start({
          application: 'demo',
        });

The *application* value must match the name you've chosen for your application.

Next, move the rest of the logic that was within the *DOMContentLoaded* callback into a new, additional
callback which triggers when the QEWD WebSocket connection is established and ready for use:


        QEWD.on('ewd-registered', function() {
          // perform the application logic here
        });


## Try it Out

To summarise, [see here](https://github.com/robtweed/qewd-microservices-examples/tree/master/src/windows-iris-crud/stage_2) 
to confirm what your application's folder layout and files should look like at this stage of this tutorial.


You can test this change by clicking your browser's reload button.  Provided you haven't introduced any
JavaScript syntax errors into the *app.js* module, you should see no change in the rendered content.  However, 
if you open the browser's Developer Tools and look at the JavaScript console, you should see this:

        demo registered

You'll also see some activity in your QEW back-end console log, showing an exchange of messages between
your browser and the QEWD back-end.


----

# Stage 3: Adding a Login Sequence

## The Approach

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

We'll build up this functionality in the next few stages.


## Define the initial sidebar Assembly Module

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


## Import the initial sidebar Assembly Module into the *app.js* Module


Near the top of the *app.js* file, we now import the *initial-sidebar* Assembly Module:

        import {initial_sidebar_assembly} from './initial-sidebar.js';


## Load/Register the initial sidebar Assembly Module


Next, within your *app.js* file, within the *DOMContentLoaded* callback, we load and register 
the *initial-sidebar* Assembly Module using the *mg-webComponents* *addComponent()* method:

        webComponents.addComponent('initial_sidebar', initial_sidebar_assembly());

Note that we've now assigned a name - *initial_sidebar* - to it.  So it will now be accessible
via *webComponents.components.initial_sidebar*.

## Render the initial sidebar

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

## Try it Out

To summarise, [see here](https://github.com/robtweed/qewd-microservices-examples/tree/master/src/windows-iris-crud/stage_3) 
to confirm what your application's folder layout and files should look like at this stage of this tutorial.


Test out your changes so far by clicking your browser's reload button

The UI should load its four panels as before, but now you should see the *Person Editor* title and an icon at
the top of the *sidebar* panel.

----

# Stage 4: Add a Footer


## Add the Footer Assembly

The steps for this are similar to those above for the *sidebar*:

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


## Try it Out

To summarise, [see here](https://github.com/robtweed/qewd-microservices-examples/tree/master/src/windows-iris-crud/stage_4) 
to confirm what your application's folder layout and files should look like at this stage of this tutorial.

Try the Stage 4 changes out by clicking your browser's *reload* button.  You should now see the
copyright message appearing in the UI's footer panel!


----

# Stage 5: Add the Login Modal Panel


## Background

We're now ready to add the logic that will display a modal login panel.

This is a little bit trickier as it requires two steps:

- adding the modal panel's Bootstrap markup to the DOM's *body* tag
- once everything else is ready, bring the modal panel into view

Let's start with the first step, which follows a similar pattern to what we've done previously.


## Create the *login-modal* Assembly module

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


## Hook the *modal-login* Assembly into your *app.js* Module

Follow the same pattern that we used for the other panel Assembly modules:

- In your *app.js* file:

  - import the *login-modal* Assembly Module:

        import {login_modal_assembly} from './login-modal.js';

  - register it into *mg-webComponents*:

        webComponents.addComponent('login_modal', login_modal_assembly());

  - render it into the *body* tag:

        webComponents.loadGroup(webComponents.components.login_modal, body, context);


## Try it Out

To summarise, [see here](https://github.com/robtweed/qewd-microservices-examples/tree/master/src/windows-iris-crud/stage_5) 
to confirm what your application's folder layout and files should look like at this stage of this tutorial.

Try it out by clicking the browser's *refresh* button

You should just see the UI panels as before, without any apparent difference.  However, if you use the
browser's Developer Tools and view the Elements, you should see that the *adminui-modal-root* custom tag
has been added into the *body*.

So the modal is there, but just not visible.


----

# Stage 6: Displaying the Login Modal Panel

## Background

This is a bit more tricky behind the scenes than might appear.  Whilst everything in the initial view
is loading and rendering, it's also loading the various JavaScript libraries that are used by the
Bootstrap components: in particular the jQuery library.  This must be fully loaded before the
modal panel's *show()* method can be invoked.

For this reason, the *adminui-root* WebComponent has been written such that it will fire an event to signal that 
everything is ready and loaded.  The trick is therefore to
hook into and use that event to bring the modal login panel into view, because then it will be safe to do so.

## Define the Event and its Handler

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


## Try it Out

To summarise, [see here](https://github.com/robtweed/qewd-microservices-examples/tree/master/src/windows-iris-crud/stage_6) 
to confirm what your application's folder layout and files should look like at this stage of this tutorial.

Click the browser's *refresh* button and see what happens this time.

This time, the *bare-bones* modal panel should appear automatically, with the UI's main panels
greyed out in the background.

----

# Stage 7: Add the Login Form to the Modal Panel


## Add the Login Form and its Input Fields

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


## Add the Login Button

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


## Try it Out

Save the file and click the browser's *refresh* button.  You should now see the button in the modal panel's footer.
So in terms of markup we now have everything we need.


## Enabling the Login Button

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


## Try it Out

To summarise, [see here](https://github.com/robtweed/qewd-microservices-examples/tree/master/src/windows-iris-crud/stage_7) 
to confirm what your application's folder layout and files should look like at this stage of this tutorial.

Try this updated version of the application by clicking the browser's *refresh* button.

You should now see *button was clicked!* in the browser's JavaScript console when you click the
*Login* button.


----

# Stage 8: Clicking the Login Button via the *Enter* Key

## Background

Something that can be very useful to enable in a login form like this is to cause the *Login* button
to be implicitly clicked if the user presses the *Enter* Key.


## Modify the Modal Root Component

This behaviour is actually pretty simple to enable by adding another
 (albeit a little more complex) handler within the *hook* method:

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
context is the *adminui-button* Component which is within the *adminui-modal-footer* Component.  The easiest
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

## Try it Out

To summarise, [see here](https://github.com/robtweed/qewd-microservices-examples/tree/master/src/windows-iris-crud/stage_8) 
to confirm what your application's folder layout and files should look like at this stage of this tutorial.

Once again, click the browser's *refresh* button to try out this change.

When the modal panel appears, try clicking the *Enter* key.  You should see *button was clicked!* appear
in the browser's JavaScript console.


----

# Stage 9: Integrating with the QEWD Back-end


## Getting the *username* and *password* to the QEWD Back-end

Now that we have the *Login* button's *click* event handler working nicely, we next need
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


## Try it Out

There were quite a few changes made in this Stage 9, so to summarise, 
[see here](https://github.com/robtweed/qewd-microservices-examples/tree/master/src/windows-iris-crud/stage_9) 
to confirm what your application's folder layout and files should look like at this stage of this tutorial.

Then try these changes out.  Click the browser *refresh* button.  

This time, when the modal login panel appears, try
entering something into the username and password fields and click the *Login* button.  You should
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


----

# Stage 10: Adding the QEWD Back-end Login Handler Module

## The *qewd-apps* Folder

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


## Create a *qewd-apps* Folder for the *demo* Application

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



## Add the QEWD Back-end Login Handler Logic

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


## How the Login Handler Works

Let me explain what's happening here.

### Message Handler Module Signature

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


### What our *login* handler module wll be doing

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


### How that functionality is implemented

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


## Try it Out

### Check Your Code Changes

[See here](https://github.com/robtweed/qewd-microservices-examples/tree/master/src/windows-iris-crud/stage_10) 
to confirm what your application's folder layout and files should look like at this stage of this tutorial.


### Restart QEWD to Load the new *qewd-apps* Handlers

Whenever you first add a new application sub-folder to the *qewd-apps* folder, you **must** restart
QEWD in order to register it.  This is a one-off step for each application you add.

So, stop QEWD (eg if you're running it in a Windows Console session, just type CTRL & C).

Then start it up again:

        npm start


### Try Logging In

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


----

# Stage 11: Updating the UI Panels After Successful Login

## Background

Let's summarise what we next need to achieve: 

Now that the user has successfully logged in, we want to
give them access to all the options our application is designed to give them.  In our example, it will
actually just be two things:

- the ability to maintain a Person record via CRUD UI controls
- a means of logging out of the application.

In practice this will mean:

- populating the *sidebar* menu with two new options:

  - maintain the Person record
  - log out

- since the user has logged in, displaying a welcome message in the *topbar* 

- displaying the initial UI control for maintaining the Person record in the *content panel*


As always there's a variety of ways these things can be done, so I'll be showing you just one possible
solution.  Feel free to think up alternatives once you understand what you have to do and the options
available to you with *mg-webComponents*.


There will be quite a lot of different things to put together for this step, so, rather than implement the
whole thing at once, I'll build it up bit by bit, and try to explain the ideas.


## How and Where to Trigger this Step

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

If you remember, assuming we don't get an error back from the QEWD *login* message handler, it must
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


## Harnessing the *context* Object

My suggested approach is to modify the *Login* button's *hook* method as follows:

                  if (!responseObj.message.error) {
                    let modal = _this.getComponentByName('adminui-modal-root', 'modal-login');
                    modal.hide();
                    modal.remove();
                    _this.context.loadMainView();    <====== *****
                  }

To make this work, we'll need to define this *loadMainView()* function in the *app.js* Module and add it to the
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
the *components*, *body*, *root* and *context* objects needed by the *loadGroup()* API.


## Initial Test of the Approach

Let's test that this is going to work before going to the next step.  To do that, make a temporary
edit to the *loadMainView()* function:

              context.loadMainView = function() {
                console.log('UI will now be updated...');
                //webComponents.loadGroup(components.sidebar_menu, root.sidebarTarget, context);
              }

In other words, we'll temporarily comment out the *loadGroup()* API since we haven't yet defined
the *sidebar_menu* Assembly, but we'll just confirm that the *Login* button's *hook* method 
correctly invokes it.

## Try it Out

To summarise, [see here](https://github.com/robtweed/qewd-microservices-examples/tree/master/src/windows-iris-crud/stage_11) 
to confirm what your application's folder layout and files should look like at this stage of this tutorial.

Click the browser's *refresh* button and, after logging in with the correct *username* and *password*,
you should see the modal panel disappear, and in the browser's JavaScript console you should see
our *console.log* message appear: *UI will now be updated...*.

----

# Stage 12: Updating the Sidebar after Login


## Remove the Test Comment

So now we know this approach will work, remove the *console.log* command and the comment from the *loadGroup()* 
API, ie the *loadMainView()* function should now look like this:

              context.loadMainView = function() {
                webComponents.loadGroup(components.sidebar_menu, root.sidebarTarget, context);
              }

We're now ready to define the *sidebar* menu.


## Create the New *sidebar* Menu Contents

Initially, during login, we just displayed a title at the top of the
*sidebar*.  We're now going to append a further Assembly to the *sidebar*, containing the menu for a logged-in
user.  Let's call this additional Assembly Module *sidebar-menu.js*.

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


## Load the Sidebar Menu Assembly:

Now make the following changes to your *app.js* file:

Near the top, import the Sidebar Menu Assembly Module:

        import {sidebar_menu_assembly} from './sidebar-menu.js';

Then load/register it:

            webComponents.addComponent('sidebar_menu', sidebar_menu_assembly());

It will now be available when the *loadMainView()* function loads it into the UI.


## Try it Out

To summarise, [see here](https://github.com/robtweed/qewd-microservices-examples/tree/master/src/windows-iris-crud/stage_12) 
to confirm what your application's folder layout and files should look like at this stage of this tutorial.

Try out this latest set of changes by clicking your browser's *refresh* button.

This time, after successfully logging in, not only should you see the modal panel disappear, but the new 
*Person Editor* menu item should now appear in the *sidebar*.

Clicking on the menu option won't do anything, but you'll also see that it doesn't generate any errors, even though
we've not yet defined the *person* Content Page.


----

# Stage 13: Update the *topbar* with a Greeting after Login

## Background

A nice feature to add to an application is a greeting message when a user successfully logs in.

A good place to display such a message in the Admin UI is the *topbar*.

So let's build out and add this functionality, once again doing so in small incremental steps.


## Create a *topbar* Assembly

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


## Load the Assembly into your *app.js* Loader Module

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

## Try it Out

To summarise, [see here](https://github.com/robtweed/qewd-microservices-examples/tree/master/src/windows-iris-crud/stage_13) 
to confirm what your application's folder layout and files should look like at this stage of this tutorial.

Try out this version in your browser: you should now see the welcome text in the *topbar*.

----

# Stage 14: Personalise the Greeting

## Background

Of course, what we've displayed is static text.  If, instead, you wanted to display a personalised greeting,
eg: *Welcome to the Person Editor, Rob*, how could that be done?

Well, of course, for this to be possible, the back-end user authentication system would need to have
available to it some kind of greeting name property associated with each username, and this would have
to be retrieved in order to display it in the *topbar* text.

Let's hard-code a version to show the principles of how such a feather could be implemented.


## Modify the QEWD Back-end *Login* Handler Module

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


## Modify your *topbar* Assembly

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

        
Let me explain the changes:

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


## Amend How the *topbar* is loaded in your *app.js* Module


You'll also need to amend the *app.js* file and pass the *QEWD* object to the *topbar* Assembly
when registering it.  So edit this line:

        webComponents.addComponent('topbar', topbar_assembly());

and change it to:

        webComponents.addComponent('topbar', topbar_assembly(QEWD));



So that's the front-end functionality in place.  


## Create the QEWD Back-end *getGreeting* Handler


Now let's write the QEWD back-end message handler method for that *getGreeting* message that
the *topbar* Assembly's *hook* method sends.

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


## Try it Out

To summarise, [see here](https://github.com/robtweed/qewd-microservices-examples/tree/master/src/windows-iris-crud/stage_14) 
to confirm what your application's folder layout and files should look like at this stage of this tutorial.


### IMPORTANT: Stop all QEWD Worker Processes

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

### Try out the *demo* Application

Having stopped all the QEWD Worker processes, you can now try out the most recent changes.

Click the browser's *refresh* button.  Login and you should now see the message appear in the *topbar*:

        Welcome to the Person Editor, Rob

If you look in the browser's JavaScript console, you should see the response received from QEWD that
was used for that message text, eg:

        received: {"type":"getGreeting","finished":true,"message":{"greetingName":"Rob"},"responseTime":"10ms"}

----

# Stage 15: Making the Admin UI Truly Responsive


## Background

There's two more small additions we can now make to the *sidebar* and the *topbar* to make the UI really 
responsive and behave nicely even within the small area available in a mobile device.

We do this by adding special *toggler* WebComponents.


## Modify the *sidebar_menu* Assembly

First, change your *sidebar_menu.js* Assembly Module as follows:

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

You'll see that we've added, to the bottom of the *sidebar_menu* Assembly a divider and also
a WebComponent named *adminui-sidebar-toggler*.


## Modify the *topbar* Assembly

Next, change the *topbar.js* Assembly Module to this:

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


You'll see that we've added a special WebComponent named *adminui-topbar-toggler*.


## Try it Out

To summarise, [see here](https://github.com/robtweed/qewd-microservices-examples/tree/master/src/windows-iris-crud/stage_15) 
to confirm what your application's folder layout and files should look like at this stage of this tutorial.

Try it out by clicking the browser's *refresh* button.  You should now see an arrow widget at the bottom of the
*sidebar* menu which, if clicked, will collapse the sidebar.

If you then try running the application in a mobile device's browser, you'll see another toggler device appears
that collapses the menu into a "hamburger" menu widget.


It's always a good idea to add both these WebComponents to any of your applications' *sidebar* and *topbar* Assemblies.


----

# Stage 16: Add a Logout Menu Option

## Background

Let's now add another option to the *sidebar* menu, allowing the user to log out and terminate their
QEWD Session.  

The way this will work is that, when the *logout* menu option is clicked, a modal panel will appear, asking
the user to confirm that they really do want to logout (eg in case the option was clicked by accident).

The modal confirmation panel will allow the user to:

- *cancel*: in which case the modal will disappear and the user can carry on as before

- *accept*: in which case the user is logged out and returned to the login sequence


## Modify the *sidebar_menu* Assembly

First, edit the *sidebar_menu.js* Assembly Module as follows:

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


## Create the Modal Logout Assembly

The next step is to create the modal logout Assembly Module.  In your application's *js* 
folder, create a file named *logout_modal.js*.  Paste the following content into it:

        export function logout_modal_assembly(QEWD) {

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


## Understanding the Modal Logout Assembly

OK, so there's quite a bit going on in this Assembly. Let's go through it
 and see what it's going to do and why.

It's another instance of an *adminui* modal panel with a header, body and footer, just as we saw in
the *login-modal* Assembly.

There's a few differences though:

- we've given the *adminui-modal-root* Component a name of *logout-modal*, ie:

          let component = {
            componentName: 'adminui-modal-root',
            state: {
              name: 'logout-modal'   <======= *******
            },

  This matches the name we specified earlier in the *sidebar* nav menu item, ie:

            {
              componentName: 'adminui-sidebar-nav-item',
              state: {
                title: 'Logout',
                icon: 'power-off',
                use_modal: 'logout-modal'  <====== *******
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
                    componentName: 'adminui-modal-close-button',  <====== ******
                  }
                ]
              },


- the body is simply some fixed text:

              {
                componentName: 'adminui-modal-body',
                state: {
                  text: 'Are you sure you want to logout?'   <===== *****
                }
              },

- it's actually the footer that does all the work, containing the
*Cancel* and *Logout* (ie confirm) buttons:

              {
                componentName: 'adminui-modal-footer',
                children: [
                  {
                    componentName: 'adminui-modal-cancel-button',  <====== *****
                  },
                  {
                    componentName: 'adminui-button',               <===== *****
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


## Integrate the *logout-modal* Assembly into your *app.js* Loader Module

We now need to connect this *logout-modal* Assembly Module into the *app.js* file:

Near the top of your *app.js* file, import the Sidebar Menu Assembly Module:

        import {logout_modal_assembly} from './logout-modal.js';

Then load/register it:

            webComponents.addComponent('logout_modal', logout_modal_assembly(QEWD));

Note that we need to pass the *qewd-client* object (*QEWD*) to it as an argument as
the Assembly needs access to its APIs.

and finally, load it within the *loadMainView()* function.  Notice that its target is the
DOM's *body* tag:


              context.loadMainView = function() {
                webComponents.loadGroup(components.sidebar_menu, root.sidebarTarget, context);
                webComponents.loadGroup(components.topbar, root.topbarTarget, context);
                webComponents.loadGroup(components.logout_modal, body, context);
              }



## Create the QEWD Back-end *logout* Handler

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


## Try it Out

To summarise, [see here](https://github.com/robtweed/qewd-microservices-examples/tree/master/src/windows-iris-crud/stage_16) 
to confirm what your application's folder layout and files should look like at this stage of this tutorial.

We should now be ready to try out the logout functionality in the browser: this time when you log in,
the *sidebar* menu should include a *Logout* option which, when clicked, should bring up a modal dialogue
panel that asks you to confirm that you really do want to log out.  

Try clicking the Cancel button (or the modal panel's close button, or simply click anywhere outside the panel).

Then try again, and this time click the Logout button to confirm that's what you really want to do.  You should see
a *toastr* warning that you've successfully logged out, and then 3 seconds later, the page will reload and
you'll be asked to login again.

----

# Stage 17: The CRUD Assembly

## Background

We've now reached the point where everything in the application is working, **apart** from the very bit we really want
it to do and set out to describe!

It's taken a while to get here, but by now you've learned most of the core surrounding functionality that 
you'll need to implement in pretty much any *adminui* / QEWD Application, so it's been time well spent.  


The good news is that the entire CRUD cycle for a record can be handled by a single 
pre-built *adminui* WebComponent Assembly, aptly named *adminui-crud*.  

So let's see how it can be used.  Once again we'll do this in incremental stages.

The *adminui-crud* Assembly Module is a bit different from the standard ones, in that it encapsulates
a complete set of pre-determined functionality - the CRUD (Create, Read, Update, Delete) 
cycle for a record - but in a way that you can customise.


## Add the CRUD Assembly to your *app.js* File

We can begin by loading it as if it was a standard Assembly Module.  In the *app.js* file, import it
as follows:

        import {crud_assembly} from '../../components/adminui/components/adminui-crud.js';

This will fetch it directly from the *adminui* WebComponent library.

Then register it as *person_page*.  It needs access to the *qewd-client* APIs, so pass the *QEWD* object as an argument:

        webComponents.addComponent('person_page', crud_assembly(QEWD));

Whilst these two steps above should be familiar by now, the next step is a new one:

If you remember in the *sidebar-menu* Assembly, the *nav* menu option for selecting the *Person
Editor* page looked like this:

            {
              componentName: 'adminui-sidebar-nav-item',
              state: {
                title: 'Person Editor',
                icon: 'user',
                contentPage: 'person',      <===== *****
                active: true
              }
            },

The *contentPage* state property tells *mg-webComponents* to load a page named 
*person* into the Admin UI's *content area*.  

To make this work, in our *app.js* Loader module we use a special API that we apply to the Assembly 
we just registered as *person_page*:

        webComponents.register('person', webComponents.components.person_page);

The *register()* API makes the Assembly available for loading into the *adminui's content area*.  
It actually adds some additional
Bootstrap markup to the Assembly so that it can be lazily-loaded into the *content area*, and also so that
it can be shown and hidden when selected and deselected respectively via sidebar menu options.


## Try it Out

To summarise, [see here](https://github.com/robtweed/qewd-microservices-examples/tree/master/src/windows-iris-crud/stage_17) 
to confirm what your application's folder layout and files should look like at this stage of this tutorial.

Try this change out by clicking the browser's *refresh* button.  This time, after you log in, if you
click the *Person Editor* option in the *sidebar* menu, you'll see the *adminui-crud* page appear in the UI's
*content area*.

You'll also see a red *toastr* error appear in the top right corner - ignore that for now.

## Load the CRUD Assembly into the Content Area by Default

Let's make one further UI behaviour change before we start working on the CRUD page itself.  In this example, we
really only have this one page to display, so rather than (or as well as) selecting it from the *sidebar* menu, we
could save a mouse-click for the user and display it in the *content area* by default 
as soon as the user has logged in.


## Modify the *app.js* Loader Module

We can do that my changing the *loadMainView()* function in the *app.js* module to this:

        context.loadMainView = function() {
          webComponents.loadGroup(components.sidebar_menu, root.sidebarTarget, context);
          webComponents.loadGroup(components.topbar, root.topbarTarget, context);
          webComponents.loadGroup(components.logout_modal, body, context);
          webComponents.loadGroup(components.person_page, root.contentTarget, context);   <======******
        }

Try this change by clicking the browser's *refresh* button again.  This time, after logging in, the CRUD
page will appear automatically in the *content area*.


----

# Stage 18: Customising the CRUD Page

## Background

What you're seeing in the UI's *content area* is the default appearance of the CRUD Assembly.  

As you can see there are various parts to what it initially displays:

- a main heading: *Record Maintenance Page*

- a card with a heading: *Summary of Records*

- a green button with a + in it which, when clicked, makes a second card appear

  - the second card has a title of New Record
  - whilst there are no form fields in this second card, it does have a *Save* button
  - if you click the *Save* button, a red *toastr* *Handler Not Defined* message appears


We have control over all these aspects of the display and its behaviour.


## Customising the Main Heading

Let's start by changing the main heading.

All the customisation is defined in a single object that we're going to call *personAssemblyState*.
Although we could define this object within the *app.js* file, you'll find that it can eventually get quite big,
and to keep the *app.js* file clean and tidy, I'm going to use a separate module for
the *personAssemblyState* object, and import that module into *app.js*.

## Create the *personAssemblyState* Module

So, in your *js* folder, create a new text file named *personAssemblyState.js* and paste the following
content into it:

        let personAssemblyState = {
          name: 'person',
          title: 'Person Class/Document Editor'
        };

        export {personAssemblyState};


We're just going to specify two properties for now:

- a logical name for our instance of the *adminui-crud* Assembly: *person*
- our own main title.


## Load the *personAssemblyState* Module into your *app.js* Loader Module

Next, we need to import this module into the *app.js* module, so, edit *app.js* and add this line near the top
 (ie after the other *import* commands):

        import {personAssemblyState} from './personAssemblyState.js';


Next, find the line where the *adminui-crud* Assembly was registered, ie:

        webComponents.addComponent('person_page', crud_assembly(QEWD));


and add the *personAssemblyState* object as the second argument, ie:

        webComponents.addComponent('person_page', crud_assembly(QEWD, personAssemblyState));


## Try it Out

To summarise, [see here](https://github.com/robtweed/qewd-microservices-examples/tree/master/src/windows-iris-crud/stage_18) 
to confirm what your application's folder layout and files should look like at this stage of this tutorial.

Test these changes by clicking the browser's *refresh* button.  After logging in, you should now see our
CRUD Assembly's customised title: *Person Class/Document Editor*.


----

# Stage 19: Customising the Summary Card

Let's now do some customisation of the Summary Card.


## Edit the *personAssemblyState* Module

Edit the *personAssemblyState.js* file to now contain the following:

        let personAssemblyState = {
          name: 'person',
          title: 'Person Class/Document Editor',
          summary: {
            title: 'Current Person Records',
            titleColour: 'primary',
            btnIcon: 'user-plus',
            btnColour: 'success',
            btnTooltip: 'Add a New Person',
          }
        };

        export {personAssemblyState};


As you can see, all the customisation of the Summary Card is done via a sub-object named *summary*.

After making these changes, click the browser's *refresh* button, login and you'll see how the 
Summary Card has changed.


## Fetching Existing Summary Records

Let's sort out that error you'll be seeing every time the Person Editor page appears.  If you read the error text,
you'll see that it's coming from the QEWD back-end, telling us that it can't find a handler method for a message
of type *getSummary*.  If you also look in the browser's JavaScript console. you'll see that it has automatically
sent a *getSummary* message to QEWD:

        sent: {"type":"getSummary","params":{"properties":["name"]}}

By default, the CRUD Assembly will use the message type *getSummary* - what it's trying to do is to get the QEWD
back-end to send it a summary list of records to populate a table.  Now, not only do we not have a handler for
messages of type *getSummary*, we might want to use a different type: perhaps one that is more intuitive for our
specific use-case.  So, let's further customise the CRUD Assembly and get it to send a message of type 
*personsSummary* instead.

Edit the *personAssemblyState.js* file to contain the following:

        let personAssemblyState = {
          name: 'person',
          title: 'Person Class/Document Editor',
          summary: {
            title: 'Current Person Records',
            titleColour: 'primary',
            btnIcon: 'user-plus',
            btnColour: 'success',
            btnTooltip: 'Add a New Person',
            qewd: {
              getSummary: 'personsSummary',
            }
          }
        };

        export {personAssemblyState};


You can see that the message types sent to QEWD are defined in a sub-object named *qewd*.  We're changing 
the type of the one that is used to retrieve a summary of existing (if any) records.


## Create the QEWD Back-end *personsSummary* Handler


Next, we need to actually create the back-end handler for messages of type *personsSummary*.

But before we can create a back-end message handler, the time has come to decide what our 
*Person* records will look like within the Cach&eacute; or IRIS database.


### The Person Record Database Structure

In this tutorial I'm going to show you two alternative versions of essentially the same record structure:

- one using the QEWD-JSdb persistent JSON abstraction;
- one using Cach&eacute; / IRIS Objects

The Person record structure I'll use for the purposes of this example is deliberately very simple:


        +--------+----+------+--------+------+
        | Person | id | name | gender | city |
        |        | == |      |        |      |
        +--------+----+------+--------+------+

Each record will have a unique integer primary key (*id*), and three properties:

- name
- gender
- city


For the QEWD-JSdb implementation, I'll therefore be using the following persistent JSON structure:

        {
          "by_id": {
            {{id}}: {
              "name": {{name}},
              "gender": {{gender}},
              "city": {{city}}
            }
          }
        }


For the Cach&eacute;/IRIS Objects option, you'll need to save and compile this Class definition:

        Class User.Person Extends %Persistent
        {
          Property Name As %String;
          Property Gender As %String;
          Property City As %String;
        }

By the way, this is the same Person data structure that was used in the 
[REST MicroServices Tutorial](https://github.com/robtweed/qewd-microservices-examples/blob/master/WINDOWS-IRIS-1.md)


### Create the *personsSummary* Handler Logic


Now, of course, right now we don't have any Person records in either format, so a *personsSummary*
request will simply return an empty array.  Nevertheless, we'll fully implement how it needs
to operate now, and then as and when new Person records are added later, they'll get
retrieved.


Create the folder path for its *index.js* module file:

        C:\qewd
            |
            |- qewd-apps
                    |
                    |- demo
                         |
                         |- personsSummary
                               |
                               |- index.js


and paste the following contents into the *index.js* file.  Choose the version you want to 
use, depending on whether you want to use the QEWD-JSdb abstraction or Cach&eacute;/IRIS 
Objects:

#### QEWD-JSdb Version

        module.exports = function(messageObj, session, send, finished) {
          if (!session.authenticated) {
            return finished({error: 'Not authenticated'});
          }

          if (!messageObj.params) {
            return finished({error: 'No params present in request'});
          }
           if (!messageObj.params.properties) {
            return finished({error: 'No properties defined in request'});
          }

          let person = this.db.use('Person', 'by_id');
          let results = [];
          let properties = messageObj.params.properties;

          person.forEachChild(function(id, record) {
            let result = {};
            result.id = id;
            properties.forEach(function(property) {
              if (property !== 'id') {
                result[property] = record.$(property).value;
              }
            });
            results.push(result);
          });

          finished({summary: results});

        };


This first ensures that the incoming request was from an authenticated (ie logged-on) user.  It
then checks that the incoming request included a *params* object and, within that, a *properties*
object.  We'll see later why those are important.

It then instantiates a QEWD-JSdb DocumentNode Object pointing to a persistent JSON object named
*Person* and a property of *by_id*:

          let person = this.db.use('Person', 'by_id');

We'll return later to examine the rest of its logic, but for now we can summarise by saying it
will look for all child records and add their Id and a set of selected properties to a *results*
array:

          let results = [];

          person.forEachChild(function(id, record) {
            ...etc

            results.push(result);
          });

That *results* array is then sent back to the browser via the *finished()* method.


#### Cach&eacute;/IRIS Version

        module.exports = function(messageObj, session, send, finished) {
          if (!session.authenticated) {
            return finished({error: 'Not authenticated'});
          }

          if (!messageObj.params) {
            return finished({error: 'No params present in request'});
          }
           if (!messageObj.params.properties) {
            return finished({error: 'No properties defined in request'});
          }
          
          let results = [];
          let properties = messageObj.params.properties;
          let names = {};
          properties.forEach(function(property) {
            if (property !== 'id') {
              let name = property.charAt(0).toUpperCase() + property.slice(1)
              names[name] = property;
            }
          });
          
          let db = this.db.dbx;
          let query = db.sql({sql: "select * from SQLUser.Person", type: "Cache"});
          let result = query.execute();
          let res;
          let property;
          
           while ((result = query.next()) !== null) {
              res = {};
              res.id = result.ID;
              for (property in names) {
                res[names[property]] = result[property];
              }
              results.push(res);
           }
           query.cleanup();

          finished({summary: results});

        };



This first ensures that the incoming request was from an authenticated (ie logged-on) user.  It
then checks that the incoming request included a *params* object and, within that, a *properties*
object.  We'll see later why those are important.

It then invokes a Cach&eacute;/IRIS SQL query via the *mg-dbx sql* API to retrieve all Person records that exist:

          let db = this.db.dbx;
          let query = db.sql({sql: "select * from SQLUser.Person", type: "Cache"});
          let result = query.execute();

We'll return later to examine the rest of its logic, but for now we can summarise by saying it
goes through the *resultSet* created by this query and adds each *resultSet* record's Id along with
 a set of selected properties to a *results* array:

That *results* array is then sent back to the browser via the *finished()* method.


Save the version of the *index.js* file you want to use.


## Try it Out

You'll first need to use the *qewd-monitor-adminui* application to stop the Worker processes,
to ensure that this new back-end handler method is available to you when needed.

To summarise, [see here](https://github.com/robtweed/qewd-microservices-examples/tree/master/src/windows-iris-crud/stage_19) 
to confirm what your application's folder layout and files should look like at this stage of this tutorial.
Note that in this repository, the Cach&eacute;/IRIS version of the *personsSummary* handler has been named 
*index.js.class*.  If you want to use it, make sure you rename it to *index.js*

Try it out by clicking the browser's *refresh* button and logging in.  Hopefully, this time you'll
not get that red *toastr* error, but now you'll see that the Summary Card contains a table that tells
you it's empty:

        No data available in table

That's not surprising, since we haven't yet created any Person records!

----

# Stage 20: Creating a Person Record

The *adminui-crud* Assembly provides you with a button (in the top right of the Summary Card header)
that allows you to create a new record.

Currently if you click it, as we saw earlier, a second Card - the New Record card - will appear,
but all it will currently contain is a Save button.

So in this stage, we'll provide the customisation information that will allow us to add a form into which we
can enter the properties of a new record.  In our example, according to the data model for the
*Person* record that was described in the previous stage, this will mean we need a 
form that allows us to enter:

- the person's name
- the person's gender
- the person's city of residence

You'll also see that if you currently click that Save button, it will send, by default, 
a *saveRecord* request to the QEWD back-emd.  A red *toastr* error will then appear, because 
we haven't yet created the corresponding QEWD message handler.  

So, in addition to the form, we'll need to create a QEWD back-end message
handler for validating the form details and, if OK, creating a new Person record.

Let's work through these steps now.


## Customising the New Person Card

The first thing we'll customise in the New Person Card is the title and card width.  We can do that by
editing the *personAssemblyState.js* file and add this to the object:

          detail: {
            cardWidth: '500px',
            newRecordTitle: 'Enter New Person',
            titleColour: 'primary'
          }


The New Person Card properties are customised by an object named *detail*.

To clarify, the *personAssemblyState.js* file should now look like this:

        let personAssemblyState = {
          name: 'person',
          title: 'Person Class/Document Editor',
          summary: {
            title: 'Current Person Records',
            titleColour: 'primary',
            btnIcon: 'user-plus',
            btnColour: 'success',
            btnTooltip: 'Add a New Person',
            qewd: {
              getSummary: 'personsSummary',
            }
          },
          detail: {
            cardWidth: '500px',
            newRecordTitle: 'Enter New Person',
            titleColour: 'primary'
          }
        };

        export {personAssemblyState};


Feel free to see the effect of this change by clicking the browser's *refresh* button.


## Defining the Form Fields in the New Person Card

The form fields we need are also defined within this *detail* object, via an array named *fields*. 
Edit it again so that the *detail* object looks like this:

          detail: {
            cardWidth: '500px',
            newRecordTitle: 'Enter New Person',
            titleColour: 'primary',
            fields: [
              {
                name: 'name',
                data_property: 'name',
                label: 'Name',
                type: 'text',
                labelWidth: 4
              },
              {
                name: 'gender',
                data_property: 'gender',
                label: 'Gender',
                type: 'select',
                labelWidth: 4,
                options: [
                  {text: 'Select...', value: 'invalid'},
                  {text: 'Male', value: 'm'},
                  {text: 'Female', value: 'f'},
                  {text: 'Not Specified', value: 'x'}
                ]
              },
              {
                name: 'city',
                data_property: 'city',
                label: 'City',
                type: 'text',
                labelWidth: 4
              }
            ]
          },


As you can see, we're adding the three fields for *name*, *gender* and *city*.  Each form field is
defined by specifying:

- *name*: the logical name for this form field
- *data_property*: the property name for this field within the saved record.  This is actually optional.  if
omitted, the *name* property value is used for the *data_property* also.  So in our example we could leave this
property out of the *fields* array elements
- *label*: The label to display before the input field
- *type*: the HTML form field type
- *labelWidth*: controls the proportion of space occupied by the label versus the corresponding input field.  A
starting point of 4 is recommended, and then try adjusting it above or below that until you're happy with the
layout
- *options*: (select type only) defines the select drop-down options.  For each you should specify the text
and corresponding value.  The value is what is sent to the QEWD back-end whilst the text is what appears in the UI.

Save your changes and click the browser's *refresh* button.  After logging in, click the Add New Person button.
The New Person card should now contain the three form fields we need!


## Customising the Save Button

The *adminui-crud* Assembly also allows you to customise the New Person Card's Save button if you want.

It's controlled by another new sub-object within the *personAssemblyState* object: *update*.

Try adding this to it:

          update: {
            btnText: 'Save Person',
            btnColour: 'success'
          }


ie your *personAssemblyState.js* file should now look like this:

        let personAssemblyState = {
          name: 'person',
          title: 'Person Class/Document Editor',
          summary: {
            title: 'Current Person Records',
            titleColour: 'primary',
            btnIcon: 'user-plus',
            btnColour: 'success',
            btnTooltip: 'Add a New Person',
            qewd: {
              getSummary: 'personsSummary',
            }
          },
          detail: {
            cardWidth: '500px',
            newRecordTitle: 'Enter New Person',
            titleColour: 'primary',
            fields: [
              {
                name: 'name',
                data_property: 'name',
                label: 'Name',
                type: 'text',
                labelWidth: 4
              },
              {
                name: 'gender',
                data_property: 'gender',
                label: 'Gender',
                type: 'select',
                labelWidth: 4,
                options: [
                  {text: 'Select...', value: 'invalid'},
                  {text: 'Male', value: 'm'},
                  {text: 'Female', value: 'f'},
                  {text: 'Not Specified', value: 'x'}
                ]
              },
              {
                name: 'city',
                data_property: 'city',
                label: 'City',
                type: 'text',
                labelWidth: 4
              }
            ]
          },
          update: {
            btnText: 'Save Person',
            btnColour: 'success',
          }
        };

        export {personAssemblyState};


Try reloading the page in the browser again and you'll see this customised *Save* button.

By default, clicking the *Save* button will send a request to QEWD with a type of *saveRecord*.
We can also customise that.  Let's change the type that will be sent to *updatePerson*.  It's
also done via the *update* sub-object:

          update: {
            btnText: 'Save Person',
            btnColour: 'success',
            qewd: {
              save: 'updatePerson'
            }
          }

Once again, try reloading the page in the browser again and you'll see this customised *Save* button.


## Test the Form

Now try entering some values into the form fields.  For example:

- name: Rob
- gender: male
- city: Redhill

When you click the Save button, if you examine the browser's JavaScript console, you'll see that it
sent the following request:

        sent: {"type":"updatePerson","params":{"id":"new-record","name":"Rob","gender":"m","city":"Redhill"}}

However, you'll still be seeing a red *toastr* error because there isn't yet any *updatePerson* message
handler defined.


## Create the *updatePerson* QEWD Back-end Handler

This should be becoming familiar now.  Create the folder path for the *updatePerson*'s *index.js* module file:

        C:\qewd
            |
            |- qewd-apps
                    |
                    |- demo
                         |
                         |- updatePerson
                               |
                               |- index.js


and paste the following contents into the *index.js* file (depending on which version you want to use):

### QEWD-JSdb Version

        module.exports = function(messageObj, session, send, finished) {
          if (!session.authenticated) {
            return finished({error: 'Not authenticated'});
          }

          if (!messageObj.params) {
            return finished({error: 'No params present in request'});
          }

          let name = messageObj.params.name;
          if (!name || name === '') {
            return finished({error: 'Missing name value'});
          }

          let gender = messageObj.params.gender;
          if (!gender || gender === '' || gender === 'invalid') {
            return finished({error: 'Missing gender value'});
          }

          let city = messageObj.params.city;
          if (!city || city === '') {
            return finished({error: 'Missing city value'});
          }

          let persons = this.db.use('Person');

          /*
            Create a new Person Id by incrementing the id_counter value
          */


          let id = persons.$('id_counter').increment();

          /*
            Save the data for this new Person record
          */

          persons.$(['by_id', id]).setDocument({
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



This first ensures that the incoming request was from an authenticated (ie logged-on) user.  It
then checks that the incoming request included a *params* object and, within that, non-empty values
for *name*, *gender* and *city*.

It then instantiates a QEWD-JSdb DocumentNode Object pointing to a persistent JSON object named
*Person*:

          let persons = this.db.use('Person');

and obtains a new *id* value for the incoming new person record.

          let id = persons.$('id_counter').increment();

It then saves the data into the *person* object using the allocated *id*:

          persons.$(['by_id', id]).setDocument({
            name: name,
            gender: gender,
            city: city
          }); 

The *id* for this new *person* record is then sent back to the browser via the *finished()* method, along with
an *ok* flag for good measure:

          finished({
            ok: true,
            id: id
          });



### Cach&eacute;/IRIS Version

        let mclass = require('mg-dbx').mclass;
        module.exports = function(messageObj, session, send, finished) {

          if (!session.authenticated) {
            return finished({error: 'Not authenticated'});
          }

          if (!messageObj.params) {
            return finished({error: 'No params present in request'});
          }

          let name = messageObj.params.name;
          if (!name || name === '') {
            return finished({error: 'Missing name value'});
          }

          let gender = messageObj.params.gender;
          if (!gender || gender === '' || gender === 'invalid') {
            return finished({error: 'Missing gender value'});
          }

          let city = messageObj.params.city;
          if (!city || city === '') {
            return finished({error: 'Missing city value'});
          }     

          let db = this.db.dbx;
          
          /*
            Instantiate a new Person instance
          */

          let person = new mclass(db, 'User.Person', '%New');

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
         
            finished({
              ok: true,
              id: id
            });
        };



This first ensures that the incoming request was from an authenticated (ie logged-on) user.  It
then checks that the incoming request included a *params* object and, within that, non-empty values
for *name*, *gender* and *city*.

It then instantiates a new Person object:

          let person = new mclass(db, 'User.Person', '%New');

and updates its properties using the values in the incoming *params* object

The new Person object Id is finally returned in the response.


## Try it out

You'll first need to use the *qewd-monitor-adminui* application to stop the Worker processes,
to ensure that this new back-end handler method is available to you when needed.

To summarise, [see here](https://github.com/robtweed/qewd-microservices-examples/tree/master/src/windows-iris-crud/stage_20) 
to confirm what your application's folder layout and files should look like at this stage of this tutorial.
Note that the Cach&eacute;/IRIS version of the *updatePerson* handler has been named *index.js.class*.  If you
want to use it, make sure you rename it to *index.js*

Try it out by clicking the browser's *refresh* button and logging in.  This time you'll
see that the Summary Card contains a table that tells you it's empty.  Clicking the green *+* button
in the card's header will bring up a new card into which you can add the name, gender and city of a new
Person record.  Clicking the Save buttton should then display the newly added record in the table.  You
should be able to keep adding records by repeating these steps, and the table will display all the records
you've added.

So you can see that we've now successfully implemented the Create and Read steps of the CRUD cycle.  

----

# Stage 21: Customise the Summary Table Display

## Background

By default, the CRUD Assembly's summary table assumes that the data records being displayed have a
property named *name*, and that that is the only property to display in the table.

If you've tried adding a number of records via the CRUD assembly, you'll have seen, however, that
if you re-use the same name, there is no way to distinguish which is which in the summary table.

So, the CRUD assembly allows you to customise the properties you want to display in each summary table row.

Let's therefore modify the CRUD Assembly so that it displays both the *name* and the *city* properties.


## Edit the *personAssemblyState.js* Module

In the *summary* section of your *personAssemblyState.js* file, add the following lines:

          summary: {
            ...etc

            headers: ['Name', 'City'],           <====== ****
            data_properties: ['name', 'city'],   <====== ****


*data_properties* specifies the property names in the data records that will be displayed
in the CRUD Assembly's summary table.

You **must** also define the *headers*: these define the column titles in the summary table
display.  The number of elements must be the same in the *headers* and *data_properties* arrays.


## Try it out

To summarise, [see here](https://github.com/robtweed/qewd-microservices-examples/tree/master/src/windows-iris-crud/stage_21) 
to confirm what your application's folder layout and files should look like at this stage of this tutorial.

Try it out by clicking the browser's *refresh* button and logging in.  This time the summary table should
display the name and city for each existing *Person* record.

Try adding another new Person record: you should also see its name and city appear in the table when you
click the form's Save button.


----

# Stage 22: Implementing the Update Step of the CRUD Cycle

## Background

You're going to discover that most of what we've already done for the Create step is actually re-used by
the CRUD assembly for the Update step.

There's one key step we'll need to implement, however, before it will work.  You can see what it is
if, whilst displaying the records in the CRUD Assembly's Summary Table, you click the *Select* button
in one of the table rows.

You should see a red *toastr* error appear in the top right corner, telling you:

        Handler not defined for demo messages of type getRecordDetail

If you look in your browser's JavaScript console, you should see that it sent a message with a
type of *getRecordDetail* to the QEWD back-end, identifying the *id* of the record whose *Select*
button you clicked, eg:

        sent: {"type":"getRecordDetail","params":{"id":"4"}}

and you'll see that the error message came from the QEWD back-end, because, of course, we've not
defined the handler for such a message.

So, by default, the CRUD Summary Table *Select* button in each row will send a message to the
QEWD back-end with a type of *getRecordDetail*.  We could decide to just use that default message
type and create a QEWD back-end handler module for that *getRecordDetail* type.  However, we may
want to use our own named type with a more relevant name.  For example, we might want, in our 
example, the type to be *getPersonDetail*.


## Modifying the *personAssemblyState.js* Module

We can customise the CRUD Assembly to use such a method by editing the *personAssemblyState.js*
file.  Specifically, in the summary section, change this:

        summary: {
          ...etc

          qewd: {
            getSummary: 'personsSummary'
          }

to this:

        summary: {
          ...etc

          qewd: {
            getSummary: 'personsSummary',
            getDetail: 'getPersonDetail'
          }


So the *summary.qewd.getDetail* property defines the message type to use when you click the
Select button to fetch the selected record's details.

After you make this change, try refreshing the page in the browser, login and click the
*Select* button in one of the rows of the Summary Table.  You'll still see a *toastr*
error, but the error message will now say:

        Handler not defined for demo messages of type getPersonDetail

and, in the JavaScript console, you'll see that it now sends the message type we require, eg:

        sent: {"type":"getPersonDetail","params":{"id":"2"}}


We now need to create the corresponding QEWD back-end Handler for that message type.


## Create a *getPersonDetail* QEWD Back-end Handler Module


Create the folder path for its *index.js* module file:

        C:\qewd
            |
            |- qewd-apps
                    |
                    |- demo
                         |
                         |- getPersonDetail
                               |
                               |- index.js


The purpose of this handler will be to fetch *all* the properties of the selected
*Person* record, so that we can Update (ie edit) them.

Depending on whether you're using the QEWD-JSdb abstraction or Cach&eacute;/IRIS Objects, 
paste the corresponding code below into the *index.js* file:

### QEWD-JSdb Version

        module.exports = function(messageObj, session, send, finished) {
          if (!session.authenticated) {
            return finished({error: 'Not authenticated'});
          }

          if (!messageObj.params) {
            return finished({error: 'No params present in request'});
          }
          let id = messageObj.params.id;
           if (!id) {
            return finished({error: 'id not defined in request'});
          }

          let person = this.db.use('Person', 'by_id', id);
          if (!person.exists) {
            return finished({error: 'No record exists with that id'});
          }

          finished({record: person.getDocument(true)});
        };


This first ensures that the incoming request was from an authenticated (ie logged-on) user.  It
then checks that the incoming request included a *params* object and, within that, a non-empty value
for *id*.

It then instantiates a QEWD-JSdb DocumentNode Object pointing to a persistent JSON object named
*Person* with the incoming *id*:

          let person = this.db.use('Person', 'by_id', id);

and then checks to ensure such a record actually exists in the database.

Finally it maps the Person record to JSON and returns it as an object named *record*:

          finished({record: person.getDocument(true)});


### Cach&eacute;/IRIS Version

        module.exports = function(messageObj, session, send, finished) {
          if (!session.authenticated) {
            return finished({error: 'Not authenticated'});
          }

          if (!messageObj.params) {
            return finished({error: 'No params present in request'});
          }
          let id = messageObj.params.id;
           if (!id || id === '') {
            return finished({error: 'id not defined in request'});
          }

          let db = this.db.dbx;
          let person = db.classmethod('User.Person', '%OpenId', id);
          let results = {
            name: person.getproperty('Name'),
            gender: person.getproperty('Gender'),
            city: person.getproperty('City')
          };
          person.method('%Close'); 
          finished({record: results});
        };

This first ensures that the incoming request was from an authenticated (ie logged-on) user.  It
then checks that the incoming request included a *params* object and, within that, a non-empty value
for *id*.

It then opens the *Person* with the incoming *id*:

          let db = this.db.dbx;
          let person = db.classmethod('User.Person', '%OpenId', id);

and then fetches its *name*, *gender* and *city* properties, returning them 
in an object named *record*:

          finished({record: results});


## Try it out

You'll first need to use the *qewd-monitor-adminui* application to stop the Worker processes,
to ensure that this new back-end handler method is available to you when needed.

To summarise, [see here](https://github.com/robtweed/qewd-microservices-examples/tree/master/src/windows-iris-crud/stage_22) 
to confirm what your application's folder layout and files should look like at this stage of this tutorial.
Note that the *getPersonDetail* handlers in the *qewd-apps/demo* folder of this repository are named
*index.js.jsdb* and *index.js.class* for the QEWD-jsDB and Cach&eacute;/IRIS version
respectively.  Rename the version you want to use *index.js*.

Refresh the page in the browser, login and click the
*Select* button in one of the rows of the Summary Table. This time 
you should see the data values for the selected *Person* record appear in
a new Card.

You may be surprised to discover that the CRUD Assembly is re-using the same Card with the same
form fields that we defined for the New Record.  What it's doing however is:

- displaying a different title - currently *Edit Record*
- displaying a button (with a cog icon) in the right side of the Card title
- displaying the form fields in read-only format

If you click the cog button, you'll discover that the form fields are no longer read-only, so you
can change the values, and you'll also see the Save button appear.


Try clicking the *Select* button for some other rows in the Summary Table: you'll see their values
appearing in the *Edit Person* card (which will automatically return to read-only mode).

Then try clicking the New Person button at the top of the Summary Table Card: you'll see the
*Edit Person* Card switch to an "Enter New Person* Card.

All this UI behaviour and functionality is built-in to the CRUD Assembly.

----

# Stage 23: Customise the *Edit Person* Card

There are a few further customisations we can make to the *Edit Person* Card at this stage.  They are optional
but worth knowing about.

Edit the *personAssemblyState.js* file and add the following properties to the *detail*
object:

        detail: {
          ...etc

          btnIcon: 'user-cog',
          btnColour: 'success',
          btnTooltip: 'Edit User Details',
          title_data_property: 'name',


The first three of these properties will:

- change the icon used for the *Edit* button in the *Edit Person* Card's header
- change the colour of the *Edit* button
- add a tooltip so you should see *Edit User Details* pop up when you move your
mouse over the *Edit* button

The final one is an interesting one: rather than simply adding a static title to
the *Edit Person* Card, you can tell the CRUD Assembly to display a property as
the title instead.

## Try it Out

Save your changes to the *personAssemblyState.js* file, then click the browser's refresh
button and log in.  Select a *Person* record from the Summary Table and you should now see
the name of the selected person appearing as the title in the *Edit Person* Card's header.


## More Complex Edit Card Title Customisation

Simply displaying a single property from the selected Person record to act as the
title of the *Edit Person* Card may not be sufficient or adequate.  In this case,
you can define a function for the *title_data_property* property.  For example:

        title_data_property: function() {
          return 'Edit: ' + this.record.name;
        },

The *this* context for your function is actually that of the *Select* button's
WebComponent (ie that you clicked in the Summary Table).  However, the important
thing is that the Person data properties that were fetched from the QEWD back-end
are available to you as properties of *this.record*.  The string value your function
returns will be used as the title of the *Edit Person* Card, so you can
construct whatever string you like using whatever data properties you like.

## Try it Out

To summarise, [see here](https://github.com/robtweed/qewd-microservices-examples/tree/master/src/windows-iris-crud/stage_23) 
to confirm what your application's folder layout and files should look like at this stage of this tutorial.

Click the browser's *refresh*
button and log in.  Select a *Person* record from the Summary Table and you should now see
*Edit: * followed by the name of the selected person appearing as the title in the *Edit Person* Card's header.

----

# Stage 24: Saving an Edited Person Record

## Background

As we've previouusly noted, if you select a Person record and click the *Edit*
 button in the *Edit Peson* Card's header, the form fields become activated and
the *Save* button appears.

The text in the *Save* button will be showing as *Save Person*, because that is what we
customised it to be back in [Stage 20](#customising-the-save-button), specifically
via this section of the *personAssemblyState.js* module file:

          update: {
            btnText: 'Save Person',
            btnColour: 'success',
            qewd: {
              save: 'updatePerson'
            }
          }

You may have noticed when we originally defined this for saving a new record that the
section was named *update* rather than, say, *new*.  That's because, as we've already
noted, the same Card sub-Assembly
is used for both saving new Person records and updating/editing existing Person Records.

Similarly, the name we used for the QEWD Back-end Handler was *updatePerson*, because
the same messge type will be used by the CRUD Assembly for both saving new and 
updating existing Person records.


## Change the *Save* Button Text

So that means we should first probably make a cosmetic adjustment to the 
*personAssemblyState.js* module file, by amending the *update.btnText* property to:

          update: {
            btnText: 'Save/Update Person',

## The *updatePerson* QEWD Back-end Handler

We also need to review the *updatePerson* QEWD Back-end Handler logic.  Currently it
is written assuming it will only be handling a new Person record.  Here's the
relevant logic in both versions:

### QEWD-JSdb Version

        let persons = this.db.use('Person');
        let id = persons.$('id_counter').increment();  <==== ****

        persons.$(['by_id', id]).setDocument({
          name: name,
          gender: gender,
          city: city
        });


### Cach&eacute;/IRIS Version

        let db = this.db.dbx;
        let person = db.classmethod('User.Person', '%New'); <===== ***
      
        person.setproperty('Name', name);
        person.setproperty('Gender', gender);
        person.setproperty('City', city);
        person.method('%Save');


So in both versions, a new *Person* record with a new *id* is created.

We need to modify this so that this only happens when a new *Person* record
is being saved in the CRUD UI.  If an existing record is being updated in the
CRUD UI, we need, instead, to get the *Person* record for the *id* of the
*Person* who was selected in the CRUD UI.  

So how do we determine that?

It turns out that the CRUD UI provides us with that information.  Let's make a 
quick change to demonstrate what happens.


## Temporarily Modify the *personAssemblyState.js* Module

Edit the *personAssemblyState.js* Module file and change this section:

          update: {
            btnText: 'Save Person',
            btnColour: 'success',
            qewd: {
              save: 'updatePerson'
            }
          }

to this:

          update: {
            btnText: 'Save Person',
            btnColour: 'success',
            qewd: {
              save: 'updatePersonX' <===== ****
            }
          }

In other words, we're going to temporarily and deliberately change the QEWD Back-end Handler
name that the CRUD UI will use for the *Save* button to one that doesn't exist.

Click the browser's *refresh* button, login and first click the *New Person* button.  Enter
some values in the New Person form and click the *Save/Update Person* button.

You'll now see a red *toastr* error telling us, not surprisingly:

        Handler not defined for demo messages of type updatePersonX

Now take a look in tbe browser's JavaScript console and you should see the message that was
sent to the QEWD Back-end, eg:

        sent: {
          "type":"updatePersonX",
          "params":{
            "id":"new-record",         <======*****
            "name":"John",
            "gender":"m",
            "city":"London"
          }
        }

Notice the *id* that is being sent is a special reserved value: *new-record*.

Now select an existing *Person* record, click the *Edit* button to activate the
form fields and click the *Save/Update Person* button. 

You'll again get the red *toastr* error, but again check the browser's JavaScript console
and examine the message that was sent to QEWD, eg:

        sent: {
          "type":"updatePersonX",
          "params":{
            "id":"3",                <======*****
            "name":"Rob",
            "gender":"m",
            "city":"Redhill"
          }
        }

So you can see that when you are updating a record, the CRUD UI sends the *id* of the 
*Person* record you selected.

We now have the information we need to make the appropriate changes to the 
*updatePerson* QEWD Back-end Handler.

But before we do that, edit the *personAssemblyState.js* Module file 
back to its original state:

          update: {
            ...etc

            qewd: {
              save: 'updatePerson'  <===== *****
            }
          }


## Modify the *updatePerson* QEWD Back-end Handler Module

You'll need to edit the */qewd-apps/demo/updatePerson/index.js* file.

Here's my suggested changes to make both versions work for both new and
updated *Person* records:

### QEWD-JSdb Version

        module.exports = function(messageObj, session, send, finished) {
          if (!session.authenticated) {
            return finished({error: 'Not authenticated'});
          }

          if (!messageObj.params) {
            return finished({error: 'No params present in request'});
          }

          let name = messageObj.params.name;
          if (!name || name === '') {
            return finished({error: 'Missing name value'});
          }

          let gender = messageObj.params.gender;
          if (!gender || gender === '' || gender === 'invalid') {
            return finished({error: 'Missing gender value'});
          }

          let city = messageObj.params.city;
          if (!city || city === '') {
            return finished({error: 'Missing city value'});
          }

          let id = messageObj.params.id;
          if (!id || id === '') {
            return finished({error: 'Missing id value'});
          }

          let persons = this.db.use('Person');
          let personById = persons.$('by_id');

          if (id === 'new-record') {
            id = persons.$('id_counter').increment();
          }
          else {
            // make sure an erroneous id hasn't been sent
            if (!personById.$(id).exists) {
              return finished({error: 'No such Person record with id ' + id});
            }
          }

          personById.$(id).setDocument({
            name: name,
            gender: gender,
            city: city
          }); 

          finished({
            ok: true,
            id: id
          });
        };



### Cach&eacute;/IRIS Version

        module.exports = function(messageObj, session, send, finished) {
          if (!session.authenticated) {
            return finished({error: 'Not authenticated'});
          }

          if (!messageObj.params) {
            return finished({error: 'No params present in request'});
          }

          let name = messageObj.params.name;
          if (!name || name === '') {
            return finished({error: 'Missing name value'});
          }

          let gender = messageObj.params.gender;
          if (!gender || gender === '' || gender === 'invalid') {
            return finished({error: 'Missing gender value'});
          }

          let city = messageObj.params.city;
          if (!city || city === '') {
            return finished({error: 'Missing city value'});
          }     

          let id = messageObj.params.id;
          if (!id || id === '') {
            return finished({error: 'Missing id value'});
          }
          let db = this.db.dbx;
          let person;

          if (id === 'new-record') {
            person = db.classmethod('User.Person', '%New');
          }
          else {
            person = db.classmethod('User.Person', '%OpenId', id);
            if (person === '') {
              return finished({error: 'No such Person record with id ' + id});
            }
          }

          person.setproperty('Name', name);
          person.setproperty('Gender', gender);
          person.setproperty('City', city);

          person.method('%Save');
          id = person.method('%Id');
          person.method('%Close'); 

          finished({
            ok: true,
            id: id
          });
        };


In both versions I've made the following changes:

- check that an *id* is present in the incoming *params* object
- if the *id* is the reserved value *new-record*, instantiate a new Person record
  - otherwise open a pointer to the specified *id*
  - and check that the specified *id* is not erroneous

The two versions of the QEWD Back-end Handler will now cater for both new and existing
*Person* records.

## Try it Out

You'll first need to use the *qewd-monitor-adminui* application to stop the Worker processes,
to ensure that the updated back-end handler method is available to you when needed.

To summarise, [see here](https://github.com/robtweed/qewd-microservices-examples/tree/master/src/windows-iris-crud/stage_24) 
to confirm what your application's folder layout and files should look like at this stage of this tutorial.


Click the browser's *refresh*
button and log in.  You should now be able to create new *Person* records and edit/update
existing ones.

You now have the *Create*, *Read* and *Update* steps of the CRUD cycle!


----

# Stage 25: Deleting *Person* Records

## Background

We just have one last step to implement: deleting *Person* records.

You'll notice that there's currently apparenly now way to delete records in
the CRUD Assembly's UI.  That's because, by default, deleting is disabled.

##  Enabling Deletions

Edit the *personAssemblyState.js* Module file, and add the following to the *summary*
section:

        summary: {
          ...etc 

          enableDelete: true  <===== *****


## Try it Out

Save the change and click your browser's *refresh* button and log in.

Now you should see that a red *Delete* button has been added to each row
in the Summary Table.

Try clicking one of the *Delete* buttons.  A modal confirmation panel will
appear, asking you to confirm that you want the deletion to go ahead.

Click the *Cancel* button and the modal panel should disappear and no further
action will take place.

Click a *Delete* button again and this time click the *Yes* button in the
modal confirmation panel.

This time you should get, not surprisingly, a red *toastr* error appearing, telling
you:

        Handler not defined for demo messages of type deleteRecord

If you look in the browser's JavaScript Console, you'll see that it sent a
message to the QEWD back-end similar to this:

        sent: {"type":"deleteRecord","params":{"id":"4"}}

So it's sending a message of type *deleteRecord*, and adding the *id* of the
*Person* record you want to delete.


## Customising the Modal Confirmation Panel

When you click a *Delete* button, you'll see that the title in the
modal confirmation panel is:

        Deleting {{name}}

where {{name}} is the value of the *name* column of the Summary Table row
whose *Delete* button you clicked

eg:

        Deleting John

We can customise this title and change it to either some static text or, more
likely, a title that makes use of other values in the Summary Table row.

Edit the *personAssemblyState.js* Module file, and add the following to the *summary*
section:

        summary: {
          ...etc 

          enableDelete: true,

          deleteConfirmText: function(data) {
            return ' Record for ' + data[0] + ' from ' + data[1];
          }

The *deleteConfirmText* property allows us to define a function whose
return value will be used as the title of the modal confirmation panel.
The function has a single argument - *data* - which is an array containing
the column values from the row you selected for deletion.

In our example application, we've specified that the first column of each
row (*data[0]*) is the *Person's* *name* and the second column (*data[1]*) is the *city*.


## Try it Out

Save the change and click your browser's *refresh* button, log in and click a *Delete*
button for one of the rows of the Summary Table.

This time the title should look similar to this:

        Deleting Record for John from London


## Customising the QEWD Back-end Handler

You've seen that when you confirm the deletion, a message is sent of type *deleteRecord*.

We can customise the CRUD Assembly to send a message type of our choosing.

Edit the *personAssemblyState.js* Module file, and add the following to the 
*summary.qewd* object:

        summary: {
          ...etc

          qewd: {
            getSummary: 'personsSummary',
            getDetail: 'getPersonDetail',
            delete: 'deletePerson'         <====== *****
          },


## Try it Out

Save the change and click your browser's *refresh* button, log in and click a *Delete*
button for one of the rows of the Summary Table.  Then click the *Yes* button in the
modal confirmation panel.

You'll still get a red *toastr* error appearing, but this time it will tell you:

        Handler not defined for demo messages of type deletePerson

We now need to create the *deletePerson* QEWD Back-end Handler module.


## Creating the *deletePerson* QEWD Back-end Handler Module

When you clicked the *Yes* button, if you look in the browser's JavaScript console, you'll see
that it sent a message to QEWD similar to this:

        sent: {"type":"deletePerson","params":{"id":"4"}}

Notice how the *id* of the *Person* record you selected for deletion is included
in the message.

So let's create the QEWD Back-end Handler module for this message.

First, create the folder path for the *index.js* module file:

        C:\qewd
            |
            |- qewd-apps
                    |
                    |- demo
                         |
                         |- deletePerson
                               |
                               |- index.js


Here's my suggested logic for the two versions of the QEWD Back-end Handler for
this message:

### QEWD-JSdb Version

        module.exports = function(messageObj, session, send, finished) {
          if (!session.authenticated) {
            return finished({error: 'Not authenticated'});
          }

          if (!messageObj.params) {
            return finished({error: 'No params present in request'});
          }
          let id = messageObj.params.id;
           if (!id) {
            return finished({error: 'id not defined in request'});
          }

          let person = this.db.use('Person', 'by_id', id);
          if (!person.exists) {
            return finished({error: 'No record exists with that id'});
          }

          person.delete();

          finished({ok: true});
        };



### Cach&eacute;/IRIS Version

        module.exports = function(messageObj, session, send, finished) {
          if (!session.authenticated) {
            return finished({error: 'Not authenticated'});
          }

          if (!messageObj.params) {
            return finished({error: 'No params present in request'});
          }
          let id = messageObj.params.id;
           if (!id || id === '') {
            return finished({error: 'id not defined in request'});
          }

          let db = this.db.dbx;
          let person = db.classmethod('User.Person', '%OpenId', id);
          if (person === '') {
            return finished({error: 'No record exists with that id'});
          }

          person.method('%Close');
          db.classmethod('User.Person', '%DeleteId', id);

          finished({ok: true});
        };


In both cases, we get the id from the incoming message (having first checked that
the *id* is present) and then see if a *Person* record with that *id* exists.
If so, it is deleted and a simple *{ok: true}* response is returned.


## Try it Out

You'll first need to use the *qewd-monitor-adminui* application to stop the Worker processes,
to ensure that the *deletePerson* back-end handler method is available to you when needed.

To summarise, [see here](https://github.com/robtweed/qewd-microservices-examples/tree/master/src/windows-iris-crud/stage_25) 
to confirm what your application's folder layout and files should look like at this stage of this tutorial.

Click your browser's *refresh* button, log in and click a *Delete*
button for one of the rows of the Summary Table.  Then click the *Yes* button in the
modal confirmation panel.  This time you'll get a *toastr* confirmation message popping up
and the SUmmary Table will refresh: it will no longer contain the *Person* record you
deleted.


----

# The Application is Complete!

Congratulations, you now have a fully-working CRUD application to maintain a *Person* record,
all packaged up using the Admin User Interface.

Feel free to try out further customisations and perhaps try building out a version for one
of your own database records.

You can also add further menu options to the *sidebar* panel.  See the
[wc-adminui library](https://github.com/robtweed/wc-admin-ui) for some ideas.
You'll see an [examples folder](https://github.com/robtweed/wc-admin-ui/tree/master/examples)
which you may find helpful.

I hope you've found this tutorial useful.  Good luck and enjoy using QEWD and the
*mg-webComponents* framework!


