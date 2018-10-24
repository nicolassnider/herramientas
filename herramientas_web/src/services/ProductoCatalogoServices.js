import {get, post, put, remove} from './ApiServices';
//import * as storage from '../utils/Storage';


export const getCatalogosPorProductoPorId = (id) => {
    return get("productocatalogos/catalogosporproducto/" + id);

};
