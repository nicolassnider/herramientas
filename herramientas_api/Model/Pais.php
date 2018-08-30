<?php
/**
 * Created by PhpStorm.
 * User: nicol
 * Date: 13/08/2018
 * Time: 4:18 PM
 */

class Pais implements JsonSerializable {
    private $id;
    private $descripcion;

    public function getId(): ?int {
        return $this->id;
    }
    public function setId(?int $id): void {
        $this->id = $id;
    }

    public function getDescripcion(): ?string {
        return $this->descripcion;
    }

    public function setDescripcion(?string $descripcion): void {
        $this->descripcion = $descripcion;
    }

    public function jsonSerialize() {
        return [
            'id' => $this->id,
            'descripcion' => $this->descripcion,
        ];
    }
}