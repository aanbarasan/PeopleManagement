import React from 'react';

const Dashboard = React.lazy(() => import('./views/Dashboard/Dashboard'));
const CreateEmployee = React.lazy(() => import('./views/employee/CreateEmployee'));
const ViewEmployee = React.lazy(() => import('./views/employee/ViewEmployee'));

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/employee/create', name: 'Create Employee', component: CreateEmployee },
  { path: '/employee/view', name: 'View Employee', component: ViewEmployee }
];

export default routes;
