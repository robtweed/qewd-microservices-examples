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