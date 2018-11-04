import {get, post, put} from './ApiServices';


export const getAllCategoriaProductos = () => {
    return get("categoriasproducto/select")
}

export const getTotalCategoriaProductos = () => {
    return get("categoriasproducto")
};

export const getCategoriaProductoPorId = (id) => {
    return get("categoriasproducto/" + id);

};
export const editarCategoriaProducto = (categoriaProducto) => {
    return put("categoriasproducto/" + categoriaProducto.id, categoriaProducto);
};

export const nuevoCategoriaProducto = (categoriaProducto) => {
    return post("categoriasproducto", categoriaProducto);
};

