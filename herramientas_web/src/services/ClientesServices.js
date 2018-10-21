import {get, post, put, remove} from './ApiServices';
//import * as storage from '../utils/Storage';

export const getClientes = () => {
    return get("clientes/");
};

export const getClientePorId = (id) => {
    return get("clientes/" + id);

};

export const desactivarCliente = (id) => {
    return put("clientes/" + id);

};
export const nuevoCliente = (persona) => {
    return post("clientes", persona);
};

export const editarCliente = (persona) => {
    return put("clientes/" + persona.id, persona);
};

export const eliminarCliente = (id) => {
    return remove("clientes/" + id);
};

export const grillaClientes = () => {
    return get("clientes");
};
