import {getUser} from './Storage';

export const hasPermission = (permission) => {
    return this.hasAllPermissions([permission]);
}

export const hasAnyPermission = (permissions) => {
    let hasAnyPermission = false;
    let user = getUser();
    if (user && user.perfil && user.perfil.permisos) {
        let permisos = user.perfil.permisos;
        hasAnyPermission = permissions.some(p => permisos.indexOf(p) >= 0);
    }
    return hasAnyPermission;
}

export const hasAllPermissions = (permissions) => {
    let hasAllPermissions = false;
    let user = getUser();
    if (user && user.perfil && user.perfil.permisos) {
        let permisos = user.perfil.permisos;
        hasAllPermissions = permissions.every(p => permisos.indexOf(p) >= 0);
    }
    return hasAllPermissions;
}