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
    private $cliente;
    private $revendedora;
    private $fechaAlta;
    private $fechaRecibido;
    private $recibido;
    private $entregado;
    private $cobrado;

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
    public function getCliente():?int
    {
        return $this->cliente;
    }

    /**
     * @param mixed $cliente
     */
    public function setCliente(?int $cliente): void
    {
        $this->cliente = $cliente;
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

    /**
     * @return mixed
     */
    public function getFechaAlta():?DateTime
    {
        return $this->fechaAlta;
    }

    /**
     * @param mixed $fechaAlta
     */
    public function setFechaAlta(?DateTime $fechaAlta): void
    {
        $this->fechaAlta = $fechaAlta;
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




    public function jsonSerialize()
    {
        $array = Array();
        if (isset($this->id)) $array['id'] = $this->id;
        if (isset($this->cliente)) $array['cliente'] = $this->cliente;
        if (isset($this->revendedora)) $array['revendedora'] = $this->revendedora;
        if (isset($this->fechaAlta)) $array['fechaAlta'] = $this->fechaAlta;
        if (isset($this->fechaRecibido)) $array['fechaRecibido'] = $this->fechaRecibido;
        if (isset($this->recibido)) $array['recibido'] = $this->recibido;
        if (isset($this->entregado)) $array['entregado'] = $this->entregado;
        if (isset($this->cobrado)) $array['cobrado'] = $this->cobrado;
        return $array;
    }


}