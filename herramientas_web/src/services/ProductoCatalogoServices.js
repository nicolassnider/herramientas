import {get, post, put, remove} from './ApiServices';
//import * as storage from '../utils/Storage';

export const getCatalogosPorProductoPorId = (id) => {
    return get("productocatalogos/catalogosporproducto/" + id);
};

export const selectProductoCatalogos = () => {
    return get("productocatalogos/select");
};

export const selectProductoCatalogosParaRevendedora = () => {
    return get("productocatalogos/select/catalogorevendedora");
};

export const nuevaProductoCatalogo = (productoCatalogo) => {
    return post("productocatalogos", productoCatalogo);
};

export const editarProductoCatalogo = (productoCatalogo) => {
    return put("productocatalogos/" + productoCatalogo.id, productoCatalogo);
};