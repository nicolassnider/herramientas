import {get, post, put} from './ApiServices';
//import * as storage from '../utils/Storage';

export const grillaMetodos = () => {
    return get("metodos/grilla");
}

export const getMetodoPorId = (id) => {
    return get("metodos/" + id);
}

export const nuevoMetodo = (metodo) => {
    return post("metodos", metodo);
}

export const editarMetodo = (metodo) => {
    return put("metodos/" + metodo.id, metodo);
}