<?php

class Perfil implements JsonSerializable {
    private $id;
    private $descripcion;
    private $permisos = [];

    public function getId(): ?int {
        return $this->id;
    }

    public function setId(?int $id) {
        $this->id = $id;
    }

    public function getDescripcion(): string {
        return $this->descripcion;
    }

    public function setDescripcion(string $descripcion) {
        $this->descripcion = $descripcion;
    }

    public function getPermisos(): array {
        return $this->permisos;
    }

    public function setPermisos(array $permisos) {
        $this->permisos = $permisos;
    }

    public function jsonSerialize(): array {
        return
            [
                'id' => $this->id,
                'descripcion' => $this->descripcion,
                'permisos' => $this->permisos
            ];
    }
}