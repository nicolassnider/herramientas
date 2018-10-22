import {get, post, put} from './ApiServices';

export const getAllCategoriaRevendedoras = () => {
    return get("categoriasrevendedora/select")
}