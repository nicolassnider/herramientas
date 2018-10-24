<?php
/**
 * Created by PhpStorm.
 * User: nicol
 * Date: 13/08/2018
 * Time: 4:17 PM
 */

class Producto implements JsonSerializable
{
    private $id;
    private $descripcion;
    private $categoria;
    private $unidad;

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
    public function getDescripcion():?string
    {
        return $this->descripcion;
    }

    /**
     * @param mixed $descripcion
     */
    public function setDescripcion(?string $descripcion): void
    {
        $this->descripcion = $descripcion;
    }

    /**
     * @return mixed
     */
    public function getCategoria():?CategoriaProducto
    {
        return $this->categoria;
    }

    /**
     * @param mixed $categoria
     */
    public function setCategoria(?CategoriaProducto $categoria): void
    {
        $this->categoria = $categoria;
    }

    /**
     * @return mixed
     */
    public function getUnidad():?Unidad
    {
        return $this->unidad;
    }

    /**
     * @param mixed $unidad
     */
    public function setUnidad(?Unidad $unidad): void
    {
        $this->unidad = $unidad;
    }



    public function jsonSerialize()
    {
        $array = Array();
        if (isset($this->id)) $array['id'] = $this->id;
        if (isset($this->descripcion)) $array['descripcion'] = $this->descripcion;
        if (isset($this->categoria)) $array['categoria'] = $this->categoria;
        if (isset($this->unidad)) $array['unidad'] = $this->unidad;
        return $array;
    }
}