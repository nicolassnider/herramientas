import {get, post, put, remove} from './ApiServices';
//import * as storage from '../utils/Storage';

export const getCampanias = () => {
    return get("campanias/");
};

export const getCampaniaPorId = (id) => {
    return get("campanias/" + id);

};

export const getCampaniaActiva = () => {
    return get("campanias/campania/activa");
};

export const desactivarCampania = (id) => {
    return put("campanias/" + id);

};
export const nuevaCampania = (campania) => {
    console.log("post campania", campania);
    return post("campanias", campania);
};

export const editarCampania = (campania) => {
    return put("campanias/" + campania.id, campania);
};

export const eliminarCampania = (id) => {
    return remove("campanias/" + id);
};

export const grillaCampanias = () => {
    return get("campanias");
};



