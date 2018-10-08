<?php
/**
 * Created by PhpStorm.
 * User: nicol
 * Date: 07/10/2018
 * Time: 2:45 PM
 */

class CatalogoCampania implements JsonSerializable
{

    public $id;
    public $catalogo;
    public $campania;
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
    public function getCatalogo():?Catalogo
    {
        return $this->catalogo;
    }

    /**
     * @param mixed $catalogo
     */
    public function setCatalogo(?Catalogo $catalogo): void
    {
        $this->catalogo = $catalogo;
    }

    /**
     * @return mixed
     */
    public function getCampania():?Campania
    {
        return $this->campania;
    }

    /**
     * @param mixed $campania
     */
    public function setCampania(?Campania $campania): void
    {
        $this->campania = $campania;
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
        if(isset($this->catalogo)) $array['catalogo']=$this->catalogo;
        if(isset($this->campania)) $array['campania']=$this->campania;
        if(isset($this->activo)) $array['activo'] = $this->activo;
        return $array;
    }

}