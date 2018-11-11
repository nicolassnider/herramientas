import {get, post, put, postFile} from './ApiServices';
//import * as storage from '../utils/Storage';

export const pedidoPorCampaniaActual = () => {
    return get("pedidos_avon/campania/pedido");
};

export const grillaPedidos = () => {
    return get("pedidos_avon/campaniaactual/pedido");
};


export const getPedidoPorId = (id) => {
    return get("pedidos_avon/" + id);

};

export const getPedidos = () => {
    return get("pedidos_avon");

};

export const pedidoPorCampania = (id) => {
    return get("pedidos_avon/campania/pedido/" + id);
};

export const subirPedidoCSV = (id, file) => {
    return postFile("pedidos_avon/pedido/csv", file);
}

export const recibir = (id) => {
    console.log(id);
    return put("pedidos_avon/recibir/" + id);
};