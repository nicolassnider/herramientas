import {get, post, put, remove} from './ApiServices';
//import * as storage from '../utils/Storage';

export const getRemitos = () => {
    return get("remitos/");
};

export const getRemitoPorId = (id) => {
    return get("remitos/" + id);

};

export const desactivarRemito = (id) => {
    return put("remitos/" + id);

};
export const nuevoRemito = (remito) => {
    return post("remitos", remito);
};

export const editarRemito = (remito) => {
    return put("remitos/" + remito.id, remito);
};

export const eliminarRemito = (id) => {
    return remove("remitos/" + id);
};

export const grillaRemitos = () => {
    return get("remitos");
};

export const selectRemitos = () => {
    return get("remitos/select");
};

export const selectRemitosSinCliente = () => {
    return get("remitos/selectsincliente");
};

export const selectRemitosSinRevendedora = () => {
    return get("remitos/selectsinrevendedora");
};

export const pagar = (id) => {
    console.log("pagar");
    Promise.all();
    return put("remitos/pagar/" + id);
};

export const getRemitosPorFactura = (id) => {
    return get("remitos/factura/" + id);
};