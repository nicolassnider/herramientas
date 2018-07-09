<?php

require_once '../Commons/Exceptions/ForbidenException.php';
require_once '../Repository/UsuarioRepository.php';

class ValidatePermissionsMiddleware {
	private $permisos;

	public function __construct(array $permisos = []) {
		$this->permisos = $permisos;
    }

	public function __invoke($req, $res, $next) {
		$token = $req->getHeader('Authorization-Token')[0];

		$usuario = (new UsuarioRepository())->getByToken($token);
		$persmisosUsuario = $usuario->getPerfil()->getPermisos();

		$hasPermission = false;
		foreach($this->permisos as $permiso) {
			if(in_array($permiso, $persmisosUsuario)) {
				$hasPermission = true;
				break;
			}
		}

		if($hasPermission) {
			return $next($req, $res);
		} else {
			throw new ForbidenException(new ApiError(4030, ['Necesita poseer alguno de los siguientes permisos: ' . implode(', ', $this->permisos)]));
		}
	}
}