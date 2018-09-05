<?php

class UsuariosService {
    public function __construct() {
    }

    public function hasPermission(Usuario $usuario, string $permiso): bool {
        $persmisosUsuario = $usuario->getPerfil()->getPermisos();
		return in_array($permiso, $persmisosUsuario);
    }
}