import {get, post, put, remove} from './ApiServices';
//import * as storage from '../utils/Storage';

export const grillaPedidoProductoCatalogos = (id) => {
    return get("pedidoproductocatalogo/pedido/" + id);
};

export const nuevoPedidoProductoCatalogo = (pedidoProductoCatalogo) => {
    return post("pedidoproductocatalogo", pedidoProductoCatalogo);
};

export const editarPedidoProductoCatalogo = (pedidoProductoCatalogo) => {
    return put("pedidoproductocatalogo/" + pedidoProductoCatalogo.id, pedidoProductoCatalogo);
};



