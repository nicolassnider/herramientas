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

/***** IncluirProductoEnPedido *****/
const IncluirProductoEnPedidoRevendedora = Loadable({
    loader: () => import('./views/Administracion/ProductoCatalogo/IncluirProductoEnPedidoRevendedora'),
    loading: Loading,
});

/***** IncluirProductoEnPedido *****/
const IncluirProductoEnPedido = Loadable({
    loader: () => import('./views/Administracion/ProductoCatalogo/IncluirProductoEnPedido'),
    loading: Loading,
});

/***** Usuario *****/
const Usuario = Loadable({
    loader: () => import('./views/Administracion/Personas/Usuarios/Usuario'),
    loading: Loading,
});

/***** PedidosAnteriores *****/
const PedidoAnteriores = Loadable({
    loader: () => import('./views/AreaTrabajo/PedidosAnteriores/PedidoAnteriores'),
    loading: Loading,
});
/***** PedidoAnterior *****/
const PedidoAnterior = Loadable({
    loader: () => import('./views/AreaTrabajo/PedidosAnteriores/PedidoAnterior'),
    loading: Loading,
});

/***** PedidoCSV *****/
const PedidoAvon = Loadable({
    loader: () => import('./views/AreaTrabajo/PedidoAvon/PedidoAvon'),
    loading: Loading,
});

/***** SaldarPedidoProductoCatalogo*****/
const SaldarPedidoProductoCatalogo = Loadable({
    loader: () => import('./views/Administracion/ProductoCatalogo/SaldarPedidoProductoCatalogo'),
    loading: Loading,
});

/***** Unidades*****/
const Unidades = Loadable({
    loader: () => import('./views/Administracion/ProductoCatalogo/Unidades/Unidades'),
    loading: Loading,
});
/***** Unidad *****/
const Unidad = Loadable({
    loader: () => import('./views/Administracion/ProductoCatalogo/Unidades/Unidad'),
    loading: Loading,
});

/***** CategoriaProductos*****/
const CategoriaProductos = Loadable({
    loader: () => import('./views/Administracion/ProductoCatalogo/CategoriaProductos/CategoriaProductos'),
    loading: Loading,
});
/***** CategoriaProducto *****/
const CategoriaProducto = Loadable({
    loader: () => import('./views/Administracion/ProductoCatalogo/CategoriaProductos/CategoriaProducto'),
    loading: Loading,
});

/***** Facturas*****/
const Facturas = Loadable({
    loader: () => import('./views/AreaTrabajo/Facturas/Facturas'),
    loading: Loading,
});
/***** Factura *****/
const Factura = Loadable({
    loader: () => import('./views/AreaTrabajo/Facturas/Factura'),
    loading: Loading,
});

/***** Remitos*****/
const Remitos = Loadable({
    loader: () => import('./views/AreaTrabajo/Remitos/Remitos'),
    loading: Loading,
});
/***** Remito *****/
const Remito = Loadable({
    loader: () => import('./views/AreaTrabajo/Remitos/Remito'),
    loading: Loading,
});

/***** RemitoProductos*****/
const RemitoProductos = Loadable({
    loader: () => import('./views/AreaTrabajo/RemitoProductos/RemitoProductos'),
    loading: Loading,
});
/***** RemitoProducto *****/
const RemitoProducto = Loadable({
    loader: () => import('./views/AreaTrabajo/RemitoProductos/RemitoProducto'),
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
        path: '/', exact: true, name: 'Home', component: CampaniaActual
    },
    {
        path: '/administracion/pedido/saldar/:id',
        exact: true,
        name: 'Campanias',
        component: SaldarPedidoProductoCatalogo
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
        path: '/areatrabajo/campania/campaniaactual', exact: true, name: 'Campania Actual', component: CampaniaActual
    },

    {
        path: '/areatrabajo/campania/campaniaactual/pedido/incluirenpedido/:id',
        exact: true,
        name: 'Incluir producto en Pedido',
        component: IncluirProductoEnPedido
    },
    {
        path: '/areatrabajo/campania/campaniaactual/pedido/incluirenpedidorevendedora/:id',
        exact: true,
        name: 'Incluir producto en Pedido',
        component: IncluirProductoEnPedidoRevendedora
    },
    {
        path: '/areatrabajo/campania/campaniaactual/pedido/incluirenpedido/editar/:id/:pedidoproductocatalogo',
        exact: true,
        name: 'Editar producto en Pedido',
        component: IncluirProductoEnPedido
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
        path: '/administracion/personas/revendedoras/usuarios/editar/:id',
        exact: true,
        name: 'Editar',
        component: Usuario
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
        path: '/areatrabajo/pedidosanteriores/pedidoavon',
        exact: true,
        name: 'PedidoAvon',
        component: PedidoAvon
    },

    {
        path: '/areatrabajo/pedidosanteriores/pedidosanteriores',
        exact: true,
        name: 'PedidosAnteriores',
        component: PedidoAnteriores
    },
    {
        path: '/areatrabajo/pedidosanteriores/pedidosanteriores/:id',
        exact: true,
        name: 'PedidoAnterior',
        component: PedidoAnterior
    },

    {
        path: '/areatrabajo/facturas/facturas', exact: true, name: 'Facturas', component: Facturas
    },
    {
        path: '/areatrabajo/facturas/facturas/nueva/campania/:id',
        exact: true,
        name: 'Nueva Factura',
        component: Factura
    },
    {
        path: '/areatrabajo/facturas/facturas/:id', exact: true, name: 'Editar Factura', component: Factura
    },

    {
        path: '/areatrabajo/facturass/remitos/incluirproductosenremito/:id',
        exact: true,
        name: 'Incluir Producto en Remito',
        component: RemitoProducto
    },
    {
        path: '/areatrabajo/facturass/remitos/remitoproductos/:id',
        exact: true,
        name: 'Productos por Remito',
        component: RemitoProductos
    },
    {
        path: '/areatrabajo/facturas/remitos/nueva/factura/:id',
        exact: true,
        name: 'Nuevo Remito',
        component: Remito
    },
    {
        path: '/areatrabajo/facturas/remitos/factura/:id',
        exact: true,
        name: 'Remitos',
        component: Remitos
    },

    {
        path: '/areatrabajo/facturas/remitos/:id', exact: true, name: 'Editar Remito', component: Remito
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
        path: '/users', exact: true, name: 'Users', component: Users
    },
    {
        path: '/users/:id', exact: true, name: 'User Details', component: User
    },

    {
        path: '/administracion/productocatalogo/unidades', exact: true, name: 'Unidades', component: Unidades
    },
    {
        path: '/administracion/productocatalogo/unidades/nuevo', exact: true, name: 'Nueva Unidad', component: Unidad
    },
    {
        path: '/administracion/productocatalogo/unidades/:id', exact: true, name: 'Editar Unidad', component: Unidad
    },
    {
        path: '/administracion/productocatalogo/categoriaproductos',
        exact: true,
        name: 'CategoriaProductos',
        component: CategoriaProductos
    },
    {
        path: '/administracion/productocatalogo/categoriaproductos/nuevo',
        exact: true,
        name: 'Nueva CategoriaProducto',
        component: CategoriaProducto
    },
    {
        path: '/administracion/productocatalogo/categoriaproductos/:id',
        exact: true,
        name: 'Editar CategoriaProducto',
        component: CategoriaProducto
    },


];

export default routes;