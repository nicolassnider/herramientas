import {get, post, put} from './ApiServices';

export const grillaDeterminaciones = () => {
    return get("determinaciones/grilla");
}

export const getDeterminacionPorId = (id) => {
    return get("determinaciones/" + id);
}

export const nuevaDeterminacion = (determinacion) => {
    return post("determinaciones", determinacion);
}

export const editarDeterminacion = (determinacion) => {
    return put("determinaciones/" + determinacion.id, determinacion);
}

export const getAllDeterminaciones = () => {
    return get("determinaciones")
}