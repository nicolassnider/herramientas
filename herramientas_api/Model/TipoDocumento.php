<?php
/**
 * Created by Nicolás Snider
 * Date: 01/07/2018
 * Time: 12:43 AM
 */
class TipoDocumento implements JsonSerializable
{
    private $id;
    private $descripcion;

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
    public function setId(?int $id)
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
    public function setDescripcion(?string $descripcion)
    {
        $this->descripcion = $descripcion;
    }

    public function jsonSerialize()
    {
        $array=Array();
        if(isset($this->id)) $array['id'] = $this->id;
        if(isset($this->descripcion)) $array['descripcion'] = $this->descripcion;
        return $array;

    }


}