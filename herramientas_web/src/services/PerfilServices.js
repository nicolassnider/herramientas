import {get, post, put, remove} from './ApiServices';
//import * as storage from '../utils/Storage';

export const selectPerfiles = () => {
    return get("perfiles/select");
};
