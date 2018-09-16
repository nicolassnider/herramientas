<?php

class Usuario implements JsonSerializable
{

    private $id;
    private $revendedora;
    private $usuario;
    private $clave;
    private $claveActivacionCodigo;
    private $claveActivacionExpiracion;
    private $perfil;
    private $notificacionesActivas;
    private $activo;
    private $token;
    private $tokenExpire;

    public function getId(): int
    {
        return $this->id;
    }

    public function setId(int $id): void
    {
        $this->id = $id;
    }

    /**
     * @return mixed
     */
    public function getRevendedora():int
    {
        return $this->revendedora;
    }

    /**
     * @param mixed $revendedora
     */
    public function setRevendedora(?int $revendedora): void
    {
        $this->revendedora = $revendedora;
    }



    public function getUsuario(): ?string
    {
        return $this->usuario;
    }

    public function setUsuario(?string $usuario): void
    {
        $this->usuario = $usuario;
    }

    public function getClave(): ?string
    {
        return $this->clave;
    }

    public function setClave(?string $clave)
    {
        $this->clave = $clave;
    }

    public function getClaveActivacionCodigo(): ?string
    {
        return $this->claveActivacionCodigo;
    }

    public function setClaveActivacionCodigo(?string $claveActivacionCodigo)
    {
        $this->claveActivacionCodigo = $claveActivacionCodigo;
    }

    public function getClaveActivacionExpiracion(): ?string
    {
        return $this->claveActivacionExpiracion;
    }

    public function setClaveActivacionExpiracion(?string $claveActivacionExpiracion)
    {
        $this->claveActivacionExpiracion = $claveActivacionExpiracion;
    }

    public function getPerfil(): Perfil
    {
        return $this->perfil;
    }

    public function setPerfil(Perfil $perfil): void
    {
        $this->perfil = $perfil;
    }

    public function getNotificacionesActivas(): ?bool
    {
        return $this->notificacionesActivas;
    }

    public function setNotificacionesActivas(?bool $notificacionesActivas): void
    {
        $this->notificacionesActivas = $notificacionesActivas;
    }


    public function getActivo()
    {
        return $this->activo;
    }

    public function setActivo($activo)
    {
        $this->activo = $activo;
    }

    public function getToken(): ?string
    {
        return $this->token;
    }

    public function setToken(?string $token)
    {
        $this->token = $token;
    }

    public function getTokenExpire(): ?string
    {
        return $this->tokenExpire;
    }

    public function setTokenExpire(?string $tokenExpire)
    {
        $this->tokenExpire = $tokenExpire;
    }

    public function jsonSerialize(): Array
    {
        $array = Array();
        if(isset($this->id)) $array['id'] = $this->id;
        if(isset($this->revendedora)) $array['revendedora'] = $this->revendedora;
        if(isset($this->usuario)) $array['usuario'] = $this->usuario;
        if(isset($this->clave)) $array['clave'] = $this->clave;
        if(isset($this->claveActivacionCodigo)) $array['claveActivacionCodigo'] = $this->claveActivacionCodigo;
        if(isset($this->claveActivacionExpiracion)) $array['claveActivacionExpiracion'] = $this->claveActivacionExpiracion;
        if(isset($this->perfil)) $array['perfil'] = $this->perfil;
        if(isset($this->notificacionesActivas)) $array['notificacionesActivas'] = $this->notificacionesActivas;
        if(isset($this->token)) $array['token'] = $this->token;


        return $array;
    }
}