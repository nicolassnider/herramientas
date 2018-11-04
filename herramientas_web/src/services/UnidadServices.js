import {get, post, put} from './ApiServices';


export const getAllUnidades = () => {
    return get("unidades/select")
};

export const getTotalUnidades = () => {
    return get("unidades")
};

export const getUnidadPorId = (id) => {
    return get("unidades/" + id);

};
export const editarUnidad = (unidad) => {
    return put("unidades/" + unidad.id, unidad);
};

export const nuevoUnidad = (unidad) => {
    return post("unidades", unidad);
};

