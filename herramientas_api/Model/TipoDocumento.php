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
    public function getId()
    {
        return $this->id;
    }

    /**
     * @param mixed $id
     */
    public function setId($id)
    {
        $this->id = $id;
    }

    /**
     * @return mixed
     */
    public function getDescripcion()
    {
        return $this->descripcion;
    }

    /**
     * @param mixed $descripcion
     */
    public function setDescripcion($descripcion)
    {
        $this->descripcion = $descripcion;
    }

    public function jsonSerialize()
    {
        return
            [
                'id' => $this->id,
                'descripcion' => $this->descripcion
            ];

    }


}