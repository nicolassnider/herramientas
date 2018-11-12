import {get, getFile, post, put, remove} from './ApiServices';
import downloadJs from "downloadjs";
//import * as storage from '../utils/Storage';
import mimeTypes from 'mime-types';

export const getClientes = () => {
    return get("clientes/");
};

export const getClientePorId = (id) => {
    return get("clientes/" + id);
};

export const desactivarCliente = (id) => {
    return put("clientes/" + id);

};
export const nuevoCliente = (persona) => {
    return post("clientes", persona);
};

export const editarCliente = (persona) => {
    return put("clientes/" + persona.id, persona);
};

export const eliminarCliente = (id) => {
    return remove("clientes/" + id);
};

export const grillaClientes = () => {
    return get("clientes");
};

export const selectClientes = () => {
    return get("clientes/select");
};

export const getCsvClientesPorRevendedora = (id) => {
    return getFile("clientes/revendedora/archivo/" + id);
};

export const descargaClientesPorRevendedora = (id) => {
    getCsvClientesPorRevendedora(id)
        .then(
            (result) => {
                return result.blob();
            }
        )
        .then(
            (result) => {
                return downloadJs(result, "ClientesPorRevendedora_" + id + "." + mimeTypes.extension(result.type), result.type);
            }
        )
}
