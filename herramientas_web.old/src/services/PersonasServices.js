import {get, post, put, postFile, getFile} from './ApiServices';

//import * as storage from '../utils/Storage';

export const grillaPersonas = () => {
  return get("personas/grilla");
}

export const getPersonaPorId = (id) => {
  return get("personas/"+id);
}

export const nuevaPersona = (persona) => {
  return post("personas", persona);
}

export const editarPersona = (persona) => {
  return put("personas/"+persona.id, persona);
}

export const activarPersona = (persona) => {
  return put("personas/activar/"+persona.id, persona);
}

export const desactivarPersona = (persona) => {
  return put("personas/desactivar/"+persona.id, persona);
}
