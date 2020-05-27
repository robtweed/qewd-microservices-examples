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