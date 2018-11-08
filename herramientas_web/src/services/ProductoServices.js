import {get, post, put, remove} from './ApiServices';
//import * as storage from '../utils/Storage';

export const getProductos = () => {
    return get("productos/");
};

export const getProductoPorId = (id) => {
    return get("productos/" + id);

};

export const getProductoActiva = () => {
    return get("productos/activa");
};

export const desactivarProducto = (id) => {
    return put("productos/" + id);

};
export const nuevaProducto = (producto) => {
    console.log("post producto", producto);
    return post("productos", producto);
};

export const editarProducto = (producto) => {
    return put("productos/" + producto.id, producto);
};

export const eliminarProducto = (id) => {
    return remove("productos/" + id);
};

export const grillaProductos = () => {
    return get("productos");
};


