import {get, post, put, postFile, getFile} from './ApiServices';
//import * as storage from '../utils/Storage';

export const grillaSeries = () => {
    return get("series/grilla");
}

export const getSeriePorId = (id) => {
    return get("series/"+id);
}

export const nuevaSerie = (serie) => {
    return post("series", serie);
}

export const editarSerie = (serie) => {
    return put("series/"+serie.id, serie);
}

export const getSeriesPorAnio = (anio) => {
    return get("series/anio/"+anio);
}

export const getSerieActiva = () => {
    return get("series/activa");
}

export const getSerieProxima = () => {
    return get("series/proxima");
}

export const informeNuevo = (id, file) => {
    return postFile("series/"+id+"/informe", file);
}

export const descargarInforme = (id) => {
    return getFile("series/"+id+"/informe");
}

export const getAnios = () => {
    return get("series/anios");
}