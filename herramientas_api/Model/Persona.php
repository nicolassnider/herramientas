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
    private $nombre;
    private $nombreSegundo;
    private $apellido;
    private $apellidoSegundo;
    private $fechaAltaPersona;

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
    public function getTipoDocumento():?TipoDocumento
    {
        return $this->tipoDocumento;
    }

    /**
     * @param mixed $tipoDocumento
     */
    public function setTipoDocumento(?TipoDocumento $tipoDocumento)
    {
        $this->tipoDocumento = $tipoDocumento;
    }

    /**
     * @return mixed
     */
    public function getDocumento():?string
    {
        return $this->documento;
    }

    /**
     * @param mixed $documento
     */
    public function setDocumento(?string $documento)
    {
        $this->documento = $documento;
    }

    /**
     * @return mixed
     */
    public function getTelefono():?string
    {
        return $this->telefono;
    }

    /**
     * @param mixed $telefono
     */
    public function setTelefono(?string $telefono)
    {
        $this->telefono = $telefono;
    }

    /**
     * @return mixed
     */
    public function getEmail():?string
    {
        return $this->email;
    }

    /**
     * @param mixed $email
     */
    public function setEmail(?string $email)
    {
        $this->email = $email;
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
    public function setActivo(?bool $activo)
    {
        $this->activo = $activo;
    }

    /**
     * @return mixed
     */
    public function getLocalidad():?Localidad
    {
        return $this->localidad;
    }

    /**
     * @param mixed $localidad
     */
    public function setLocalidad(?Localidad $localidad)
    {
        $this->localidad = $localidad;
    }

    /**
     * @return mixed
     */
    public function getNombre()
    {
        return $this->nombre;
    }

    /**
     * @param mixed $nombre
     */
    public function setNombre($nombre): void
    {
        $this->nombre = $nombre;
    }

    /**
     * @return mixed
     */
    public function getNombreSegundo():?string
    {
        return $this->nombreSegundo;
    }

    /**
     * @param mixed $nombreSegundo
     */
    public function setNombreSegundo(?string $nombreSegundo): void
    {
        $this->nombreSegundo = $nombreSegundo;
    }

    /**
     * @return mixed
     */
    public function getApellido():?string
    {
        return $this->apellido;
    }

    /**
     * @param mixed $apellido
     */
    public function setApellido(?string $apellido): void
    {
        $this->apellido = $apellido;
    }

    /**
     * @return mixed
     */
    public function getApellidoSegundo():?string
    {
        return $this->apellidoSegundo;
    }

    /**
     * @param mixed $apellidoSegundo
     */
    public function setApellidoSegundo(?string $apellidoSegundo): void
    {
        $this->apellidoSegundo = $apellidoSegundo;
    }



    /**
     * @return mixed
     */
    public function getFechaAltaPersona():?DateTime
    {
        return $this->fechaAltaPersona;
    }

    /**
     * @param mixed $fechaAltaPersona
     */
    public function setFechaAltaPersona(?DateTime $fechaAltaPersona)
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
            'localidad' => $this->localidad == null ? null : [
                'id' => $this->localidad->getId(),
                'descipcion' => $this->localidad->getDescipcion(),
                'provincia'=>$this->localidad->getProvincia()
            ],
            'nombre'=>$this->nombre,
            'nombreSegundo'=>$this->nombreSegundo,
            'apellido'=>$this->apellido,
            'apellidoSegundo'=>$this->apellidoSegundo,
            'fechaAltaPersona'=>$this->fechaAltaPersona,
        ];

    }
}