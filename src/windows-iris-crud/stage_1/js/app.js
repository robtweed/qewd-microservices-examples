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
