<?php

class Usuario implements JsonSerializable{

    private $id;
    private $usuario;
    private $clave;
    private $claveActivacionCodigo;
    private $claveActivacionExpiracion;
    private $perfil;
    private $notificacionesActivas;
    private $movil;
    private $gerenciador;
    private $activo;
    private $token;
    private $tokenExpire;

    public function getId(): int{
        return $this->id;
    }
    public function setId(int $id): void{
        $this->id=$id;
    }

    public function getUsuario(): ?string{
        return $this->usuario;
    }
    public function setUsuario(?string $usuario): void{
        $this->usuario=$usuario;
    }

    public function getClave(): ?string{
        return $this->clave;
    }
    public function setClave(?string $clave){
        $this->clave=$clave;
    }

    public function getClaveActivacionCodigo(): ?string {
        return $this->claveActivacionCodigo;
    }

    public function setClaveActivacionCodigo(?string $claveActivacionCodigo) {
        $this->claveActivacionCodigo=$claveActivacionCodigo;
    }

    public function getClaveActivacionExpiracion(): ?string {
        return $this->claveActivacionExpiracion;
    }

    public function setClaveActivacionExpiracion(?string $claveActivacionExpiracion) {
        $this->claveActivacionExpiracion=$claveActivacionExpiracion;
    }

    public function getPerfil(): Perfil{
        return $this->perfil;
    }

    public function setPerfil(Perfil $perfil): void{
        $this->perfil = $perfil;
    }

    public function getNotificacionesActivas(): ?bool{
        return $this->notificacionesActivas;
    }

    public function setNotificacionesActivas(?bool $notificacionesActivas): void{
        $this->notificacionesActivas = $notificacionesActivas;
    }

    public function getMovil(): ?Movil{
        return $this->movil;
    }
    public function setMovil(?Movil $movil): void{
        $this->movil=$movil;
    }

    public function getGerenciador(): ?Gerenciador{
        return $this->gerenciador;
    }
    public function setGerenciador(?Gerenciador $gerenciador): void{
        $this->gerenciador=$gerenciador;
    }

    public function getActivo(){
        return $this->activo;
    }
    public function setActivo($activo){
        $this->activo=$activo;
    }

    public function getToken(): ?string {
        return $this->token;
    }

    public function setToken(?string $token){
        $this->token=$token;
    }

    public function getTokenExpire(): ?string {
        return $this->tokenExpire;
    }
    
    public function setTokenExpire(?string $tokenExpire){
        $this->tokenExpire=$tokenExpire;
    }

    public function jsonSerialize(): array {
        return [
            'id' => $this->id,
            'usuario' => $this->usuario,
            'perfil' => $this->perfil,
            'notificacionesActivas' => $this->notificacionesActivas,
            'movil' => $this->movil,
            'gerenciador' => $this->gerenciador,
            'activo' => $this->activo,
            'token' => $this->token,
            'tokenExpire' => $this->tokenExpire
        ];
    }
}