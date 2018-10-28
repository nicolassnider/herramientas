import {get, post, put} from './ApiServices';
//import * as storage from '../utils/Storage';

export const pedidoPorCampaniaActual = () => {
    return get("pedidos_avon/campaniaactual/pedido");
}