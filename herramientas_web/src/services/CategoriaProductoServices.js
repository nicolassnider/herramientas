import {get, post, put} from './ApiServices';


export const getAllCategoriaProductos = () => {
    return get("categoriasproducto/select")
}