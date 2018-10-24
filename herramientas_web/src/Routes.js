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
/***** Campaña Actual *****/
const CampaniaActual = Loadable({
    loader: () => import('./views/AreaTrabajo/CampaniaActual/CampaniaActual'),
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

/***** Revendedoras *****/
const Revendedoras = Loadable({
    loader: () => import('./views/Administracion/Personas/Revendedoras/Revendedoras'),
    loading: Loading,
});
/***** Revendedora *****/
const Revendedora = Loadable({
    loader: () => import('./views/Administracion/Personas/Revendedoras/Revendedora'),
    loading: Loading,
});

/***** Clientes *****/
const Clientes = Loadable({
    loader: () => import('./views/Administracion/Personas/Clientes/Clientes'),
    loading: Loading,
});
/***** Cliente *****/
const Cliente = Loadable({
    loader: () => import('./views/Administracion/Personas/Clientes/Cliente'),
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

/***** Productos *****/
const Productos = Loadable({
    loader: () => import('./views/Administracion/Productos/Productos'),
    loading: Loading,
});
/***** Producto *****/
const Producto = Loadable({
    loader: () => import('./views/Administracion/Productos/Producto'),
    loading: Loading,
});

/***** ProductoCatalogos *****/
const ProductoCatalogos = Loadable({
    loader: () => import('./views/Administracion/ProductoCatalogo/ProductoCatalogos'),
    loading: Loading,
});
/***** ProductoCatalogo *****/
const ProductoCatalogo = Loadable({
    loader: () => import('./views/Administracion/ProductoCatalogo/ProductoCatalogo'),
    loading: Loading,
});
/***** IncluirProductoEnCatalogo *****/
const IncluirProductoEnCatalogo = Loadable({
    loader: () => import('./views/Administracion/ProductoCatalogo/IncluirProductoEnCatalogo'),
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

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
    {
        path: '/', exact: true, name: 'Home', component: DefaultLayout
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
        path: '/administracion/personas/revendedoras', exact: true, name: 'Revendedoras', component: Revendedoras
    },
    {
        path: '/administracion/personas/revendedoras/nuevo', exact: true, name: 'Nuevo', component: Revendedora
    },
    {
        path: '/administracion/personas/revendedoras/editar/:id', exact: true, name: 'Editar', component: Revendedora
    },
    {
        path: '/administracion/personas/revendedora/desactivar/:id',
        exact: true,
        name: 'Desactivar',
        component: Revendedora
    },

    {
        path: '/administracion/personas/clientes', exact: true, name: 'Clientes', component: Clientes
    },
    {
        path: '/administracion/personas/clientes/nuevo', exact: true, name: 'Nuevo', component: Cliente
    },
    {
        path: '/administracion/personas/clientes/editar/:id', exact: true, name: 'Editar', component: Cliente
    },
    {
        path: '/administracion/personas/clientes/desactivar/:id', exact: true, name: 'Desactivar', component: Cliente
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
        path: '/administracion/productos', exact: true, name: 'Personas', component: Productos
    },
    {
        path: '/administracion/productos/nuevo', exact: true, name: 'Nuevo', component: Producto
    },
    {
        path: '/administracion/productos/editar/:id', exact: true, name: 'Editar', component: Producto
    },
    {
        path: '/administracion/productos/desactivar/:id', exact: true, name: 'Desactivar', component: Producto
    },

    {
        path: '/administracion/productos/catalogosenproducto/:id',
        exact: true,
        name: 'Catalogos de Producto',
        component: ProductoCatalogos
    },
    {
        path: '/administracion/productos/incluirencatalogo',
        exact: true,
        name: 'Incluye en Catalogo',
        component: ProductoCatalogo
    },

    {
        path: '/administracion/productos/incluirproductoencatalogo/:id',
        exact: true,
        name: 'Incluye Producto en Catalogo',
        component: IncluirProductoEnCatalogo
    },

    {
        path: '/areatrabajo/campaniaactual/campaniaactual',
        exact: true,
        name: 'Campania Actual',
        component: CampaniaActual
    },

    {
        path: '/users', exact: true, name: 'Users', component: Users
    },
    {
        path: '/users/:id', exact: true, name: 'User Details', component: User
    },


];

export default routes;