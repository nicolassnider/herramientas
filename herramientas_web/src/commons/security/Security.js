import Config from '../config/Config.js';

class Security {
	static logout() {
		fetch(Config.get('apiUrlBase') + '/auth/logout', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization-Token': localStorage.getItem("token")
			}
		}).finally(() => {
			localStorage.removeItem("token");
			localStorage.removeItem("persona");
			localStorage.removeItem("config");
			localStorage.removeItem("configBusiness");
			window.location.href = '';
		});
	}

	static hasPermission(permission) {
		return this.hasAllPermissions([permission]);
	}

	static hasAnyPermission(permissions) {
		let hasAnyPermission = false;
		let persona = JSON.parse(localStorage.getItem("persona"));
		if(persona && persona.usuario && persona.usuario.perfil && persona.usuario.perfil.permisos) {
			let permisos = persona.usuario.perfil.permisos;
			hasAnyPermission = permisos.some(p => permissions.indexOf(p) >= 0);
		}
		return hasAnyPermission;
	}

	static hasAllPermissions(permissions) {
		let hasAllPermissions = false;
		let persona = JSON.parse(localStorage.getItem("persona"));
		if(persona && persona.usuario && persona.usuario.perfil && persona.usuario.perfil.permisos) {
			let permisos = persona.usuario.perfil.permisos;
			hasAllPermissions = permissions.every(p => permisos.indexOf(p) >= 0);
		}
		return hasAllPermissions;
	}

	static renderIfHasPermission(permission, jsx) {
		return this.hasPermission(permission) ? jsx : '';
	}

	static renderIfHasAnyPermission(permissions, jsx) {
		return this.hasAnyPermission(permissions) ? jsx : '';
	}

	static renderIfHasAllPermissions(permissions, jsx) {
		return this.hasAllPermissions(permissions) ? jsx : '';
	}
}

export default Security;