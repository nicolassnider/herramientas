import {get, post, put} from './ApiServices';
//import * as storage from '../utils/Storage';

export const grillaUnidades = () => {
    return get("unidades/grilla");
}

export const getUnidadPorId = (id) => {
    return get("unidades/"+id);
}

export const nuevaUnidad = (unidad) => {
    return post("unidades", unidad);
}

export const editarUnidad = (unidad) => {
    return put("unidades/"+unidad.id, unidad);
}

export const getAllUnidades = () => {
    return get("unidades");
}