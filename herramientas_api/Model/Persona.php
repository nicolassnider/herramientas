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
    private $documento;
    private $telefono;
    private $email;
    private $activo;
    private $localidad;
    private $fechaAltaPersona;

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
    public function getTipoDocumento()
    {
        return $this->tipoDocumento;
    }

    /**
     * @param mixed $tipoDocumento
     */
    public function setTipoDocumento($tipoDocumento)
    {
        $this->tipoDocumento = $tipoDocumento;
    }

    /**
     * @return mixed
     */
    public function getDocumento()
    {
        return $this->documento;
    }

    /**
     * @param mixed $documento
     */
    public function setDocumento($documento)
    {
        $this->documento = $documento;
    }

    /**
     * @return mixed
     */
    public function getTelefono()
    {
        return $this->telefono;
    }

    /**
     * @param mixed $telefono
     */
    public function setTelefono($telefono)
    {
        $this->telefono = $telefono;
    }

    /**
     * @return mixed
     */
    public function getEmail()
    {
        return $this->email;
    }

    /**
     * @param mixed $email
     */
    public function setEmail($email)
    {
        $this->email = $email;
    }

    /**
     * @return mixed
     */
    public function getActivo()
    {
        return $this->activo;
    }

    /**
     * @param mixed $activo
     */
    public function setActivo($activo)
    {
        $this->activo = $activo;
    }

    /**
     * @return mixed
     */
    public function getLocalidad()
    {
        return $this->localidad;
    }

    /**
     * @param mixed $localidad
     */
    public function setLocalidad($localidad)
    {
        $this->localidad = $localidad;
    }

    /**
     * @return mixed
     */
    public function getFechaAltaPersona()
    {
        return $this->fechaAltaPersona;
    }

    /**
     * @param mixed $fechaAltaPersona
     */
    public function setFechaAltaPersona($fechaAltaPersona)
    {
        $this->fechaAltaPersona = $fechaAltaPersona;
    }



    public function jsonSerialize()
    {
        return
        [
            'id'=>$this->id,
            'tipoDocumento'=>$this->tipoDocumento,
            'documento'=>$this->documento,
            'telefono'=>$this->telefono,
            'email'=>$this->email,
            'activo'=>$this->activo,
            'localidad'=>$this->localidad,
            'fechaAltaPersona'=>$this->fechaAltaPersona
        ];

    }
}