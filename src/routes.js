import React from 'react';

const Dashboard = React.lazy(() => import('./views/Dashboard/Dashboard'));
const CreateEmployee = React.lazy(() => import('./views/Create/CreateEmployee'));
const CreateDevice = React.lazy(() => import('./views/Create/CreateDevice'));
const ViewEmployee = React.lazy(() => import('./views/View/ViewEmployee'));
const ViewDevice = React.lazy(() => import('./views/View/ViewDevice'));

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/create/employee', name: 'Create Employee', component: CreateEmployee },
  { path: '/create/device', name: 'Create Device', component: CreateDevice },
  { path: '/view/employee', name: 'View Employee', component: ViewEmployee },
  { path: '/view/device', name: 'View Device', component: ViewDevice }
];

export default routes;
