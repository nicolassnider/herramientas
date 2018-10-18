import {get} from './ApiServices';

export const obtenerPresentacion = (idSerie) => {
    return get("presentaciones/serie/" + idSerie);
} 