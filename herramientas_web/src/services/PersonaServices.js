import {get, post, put, remove} from './ApiServices';
//import * as storage from '../utils/Storage';

export const getPersonas = () => {
    return get("personas/");
};

export const getPersonaPorId = (id) => {
    return get("personas/" + id);

};

export const desactivarPersona = (id) => {
    return put("personas/" + id);

};
export const nuevoPersona = (persona) => {
    return post("personas", persona);
};

export const editarPersona = (persona) => {
    return put("personas/" + persona.id, persona);
};

export const eliminarPersona = (id) => {
    return remove("personas/" + id);
};

export const grillaPersonas = () => {
    return get("personas");
};

export const selectPersonas = () => {
    return get("personas/select");
};

export const selectPersonasSinCliente = () => {
    return get("personas/selectsincliente");
};

export const selectPersonasSinRevendedora = () => {
    return get("personas/selectsinrevendedora");
};