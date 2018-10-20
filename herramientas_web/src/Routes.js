import React from 'react';
import Loadable from 'react-loadable'

import DefaultLayout from './containers/DefaultLayout';

function Loading() {
    return <div>Loading...</div>;
}

/***** Campañas *****/
const Campanias = Loadable({
    loader: () => import('./views/Administracion/Campanias/Campanias'),
    loading: Loading,
});

/***** Campaña *****/
const Campania = Loadable({
    loader: () => import('./views/Administracion/Campanias/Campania'),
    loading: Loading,
});

/***** Catalogos *****/
const Catalogos = Loadable({
    loader: () => import('./views/Administracion/Catalogos/Catalogos'),
    loading: Loading,
});

/***** Catalogo *****/
const Catalogo = Loadable({
    loader: () => import('./views/Administracion/Catalogos/Catalogo'),
    loading: Loading,
});

/***** Personas *****/
const Personas = Loadable({
    loader: () => import('./views/Administracion/Personas/Personas'),
    loading: Loading,
});

/***** Persona *****/
const Persona = Loadable({
    loader: () => import('./views/Administracion/Personas/Persona'),
    loading: Loading,
});



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
    {
        path: '/', exact: true, name: 'Home', component: DefaultLayout
    },
    {
        path: '/Calendario', name: 'Calendario', component: Calendario
    },
    {
        path: '/configuracion', exact: true, name: 'Configuracion', component: Unidades
    },

    {
        path: '/configuracion/unidades', exact: true, name: 'Unidades de Medida', component: Unidades
    },
    {
        path: '/configuracion/unidades/nueva', exact: true, name: 'Nueva', component: Unidad
    },
    {
        path: '/configuracion/unidades/editar/:id', exact: true, name: 'Editar', component: Unidad
    },

    {
        path: '/configuracion/laboratorios', exact: true, name: 'Laboratorios', component: Laboratorios
    },
    {
        path: '/configuracion/laboratorios/nuevo', exact: true, name: 'Nuevo', component: Laboratorio
    },
    {
        path: '/configuracion/laboratorios/editar/:id', exact: true, name: 'Editar', component: Laboratorio
    },

    {
        path: '/configuracion/determinaciones', exact: true, name: 'Determinaciones', component: Determinaciones//,permissions: ["DETERMINACIONES_LISTAR"]
    },
    {
        path: '/configuracion/determinaciones/nuevo', exact: true, name: 'Nuevo', component: Determinacion
    },
    {
        path: '/configuracion/determinaciones/editar/:id', exact: true, name: 'Editar', component: Determinacion
    },

    {
        path: '/configuracion/metodos', exact: true, name: 'Métodos', component: Metodos
    },
    {
        path: '/configuracion/metodos/nuevo', exact: true, name: 'Nuevo', component: Metodo
    },
    {
        path: '/configuracion/metodos/editar/:id', exact: true, name: 'Editar', component: Metodo
    },

    {
        path: '/administracion/campanias', exact: true, name: 'Campanias', component: Campanias
    },
    {
        path: '/administracion/campanias/nuevo', exact: true, name: 'Nuevo', component: Campania
    },
    {
        path: '/administracion/campanias/editar/:id', exact: true, name: 'Editar', component: Campania
    },


    {
        path: '/administracion/catalogos', exact: true, name: 'Catalogos', component: Catalogos
    },
    {
        path: '/administracion/catalogos/nuevo', exact: true, name: 'Nuevo', component: Catalogo
    },
    {
        path: '/administracion/catalogos/editar/:id', exact: true, name: 'Editar', component: Catalogo
    },
    {
        path: '/administracion/catalogos/desactivar/:id', exact: true, name: 'Desactivar', component: Catalogo
    },

    {
        path: '/administracion/personas', exact: true, name: 'Personas', component: Personas
    },
    {
        path: '/administracion/personas/nuevo', exact: true, name: 'Nuevo', component: Persona
    },
    {
        path: '/administracion/personas/editar/:id', exact: true, name: 'Editar', component: Persona
    },
    {
        path: '/administracion/personas/desactivar/:id', exact: true, name: 'Desactivar', component: Persona
    },
    


    {
        path: '/users', exact: true, name: 'Users', component: Users
    },
    {
        path: '/users/:id', exact: true, name: 'User Details', component: User
    },

    {
        path: '/presentacion', exact: true, name: 'Presentación', component: Presentacion
    },
    {
        path: '/presentacion/resumen/', exact: true, name: 'Resumen', component: Resumen
    },
];

export default routes;