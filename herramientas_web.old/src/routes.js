import React from 'react';
import Loadable from 'react-loadable'

import DefaultLayout from './containers/DefaultLayout';

function Loading() {
  return <div>Loading...</div>;
}

/***** Personas *****/
const Personas = Loadable({
  loader: () => import('./views/Administracion/Personas/Personas'),
  loading: Loading,
});

const Persona = Loadable({
  loader: () => import('./views/Administracion/Personas/Persona'),
  loading: Loading,
});

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/administracion/personas', exact: true, name: 'Personas', component: Personas},
  { path: '/administracion/personas/nuevo', exact: true, name: 'Nuevo', component: Personas },
  { path: '/administracion/personas/editar/:id', exact: true, name: 'Editar', component: Personas},
];

export default routes;
