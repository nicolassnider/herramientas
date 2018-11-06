<?php
/**
 * Created by PhpStorm.
 * User: nicol
 * Date: 13/08/2018
 * Time: 4:16 PM
 */

class Remito implements JsonSerializable
{
    private $id;
    private $numeroRemito;
    private $factura;

    /**
     * @return mixed
     */
    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * @param mixed $id
     */
    public function setId(?int $id): void
    {
        $this->id = $id;
    }

    /**
     * @return mixed
     */
    public function getNumeroRemito(): ?string
    {
        return $this->numeroRemito;
    }

    /**
     * @param mixed $numeroRemito
     */
    public function setNumeroRemito(?string $numeroRemito): void
    {
        $this->numeroRemito = $numeroRemito;
    }

    /**
     * @return mixed
     */
    public function getFactura(): ?Factura
    {
        return $this->factura;
    }

    /**
     * @param mixed $factura
     */
    public function setFactura(?Factura $factura): void
    {
        $this->factura = $factura;
    }

    public function jsonSerialize()
    {
        $array = Array();
        if (isset($this->id)) $array['id'] = $this->id;
        if (isset($this->numeroRemito)) $array['numeroRemito'] = $this->numeroRemito;
        if (isset($this->factura)) $array['factura'] = $this->factura;

        return $array;
    }

}