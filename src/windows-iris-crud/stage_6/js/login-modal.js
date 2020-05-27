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
