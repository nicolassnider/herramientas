import {get, post, put} from './ApiServices';

export const grillaLaboratorios = () => {
    return get("laboratorios/grilla");
}

export const getAllLaboratorios = () => {
    return get("laboratorios");
}

export const getLaboratorioPorId = (id) => {
    return get("laboratorios/"+id);
}

export const nuevoLaboratorio = (laboratorio) => {
    return post("laboratorios", laboratorio);
}

export const editarLaboratorio = (laboratorio) => {
    return put("laboratorios/"+laboratorio.id, laboratorio);
}