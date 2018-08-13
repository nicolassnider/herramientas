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
    private $categoriaProducto;
    private $precio;
    private $campania;
    private $unidad;

    public function jsonSerialize()
    {
        // TODO: Implement jsonSerialize() method.
    }
}