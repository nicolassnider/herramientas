<?php

class ProductosMasVendidos implements JsonSerializable
{
    private $producto;
    private $cantidad;

    /**
     * @return mixed
     */
    public function getProducto(): ?Producto
    {
        return $this->producto;
    }

    /**
     * @param mixed $producto
     */
    public function setProducto(?Producto $producto): void
    {
        $this->producto = $producto;
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


    public function jsonSerialize()
    {
        $array = Array();
        if (isset($this->producto)) $array['producto'] = $this->producto;
        if (isset($this->cantidad)) $array['cantidad'] = $this->cantidad;


        return $array;
    }
}