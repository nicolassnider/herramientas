<?php

class Perfil implements JsonSerializable {
    private $id;
    private $nombre;
    private $permisos = [];

    public function getId(): ?int {
        return $this->id;
    }

    public function setId(?int $id) {
        $this->id = $id;
    }

    public function getNombre(): string {
        return $this->nombre;
    }

    public function setNombre(string $nombre) {
        $this->nombre = $nombre;
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
                'nombre' => $this->nombre,
                'permisos' => $this->permisos
            ];
    }
}