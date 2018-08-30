<?php
/**
 * Created by PhpStorm.
 * User: nicol
 * Date: 13/08/2018
 * Time: 4:18 PM
 */

class Localidad implements JsonSerializable {
    private $id;
    private $descripcion;
    private $provincia;
    private $codigoPostal;

    /**
     * @return mixed
     */
    public function getCodigoPostal()
    {
        return $this->codigoPostal;
    }

    /**
     * @param mixed $codigoPostal
     */
    public function setCodigoPostal($codigoPostal): void
    {
        $this->codigoPostal = $codigoPostal;
    }

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

    public function getProvincia(): ?Provincia {
        return $this->provincia;
    }

    public function setProvincia(?Provincia $provincia): void {
        $this->provincia = $provincia;
    }

    public function jsonSerialize() {
        return [
            'id' => $this->id,
            'descripcion' => $this->descripcion,
            'provincia' => $this->provincia
        ];
    }
}