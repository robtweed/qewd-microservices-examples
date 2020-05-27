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
