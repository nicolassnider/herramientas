import {get, getFile, post, put, remove} from './ApiServices';
//import * as storage from '../utils/Storage';
import mimeTypes from 'mime-types';
import downloadJs from 'downloadjs';

export const grillaPedidoProductoCatalogos = (id) => {

    return get("pedidoproductocatalogo/pedido/" + id);
};

export const checkCampaniaPedidoProductoCatalogo = (id) => {

    return get("pedidoproductocatalogo/checkcampaniaactiva/" + id);
};

export const nuevoPedidoProductoCatalogo = (pedidoProductoCatalogo) => {
    return post("pedidoproductocatalogo", pedidoProductoCatalogo);
};

export const editarPedidoProductoCatalogo = (pedidoProductoCatalogo) => {
    return put("pedidoproductocatalogo/" + pedidoProductoCatalogo.id, pedidoProductoCatalogo);
};

export const removePedidoProductoCatalogo = (id) => {
    return remove("pedidoproductocatalogo/" + id);
};

export const cobrarPedidoProductoCatalogo = (id) => {
    return put("pedidoproductocatalogo/cobrar/" + id);
};

export const entregarProductoCatalogo = (id) => {
    return put("pedidoproductocatalogo/entregar/" + id);
};


export const getCsvProductoCatalogosPorPedido = (id) => {
    return getFile("pedidoproductocatalogo/pedido/archivo/" + id);
};

export const descargaProductoCatalogosPorPedido = (id) => {
    getCsvProductoCatalogosPorPedido(id)
        .then(
            (result) => {
                return result.blob();
            }
        )
        .then(
            (result) => {
                return downloadJs(result, "Pedido_" + id + "." + mimeTypes.extension(result.type), result.type);
            }
        )
}