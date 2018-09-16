<?php
/**
 * Created by PhpStorm.
 * User: nicol
 * Date: 13/08/2018
 * Time: 4:21 PM
 */

class Campania implements JsonSerializable
{
    private $id;
    private $fecha_inicio;
    private $fecha_fin;
    private $descripcion;
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
    public function getFechaInicio():?DateTime
    {
        return $this->fecha_inicio;
    }

    /**
     * @param mixed $fecha_inicio
     */
    public function setFechaInicio(?DateTime $fecha_inicio): void
    {
        $this->fecha_inicio = $fecha_inicio;
    }

    /**
     * @return mixed
     */
    public function getFechaFin():?DateTime
    {
        return $this->fecha_fin;
    }

    /**
     * @param mixed $fecha_fin
     */
    public function setFechaFin(?DateTime $fecha_fin): void
    {
        $this->fecha_fin = $fecha_fin;
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
        if(isset($this->fecha_inicio)) $array['fecha_inicio'] = $this->fecha_inicio;
        if(isset($this->fecha_fin)) $array['fecha_fin'] = $this->fecha_fin;
        if(isset($this->descripcion)) $array['descripcion'] = $this->descripcion;
        if(isset($this->activo)) $array['activo'] = $this->activo;
        return $array;
    }

}