<?php
/**
 * Created by PhpStorm.
 * User: nicol
 * Date: 13/08/2018
 * Time: 4:18 PM
 */

class PedidoAvon implements JsonSerializable
{

    private $id;
    private $fechaRecibido;
    private $recibido;
    private $entregado;
    private $cobrado;
    private $campania;

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
    public function getFechaRecibido():?DateTime
    {
        return $this->fechaRecibido;
    }

    /**
     * @param mixed $fechaRecibido
     */
    public function setFechaRecibido(?DateTime $fechaRecibido): void
    {
        $this->fechaRecibido = $fechaRecibido;
    }

    /**
     * @return mixed
     */
    public function getRecibido():?bool
    {
        return $this->recibido;
    }

    /**
     * @param mixed $recibido
     */
    public function setRecibido(?bool $recibido): void
    {
        $this->recibido = $recibido;
    }

    /**
     * @return mixed
     */
    public function getEntregado():?bool
    {
        return $this->entregado;
    }

    /**
     * @param mixed $entregado
     */
    public function setEntregado(?bool $entregado): void
    {
        $this->entregado = $entregado;
    }

    /**
     * @return mixed
     */
    public function getCobrado():?bool
    {
        return $this->cobrado;
    }

    /**
     * @param mixed $cobrado
     */
    public function setCobrado(?bool $cobrado): void
    {
        $this->cobrado = $cobrado;
    }

    /**
     * @return mixed
     */
    public function getCampania(): ?bool
    {
        return $this->campania;
    }

    /**
     * @param mixed $campania
     */
    public function setCampania(?Campania $campania): Campania
    {
        $this->campania = $campania;
    }





    public function jsonSerialize()
    {
        $array = Array();
        if (isset($this->id)) $array['id'] = $this->id;
        if (isset($this->fechaRecibido)) $array['fechaRecibido'] = $this->fechaRecibido->format('Y-m-d');
        if (isset($this->recibido)) $array['recibido'] = $this->recibido;
        if (isset($this->entregado)) $array['entregado'] = $this->entregado;
        if (isset($this->cobrado)) $array['cobrado'] = $this->cobrado;
        if (isset($this->campania)) $array['campania'] = $this->campania;
        return $array;
    }


}