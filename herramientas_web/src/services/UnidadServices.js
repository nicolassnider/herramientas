import {get, post, put} from './ApiServices';


export const getAllUnidades = () => {
    return get("unidades/select")
}