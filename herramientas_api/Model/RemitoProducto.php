<?php
/**
 * Created by PhpStorm.
 * User: nicol
 * Date: 13/08/2018
 * Time: 4:18 PM
 */

class RemitoProducto implements JsonSerializable
{

    private $id;
    private $remito;
    private $productoCatalogo;
    private $cantidad;
    private $precioUnitario;

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
    public function getRemito(): ?Remito
    {
        return $this->remito;
    }

    /**
     * @param mixed $remito
     */
    public function setRemito(?Remito $remito): void
    {
        $this->remito = $remito;
    }

    /**
     * @return mixed
     */
    public function getProductoCatalogo(): ?ProductoCatalogo
    {
        return $this->productoCatalogo;
    }

    /**
     * @param mixed $productoCatalogo
     */
    public function setProductoCatalogo(?ProductoCatalogo $productoCatalogo): void
    {
        $this->productoCatalogo = $productoCatalogo;
    }

    /**
     * @return mixed
     */
    public function getCantidad(): ?int
    {
        return $this->cantidad;
    }

    /**
     * @param mixed $cantidad
     */
    public function setCantidad(?int $cantidad): void
    {
        $this->cantidad = $cantidad;
    }

    /**
     * @return mixed
     */
    public function getPrecioUnitario(): ?float

    {
        return $this->precioUnitario;
    }

    /**
     * @param mixed $precioUnitario
     */
    public function setPrecioUnitario(?float $precioUnitario): void
    {
        $this->precioUnitario = $precioUnitario;
    }



    public function jsonSerialize()
    {
        $array = Array();
        if (isset($this->id)) $array['id'] = $this->id;
        if (isset($this->remito)) $array['remito'] = $this->remito;
        if (isset($this->productoCatalogo)) $array['productoCatalogo'] = $this->productoCatalogo;
        if (isset($this->cantidad)) $array['cantidad'] = $this->cantidad;
        if (isset($this->precioUnitario)) $array['precioUnitario'] = $this->precioUnitario;
        return $array;
    }
}