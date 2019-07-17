
export default {
  items: [
    {
      name: 'Home',
      url: '/dashboard',
      icon: 'icon-speedometer'
    },
    {
      name: 'Create',
      icon: 'fa fa-plus',
      children: [
        {
          name: 'Employee',
          url: '/create/employee',
          icon: 'fa fa-user-plus'
        },
        {
          name: 'Device',
          url: '/create/device',
          icon: 'fa fa-laptop'
        }
      ]
    },
    {
      name: 'View',
      icon: 'fa fa-book',
      children: [
        {
          name: 'Employee',
          url: '/view/employee',
          icon: 'fa fa-user'
        },
        {
          name: 'Device',
          url: '/view/device',
          icon: 'fa fa-desktop'
        }
      ]
    }
  ]
};