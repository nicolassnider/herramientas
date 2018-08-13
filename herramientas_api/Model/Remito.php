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
    private $productos; //array de productos en remito

    public function jsonSerialize()
    {
        // TODO: Implement jsonSerialize() method.
    }


}