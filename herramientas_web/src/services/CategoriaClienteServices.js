import {get, post, put} from './ApiServices';


export const getAllCategoriaClientes = () => {
    return get("categoriascliente/select")
}