import {get, post, put} from './ApiServices';
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

