<?php
/**
 * Created by PhpStorm.
 * User: nicol
 * Date: 13/08/2018
 * Time: 4:16 PM
 */

class Revendedora implements JsonSerializable
{
    private $id;
    private $categoriaRevendedora;
    private $fechaAltaRevendedora;
    private $activo;

    public function jsonSerialize()
    {
        // TODO: Implement jsonSerialize() method.
    }
}