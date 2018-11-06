<?php
/**
 * Created by PhpStorm.
 * User: nicol
 * Date: 13/08/2018
 * Time: 4:20 PM
 */

class Catalogo implements JsonSerializable
{
    public $id;
    public $descripcion;
    public $observaciones;
    public $activo;

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
    public function getObservaciones():?string
    {
        return $this->observaciones;
    }

    /**
     * @param mixed $observaciones
     */
    public function setObservaciones(?string $observaciones): void
    {
        $this->observaciones = $observaciones;
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
        $array=Array();
        if(isset($this->id)) $array['id'] = $this->id;
        if(isset($this->fecha_inicio)) $array['descripcion'] = $this->descripcion;
        if(isset($this->fecha_fin)) $array['observaciones'] = $this->observaciones;
        if(isset($this->activo)) $array['activo'] = $this->activo;
        return $array;
    }
}