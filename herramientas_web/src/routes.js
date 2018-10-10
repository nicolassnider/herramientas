import React from 'react';
import Loadable from 'react-loadable'

import DefaultLayout from './containers/DefaultLayout';

function Loading() {
  return <div>Loading...</div>;
}

const Calendario = Loadable({
  loader: () => import('./views/Calendario'),
  loading: Loading,
});

/***** Unidades de Medida *****/
const Unidades = Loadable({
  loader: () => import('./views/Configuracion/Unidades/Unidades'),
  loading: Loading,
});

const Unidad = Loadable({
  loader: () => import('./views/Configuracion/Unidades/Unidad'),
  loading: Loading,
});

/***** Laboratorios *****/
const Laboratorios = Loadable({
  loader: () => import('./views/Configuracion/Laboratorios/Laboratorios'),
  loading: Loading,
});

const Laboratorio = Loadable({
  loader: () => import('./views/Configuracion/Laboratorios/Laboratorio'),
  loading: Loading,
});

/***** Determinaciones *****/
const Determinaciones = Loadable({
  loader: () => import('./views/Configuracion/Determinaciones/Determinaciones'),
  loading: Loading,
});

const Determinacion = Loadable({
  loader: () => import('./views/Configuracion/Determinaciones/Determinacion'),
  loading: Loading,
});

/***** Métodos *****/
const Metodos = Loadable({
  loader: () => import('./views/Configuracion/Metodos/Metodos'),
  loading: Loading,
});

const Metodo = Loadable({
  loader: () => import('./views/Configuracion/Metodos/Metodo'),
  loading: Loading,
});

/***** Series *****/
const Series = Loadable({
  loader: () => import('./views/Administracion/Series/Series'),
  loading: Loading,
});

const Serie = Loadable({
  loader: () => import('./views/Administracion/Series/Serie'),
  loading: Loading,
});

const Informe = Loadable({
  loader: () => import('./views/Administracion/Series/Informe'),
  loading: Loading,
});

const Users = Loadable({
  loader: () => import('./views/Users/Users'),
  loading: Loading,
});

const User = Loadable({
  loader: () => import('./views/Users/User'),
  loading: Loading,
});

const Presentacion = Loadable({
  loader: () => import('./views/Presentacion/Presentacion'),
  loading: Loading,
});

const Resumen = Loadable({
  loader: () => import('./views/Presentacion/Resumen'),
  loading: Loading,
});

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/', exact: true, name: 'Home', component: DefaultLayout },
  { path: '/Calendario', name: 'Calendario', component: Calendario },
  { path: '/configuracion', exact: true, name: 'Configuracion', component: Unidades, permissions:["UNIDADES_LISTAR"] },

  { path: '/configuracion/unidades', exact: true, name: 'Unidades de Medida', component: Unidades, permissions:["UNIDADES_LISTAR"] },
  { path: '/configuracion/unidades/nueva', exact: true, name: 'Nueva', component: Unidad, permissions:["UNIDADES_CREAR"] },
  { path: '/configuracion/unidades/editar/:id', exact: true, name: 'Editar', component: Unidad, permissions:["UNIDADES_ACTUALIZAR"] },
  
  { path: '/configuracion/laboratorios', exact: true, name: 'Laboratorios', component: Laboratorios, permissions:["LABORATORIOS_LISTAR"] },
  { path: '/configuracion/laboratorios/nuevo', exact: true, name: 'Nuevo', component: Laboratorio, permissions:["LABORATORIOS_CREAR"] },
  { path: '/configuracion/laboratorios/editar/:id', exact: true, name: 'Editar', component: Laboratorio, permissions:["LABORATORIOS_ACTUALIZAR"] },

  { path: '/configuracion/determinaciones', exact: true, name: 'Determinaciones', component: Determinaciones, permissions:["DETERMINACIONES_LISTAR"] },
  { path: '/configuracion/determinaciones/nuevo', exact: true, name: 'Nuevo', component: Determinacion, permissions:["DETERMINACIONES_CREAR"] },
  { path: '/configuracion/determinaciones/editar/:id', exact: true, name: 'Editar', component: Determinacion, permissions:["DETERMINACIONES_ACTUALIZAR"] },

  { path: '/configuracion/metodos', exact: true, name: 'Métodos', component: Metodos, permissions:["METODOS_LISTAR"] },
  { path: '/configuracion/metodos/nuevo', exact: true, name: 'Nuevo', component: Metodo, permissions:["METODOS_CREAR"] },
  { path: '/configuracion/metodos/editar/:id', exact: true, name: 'Editar', component: Metodo, permissions:["METODOS_ACTUALIZAR"] },

  { path: '/administracion/series', exact: true, name: 'Series', component: Series, permissions:["SERIES_LISTAR"] },
  { path: '/administracion/series/nuevo', exact: true, name: 'Nuevo', component: Serie, permissions:["SERIES_CREAR"] },
  { path: '/administracion/series/editar/:id', exact: true, name: 'Editar', component: Serie, permissions:["SERIES_ACTUALIZAR"] },
  { path: '/administracion/series/:id/informe', exact: true, name: 'Subir Informe', component: Informe, permissions:["SERIES_ACTUALIZAR"] },
  
  { path: '/users', exact: true,  name: 'Users', component: Users },
  { path: '/users/:id', exact: true, name: 'User Details', component: User },

  { path: '/presentacion', exact: true, name: 'Presentación', component: Presentacion },
  { path: '/presentacion/resumen/', exact: true, name: 'Resumen', component: Resumen },
];

export default routes;