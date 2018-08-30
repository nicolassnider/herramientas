<?php
require_once '../Security/Permisos.php';

class PermisosService
{
    public function getAll()
    {
        $permisos = Permisos::permisos;
        sort($permisos);
        return $permisos;
    }
}