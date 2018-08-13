<?php
/**
 * Created by PhpStorm.
 * User: nicol
 * Date: 13/08/2018
 * Time: 4:17 PM
 */

class Provincia implements JsonSerializable
{
    private $id;
    private $descripcion;
    private $pais;

    public function jsonSerialize()
    {
        // TODO: Implement jsonSerialize() method.
    }

}