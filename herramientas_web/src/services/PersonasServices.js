import {get, post, put} from './ApiServices';

export const grillaPersonas = () => {
  return get("personas/grilla");
}

export const getAllPersonas = () => {
  return get("personas");
}

export const getPersonaPorId = (id) => {
  return get("personas/"+id);
}

export const nuevoPersona = (persona) => {
  return post("personas", persona);
}

export const editarPersona = (persona) => {
  return put("personas/"+persona.id, persona);
}
