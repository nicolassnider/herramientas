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
    private $esUsuario;
    private $usuario;

    /**
     * @return mixed
     */
    public function getEsUsuario() :?bool
    {
        return $this->esUsuario;
    }

    /**
     * @param mixed $esUsuario
     */
    public function setEsUsuario(?bool $esUsuario): void
    {
        $this->esUsuario = $esUsuario;
    }


    /**
     * @return mixed
     */
    public function getUsuario(): ?Usuario
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
    public function getId(): ?int
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
    public function getTipoDocumento(): ?TipoDocumento
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
    public function getDocumento(): ?string
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
    public function getTelefono(): ?string
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
    public function getEmail(): ?string
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
    public function getActivo(): ?bool
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
    public function getLocalidad(): ?Localidad
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
    public function getNombreSegundo(): ?string
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
    public function getApellido(): ?string
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
    public function getApellidoSegundo(): ?string
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
    public function getFechaAltaPersona(): ?DateTime
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
        $array = Array();
        if(isset($this->id)) $array['id'] = $this->id;
        if(isset($this->tipoDocumento)) $array['tipoDocumento'] = $this->tipoDocumento;
        if(isset($this->documento)) $array['documento'] = $this->documento;
        if(isset($this->nombre)) $array['nombre'] = $this->nombre;
        if(isset($this->nombreSegundo)) $array['nombreSegundo'] = $this->nombreSegundo;
        if(isset($this->apellido)) $array['apellido'] = $this->apellido;
        if(isset($this->apellidoSegundo)) $array['apellidoSegundo'] = $this->apellidoSegundo;
        if(isset($this->telefono)) $array['telefono'] = $this->telefono;
        if(isset($this->email)) $array['email'] = $this->email;
        if(isset($this->activo)) $array['activo'] = $this->activo;
        if(isset($this->localidad)) $array['localidad'] = $this->localidad;
        if(isset($this->fechaAltaPersona)) $array['fechaAltaPersona'] = $this->fechaAltaPersona;
        if(isset($this->esUsuario)) $array['esUsuario'] = $this->esUsuario;
        if(isset($this->fechaBajaPersona)) $array['fechaAltaPersona'] = $this->fechaBajaPersona;
        if(isset($this->usuario)) $array['usuario'] = $this->usuario;
        return $array;


    }
}