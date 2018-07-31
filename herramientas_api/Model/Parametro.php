<?php

class Parametro implements JsonSerializable
{
    private $parametro;
    private $descripcion;
    private $valor;

    public function getParametro(): ?string
    {
        return $this->parametro;
    }

    public function setParametro(?string $parametro): void
    {
        $this->parametro = $parametro;
    }

    public function getDescripcion(): ?string
    {
        return $this->descripcion;
    }

    public function setDescripcion(?string $descripcion)
    {
        $this->descripcion=$descripcion;
    }

    public function getValor(): ?string
    {
        return $this->valor;
    }

    public function setValor(?string $valor)
    {
        $this->valor=$valor;
    }

    public function jsonSerialize(): array
    {
        return
        [
            'parametro'=>$this->parametro,
            'descripcion'=>$this->descripcion,
            'valor'=>$this->valor
        ];
    }

}