<?php
/**
 * Created by PhpStorm.
 * User: nicol
 * Date: 13/08/2018
 * Time: 4:18 PM
 */

class Cliente implements JsonSerializable
{

    private $id;
    private $categoriaCliente;
    private $direccionEntrega;
    private $ubicacion;
    private $fechaAltaCliente;
    private $fechaBajaCliente;
    private $anioNacimiento;
    private $madre;
    private $apodo;
    private $persona;
    private $activo;
    private $revendedora;

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
    public function getCategoriaCliente():?CategoriaCliente
    {
        return $this->categoriaCliente;
    }

    /**
     * @param mixed $categoriaCliente
     */
    public function setCategoriaCliente(?CategoriaCliente $categoriaCliente): void
    {
        $this->categoriaCliente = $categoriaCliente;
    }

    /**
     * @return mixed
     */
    public function getDireccionEntrega():?string
    {
        return $this->direccionEntrega;
    }

    /**
     * @param mixed $direccionEntrega
     */
    public function setDireccionEntrega(?string $direccionEntrega): void
    {
        $this->direccionEntrega = $direccionEntrega;
    }

    /**
     * @return mixed
     */
    public function getUbicacion():?string
    {
        return $this->ubicacion;
    }

    /**
     * @param mixed $ubicacion
     */
    public function setUbicacion(?string $ubicacion): void
    {
        $this->ubicacion = $ubicacion;
    }

    /**
     * @return mixed
     */
    public function getFechaAltaCliente():?DateTime
    {
        return $this->fechaAltaCliente;
    }

    /**
     * @param mixed $fechaAltaCliente
     */
    public function setFechaAltaCliente(?DateTime $fechaAltaCliente): void
    {
        $this->fechaAltaCliente = $fechaAltaCliente;
    }

    /**
     * @return mixed
     */
    public function getFechaBajaCliente():?DateTime
    {
        return $this->fechaBajaCliente;
    }

    /**
     * @param mixed $fechaBajaCliente
     */
    public function setFechaBajaCliente(?DateTime $fechaBajaCliente): void
    {
        $this->fechaBajaCliente = $fechaBajaCliente;
    }

    /**
     * @return mixed
     */
    public function getAnioNacimiento():?DateTime
    {
        return $this->anioNacimiento;
    }

    /**
     * @param mixed $anioNacimiento
     */
    public function setAnioNacimiento(?DateTime $anioNacimiento): void
    {
        $this->anioNacimiento = $anioNacimiento;
    }

    /**
     * @return mixed
     */
    public function getMadre():?bool
    {
        return $this->madre;
    }

    /**
     * @param mixed $madre
     */
    public function setMadre(?bool $madre): void
    {
        $this->madre = $madre;
    }

    /**
     * @return mixed
     */
    public function getApodo():?string
    {
        return $this->apodo;
    }

    /**
     * @param mixed $apodo
     */
    public function setApodo(?string $apodo): void
    {
        $this->apodo = $apodo;
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

    /**
     * @return mixed
     */
    public function getRevendedora():?Revendedora
    {
        return $this->revendedora;
    }

    /**
     * @param mixed $revendedora
     */
    public function setRevendedora(?Revendedora $revendedora): void
    {
        $this->revendedora = $revendedora;
    }



    public function jsonSerialize()
    {
        $array = Array();
        if (isset($this->id)) $array['id'] = $this->id;
        if (isset($this->categoriaCliente)) $array['categoriaCliente'] = $this->categoriaCliente;
        if (isset($this->direccionEntrega)) $array['direccionEntrega'] = $this->direccionEntrega;
        if (isset($this->ubicacion)) $array['ubicacion'] = $this->ubicacion;
        if (isset($this->fechaAltaCliente)) $array['fechaAltaCliente'] = $this->fechaAltaCliente;
        if (isset($this->fechaBajaCliente)) $array['fechaBajaCliente'] = $this->fechaBajaCliente;
        if (isset($this->anioNacimiento)) $array['anioNacimiento'] = $this->anioNacimiento;
        if (isset($this->madre)) $array['madre'] = $this->madre;
        if (isset($this->apodo)) $array['apodo'] = $this->apodo;
        if (isset($this->persona)) $array['persona'] = $this->persona;
        if (isset($this->activo)) $array['activo'] = $this->activo;
        if (isset($this->revendedora)) $array['revendedora'] = $this->revendedora;
        return $array;
    }


}