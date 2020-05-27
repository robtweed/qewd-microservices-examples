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

  return {component, hooks};

};
