import {get, post, put, remove} from './ApiServices';
//import * as storage from '../utils/Storage';

export const getRevendedoras = () => {
    return get("revendedoras/");
};

export const getRevendedoraPorId = (id) => {
    return get("revendedoras/" + id);

};

export const desactivarRevendedora = (id) => {
    return put("revendedoras/" + id);

};
export const nuevoRevendedora = (revendedora) => {
    return post("revendedoras", revendedora);
};

export const editarRevendedora = (revendedora) => {
    return put("revendedoras/" + revendedora.id, revendedora);
};

export const eliminarRevendedora = (id) => {
    return remove("revendedoras/" + id);
};

export const grillaRevendedoras = () => {
    return get("revendedoras");
};

export const selectRevendedoras = () => {
    return get("revendedoras/select");
};
