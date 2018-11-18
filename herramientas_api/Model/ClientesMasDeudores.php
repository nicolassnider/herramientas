<?php
/**
 * Created by PhpStorm.
 * User: nicol
 * Date: 10/11/2018
 * Time: 6:33 PM
 */

class ClientesMasDeudores
{
    private $nombre;
    private $apellido;
    private $deuda;

    /**
     * @return mixed
     */
    public function getNombre(): ?string
    {
        return $this->nombre;
    }

    /**
     * @param mixed $nombre
     */
    public function setNombre(?string $nombre): void
    {
        $this->nombre = $nombre;
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
    public function getDeuda(): float
    {
        return $this->deuda;
    }

    /**
     * @param mixed $deuda
     */
    public function setDeuda(?float $deuda): void
    {
        $this->deuda = $deuda;
    }


}