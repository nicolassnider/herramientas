<?php

class Archivo implements JsonSerializable
{
    private $nombre;
    private $contenido;
    private $tipo;

    public function getNombre(): String
    {
        return $this->nombre;
    }

    public function setNombre(String $nombre): void
    {
        $this->nombre = $nombre;
    }

    public function getContenido()
    {
        return $this->contenido;
    }

    public function setContenido($contenido): void
    {
        $this->contenido = $contenido;
    }

    public function getTipo(): String
    {
        return $this->tipo;
    }

    public function setTipo(String $tipo): void
    {
        $this->tipo = $tipo;
    }

    public function jsonSerialize(): array
    {
        return
            [
                'nombre' => $this->nombre,
                'contenido' => $this->contenido,
                'tipo' => $this->tipo
            ];
    }
}
