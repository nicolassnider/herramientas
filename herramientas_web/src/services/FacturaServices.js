import {get, post, put, remove} from './ApiServices';
//import * as storage from '../utils/Storage';

export const getFacturas = () => {
    return get("facturas/");
};

export const getFacturaPorId = (id) => {
    return get("facturas/" + id);

};

export const desactivarFactura = (id) => {
    return put("facturas/" + id);

};
export const nuevoFactura = (factura) => {
    return post("facturas", factura);
};

export const editarFactura = (factura) => {
    return put("facturas/" + factura.id, factura);
};

export const eliminarFactura = (id) => {
    return remove("facturas/" + id);
};

export const grillaFacturas = () => {
    return get("facturas");
};

export const selectFacturas = () => {
    return get("facturas/select");
};

export const selectFacturasSinCliente = () => {
    return get("facturas/selectsincliente");
};

export const selectFacturasSinRevendedora = () => {
    return get("facturas/selectsinrevendedora");
};

export const pagar = (id) => {
    console.log("pagar");
    Promise.all();
    return put("facturas/pagar/" + id);
};