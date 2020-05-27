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
