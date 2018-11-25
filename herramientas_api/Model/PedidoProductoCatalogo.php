<?php
/**
 * Created by PhpStorm.
 * User: nicol
 * Date: 09/10/2018
 * Time: 1:00 PM
 */

class PedidoProductoCatalogo implements JsonSerializable
{

    private $id;
    private $pedidoAvon;
    private $productoCatalogo;
    private $cantidad;
    private $recibido;
    private $entregado;
    private $cobrado;
    private $cliente;
    private $revendedora;
    private $precioUnitario;
    private $precioTotal;
    private $estadoCampania;
    private $saldo;

    /**
     * @return mixed
     */
    public function getSaldo(): ?float
    {
        return $this->saldo;
    }

    /**
     * @param mixed $saldo
     */
    public function setSaldo(?float $saldo): void
    {
        $this->saldo = $saldo;
    }


    /**
     * @return mixed
     */
    public function getCobrado(): ?bool
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
    public function getEntregado(): ?bool
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
    public function getEstadoCampania(): ?bool
    {
        return $this->estadoCampania;
    }

    /**
     * @param mixed $estadoCampania
     */
    public function setEstadoCampania(?bool $estadoCampania): void
    {
        $this->estadoCampania = $estadoCampania;
    }


    /**
     * @return mixed
     */
    public function getPrecioUnitario()
    {
        return $this->precioUnitario;
    }

    /**
     * @param mixed $precioUnitario
     */
    public function setPrecioUnitario($precioUnitario): void
    {
        $this->precioUnitario = $precioUnitario;
    }

    /**
     * @return mixed
     */
    public function getPrecioTotal()
    {
        return $this->precioTotal;
    }

    /**
     * @param mixed $precioTotal
     */
    public function setPrecioTotal($precioTotal): void
    {
        $this->precioTotal = $precioTotal;
    }


    /**
     * @return mixed
     */
    public function getCliente(): ?Cliente
    {
        return $this->cliente;
    }

    /**
     * @param mixed $cliente
     */
    public function setCliente(?Cliente $cliente): void
    {
        $this->cliente = $cliente;
    }

    /**
     * @return mixed
     */
    public function getRevendedora(): ?Revendedora
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
    public function getId(): ?int
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
    public function getPedidoAvon(): ?PedidoAvon
    {
        return $this->pedidoAvon;
    }

    /**
     * @param mixed $pedidoAvon
     */
    public function setPedidoAvon(?PedidoAvon $pedidoAvon): void
    {
        $this->pedidoAvon = $pedidoAvon;
    }

    /**
     * @return mixed
     */
    public function getProductoCatalogo(): ?ProductoCatalogo
    {
        return $this->productoCatalogo;
    }

    /**
     * @param mixed $productoCatalogo
     */
    public function setProductoCatalogo(?ProductoCatalogo $productoCatalogo): void
    {
        $this->productoCatalogo = $productoCatalogo;
    }

    /**
     * @return mixed
     */
    public function getCantidad(): ?int
    {
        return $this->cantidad;
    }

    /**
     * @param mixed $cantidad
     */
    public function setCantidad(?int $cantidad): void
    {
        $this->cantidad = $cantidad;
    }

    /**
     * @return mixed
     */
    public function getRecibido(): ?bool
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


    public function jsonSerialize()
    {
        $array = Array();
        if (isset($this->id)) $array['id'] = $this->id;
        if (isset($this->pedidoAvon)) $array['pedidoAvon'] = $this->pedidoAvon;
        if (isset($this->productoCatalogo)) $array['productoCatalogo'] = $this->productoCatalogo;
        if (isset($this->cantidad)) $array['cantidad'] = $this->cantidad;
        if (isset($this->recibido)) $array['recibido'] = $this->recibido;
        if (isset($this->entregado)) $array['entregado'] = $this->entregado;
        if (isset($this->cobrado)) $array['cobrado'] = $this->cobrado;
        if (isset($this->cliente)) $array['cliente'] = $this->cliente;
        if (isset($this->revendedora)) $array['revendedora'] = $this->revendedora;
        if (isset($this->estadoCampania)) $array['estadoCampania'] = $this->estadoCampania;
        if (isset($this->saldo)) $array['saldo'] = $this->saldo;


        return $array;
    }

}