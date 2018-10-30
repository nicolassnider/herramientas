import {get, post, put, remove} from './ApiServices';
//import * as storage from '../utils/Storage';

export const grillaUsuarios = () => {
    return get("usuarios/");
};

export const getUsuarioPorId = (id) => {
    return get("usuarios/" + id);

};


