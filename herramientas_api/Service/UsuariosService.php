<?php
require_once '../Repository/UsuarioRepository.php';



class UsuariosService {

    private $repository;

    public function __construct() {
        $this->repository = new UsuarioRepository();
    }

    public function hasPermission(Usuario $usuario, string $permiso): bool {
        $persmisosUsuario = $usuario->getPerfil()->getPermisos();
		return in_array($permiso, $persmisosUsuario);
    }

    public function getAll(): Array
    {
        return $this->repository->getAll();
    }

    public function get(int $id): ?Usuario
    {

        return $this->repository->get($id);
    }
}