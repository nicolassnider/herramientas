import {get, getFile, post, put, remove} from './ApiServices';
import downloadJs from "downloadjs";
//import * as storage from '../utils/Storage';
import mimeTypes from 'mime-types';

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

export const getCsvRevendedorasMasDeudores = () => {
    return getFile("revendedoras/deudores/archivo");
};

export const descargaRevendedorasMasDeudores = () => {
    getCsvRevendedorasMasDeudores()
        .then(
            (result) => {
                return result.blob();
            }
        )
        .then(
            (result) => {
                return downloadJs(result, "RevendedorasMasDeudores" + "." + mimeTypes.extension(result.type), result.type);
            }
        )
}