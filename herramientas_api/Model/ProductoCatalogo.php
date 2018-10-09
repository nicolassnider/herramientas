<?php
/**
 * Created by PhpStorm.
 * User: nicol
 * Date: 09/10/2018
 * Time: 12:54 PM
 */

class ProductoCatalogo implements JsonSerializable
{

    private $id;
    private $producto;
    private $catalogo;
    private $precio;
    private $activo;

    /**
     * @return mixed
     */
    public function getId():?int
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
    public function getProducto():?Producto
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
    public function getCatalogo():?Catalogo
    {
        return $this->catalogo;
    }

    /**
     * @param mixed $catalogo
     */
    public function setCatalogo(?Catalogo $catalogo): void
    {
        $this->catalogo = $catalogo;
    }

    /**
     * @return mixed
     */
    public function getPrecio():?float
    {
        return $this->precio;
    }

    /**
     * @param mixed $precio
     */
    public function setPrecio(?float $precio): void
    {
        $this->precio = $precio;
    }

    /**
     * @return mixed
     */
    public function getActivo():?bool
    {
        return $this->activo;
    }

    /**
     * @param mixed $activo
     */
    public function setActivo(?bool $activo): void
    {
        $this->activo = $activo;
    }



    public function jsonSerialize()
    {
        $array = Array();
        if (isset($this->id)) $array['id'] = $this->id;
        if (isset($this->producto)) $array['producto'] = $this->producto;
        if (isset($this->catalogo)) $array['catalogo'] = $this->catalogo;
        if (isset($this->precio)) $array['precio'] = $this->precio;
        if (isset($this->activo)) $array['activo'] = $this->activo;
        return $array;
    }
}