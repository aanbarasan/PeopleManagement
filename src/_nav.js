
export default {
  items: [
    {
      name: 'Home',
      url: '/dashboard',
      icon: 'icon-speedometer'
    },
    {
      name: 'Employee',
      icon: 'fa fa-user',
      children: [
        {
          name: 'Create employee',
          url: '/employee/create',
          icon: 'fa fa-user-plus'
        },
        {
          name: 'Manage Employees',
          url: '/employee/view',
          icon: 'fa fa-book'
        }
      ]
    }
  ]
};