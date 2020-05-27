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
