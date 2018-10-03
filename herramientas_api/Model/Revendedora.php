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
    private $fechaBajaRevendedora;
    private $activo;
    private $persona;
    private $usuario;

    /**
     * @return mixed
     */
    public function getUsuario() :?Usuario
    {
        return $this->usuario;
    }

    /**
     * @param mixed $usuario
     */
    public function setUsuario(?Usuario $usuario): void
    {
        $this->usuario = $usuario;
    }



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
    public function getCategoriaRevendedora():?CategoriaRevendedora
    {
        return $this->categoriaRevendedora;
    }

    /**
     * @param mixed $categoriaRevendedora
     */
    public function setCategoriaRevendedora(?CategoriaRevendedora $categoriaRevendedora): void
    {
        $this->categoriaRevendedora = $categoriaRevendedora;
    }

    /**
     * @return mixed
     */
    public function getFechaAltaRevendedora():?DateTime
    {
        return $this->fechaAltaRevendedora;
    }

    /**
     * @param mixed $fechaAltaRevendedora
     */
    public function setFechaAltaRevendedora(?DateTime $fechaAltaRevendedora): void
    {
        $this->fechaAltaRevendedora = $fechaAltaRevendedora;
    }

    /**
     * @return mixed
     */
    public function getFechaBajaRevendedora():?DateTime
    {
        return $this->fechaBajaRevendedora;
    }

    /**
     * @param mixed $fechaBajaRevendedora
     */
    public function setFechaBajaRevendedora(?DateTime $fechaBajaRevendedora): void
    {
        $this->fechaBajaRevendedora = $fechaBajaRevendedora;
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
    public function setActivo(?bool  $activo): void
    {
        $this->activo = $activo;
    }

    /**
     * @return mixed
     */
    public function getPersona():?Persona
    {
        return $this->persona;
    }

    /**
     * @param mixed $persona
     */
    public function setPersona(?Persona $persona): void
    {
        $this->persona = $persona;
    }



    public function jsonSerialize()
    {
        $array = Array();
        if(isset($this->id)) $array['id'] = $this->id;
        if(isset($this->categoriaRevendedora)) $array['categoriaRevendedora'] = $this->categoriaRevendedora;
        if(isset($this->fechaAltaRevendedora)) $array['fechaAltaRevendedora'] = $this->fechaAltaRevendedora;
        if(isset($this->fechaBajaRevendedora)) $array['fechaBajaRevendedora'] = $this->fechaBajaRevendedora;
        if(isset($this->activo)) $array['activo'] = $this->activo;
        if(isset($this->persona)) $array['persona'] = $this->persona;
        if(isset($this->usuario))$array['usuario']=$this->usuario;
        return $array;
    }
}