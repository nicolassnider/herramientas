import {get, post, put} from './ApiServices';

export const grillaTipoDocumento = () => {
    return get("tipoDocumento/grilla");
}

export const getTipoDocumentoPorId = (id) => {
    return get("tipoDocumento/" + id);
}

export const nuevaTipoDocumento = (tipoDocumento) => {
    return post("tipoDocumento", tipoDocumento);
}

export const editarTipoDocumento = (tipoDocumento) => {
    return put("tipoDocumento/" + tipoDocumento.id, tipoDocumento);
}

export const getAllTipoDocumento = () => {
    return get("tipos-documento/select")
}