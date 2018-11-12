import {get, getFile, post, put, remove} from './ApiServices';
import downloadJs from "downloadjs";
import mimeTypes from 'mime-types';

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

export const selectProductos = () => {
    return get("productos/select");
};

export const getCsvProductosMasVendidos = () => {
    return getFile("productos/masvendidos/archivo");
};

export const descargaProductosMasVendidos = () => {
    getCsvProductosMasVendidos()
        .then(
            (result) => {
                return result.blob();
            }
        )
        .then(
            (result) => {
                return downloadJs(result, "ProductosMasVendidos" + "." + mimeTypes.extension(result.type), result.type);
            }
        )
}
