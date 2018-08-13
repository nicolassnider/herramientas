<?php
/**
 * Created by Nicolás Snider
 * Date: 01/07/2018
 * Time: 12:42 AM
 */

class Persona implements JsonSerializable
{

    private $id;
    private $tipoDocumento;

    public function jsonSerialize()
    {
        // TODO: Implement jsonSerialize() method.
    }
}