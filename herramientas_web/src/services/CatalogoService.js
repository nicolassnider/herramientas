import {get, post, put, remove} from './ApiServices';
//import * as storage from '../utils/Storage';

export const getCatalogos = () => {
    return get("catalogos/");
};

export const getCatalogoPorId = (id) => {
    return get("catalogos/" + id);

};

export const desactivarCatalogo = (id) => {
    return put("catalogos/" + id);

};
export const nuevoCatalogo = (catalogo) => {
    return post("catalogos", catalogo);
};

export const editarCatalogo = (catalogo) => {
    return put("catalogos/" + catalogo.id, catalogo);
};

export const eliminarCatalogo = (id) => {
    return remove("catalogos/" + id);
};

export const grillaCatalogos = () => {
    return get("catalogos");
};

export const selectCatalogosSinProducto = (id) => {
    return get("catalogos/selectsinproducto/" + id);
};





