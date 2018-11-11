import {get, getFile, post, put, remove} from './ApiServices';
import downloadJs from "downloadjs";
import mimeTypes from 'mime-types';
//import * as storage from '../utils/Storage';


export const getCatalogosPorProductoPorId = (id) => {
    return get("productocatalogos/catalogosporproducto/" + id);
};

export const selectProductoCatalogos = () => {
    return get("productocatalogos/select");
};

export const nuevoRemitoProducto = (remitoProducto) => {
    return post("remitoproducto", remitoProducto);
};

export const editarRemitoProducto = (productoCatalogo) => {
    return put("remitoproducto/" + productoCatalogo.id, productoCatalogo);
};

export const getAllRemitoPoductoPorRemito = (id) => {
    return get("remitoproducto/remito/" + id);
};

export const recibir = (id) => {
    return put("remitoproducto/recibir/" + id);
};

export const getCsvRemitoProductosPorRemito = (id) => {
    console.log(id);
    return getFile("remitoproducto/remito/archivo/" + id);
};

export const descargaRemitoProductosPorRemito = (id) => {
    getCsvRemitoProductosPorRemito(id)

        .then(
            (result) => {
                return result.blob();
            }
        )
        .then(
            (result) => {
                return downloadJs(result, "Remito_" + id + "." + mimeTypes.extension(result.type), result.type);
            }
        )
}
