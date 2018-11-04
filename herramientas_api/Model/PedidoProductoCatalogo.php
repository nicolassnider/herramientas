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
    private $cliente;
    private $revendedora;
    private $precioUnitario;
    private $precioTotal;

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
    public function getPedidoAvon():?PedidoAvon
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
    public function getProductoCatalogo():?ProductoCatalogo
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
    public function getCantidad():?int
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



    public function jsonSerialize()
    {
        $array = Array();
        if (isset($this->id)) $array['id'] = $this->id;
        if (isset($this->pedidoAvon)) $array['pedidoAvon'] = $this->pedidoAvon;
        if (isset($this->productoCatalogo)) $array['productoCatalogo'] = $this->productoCatalogo;
        if (isset($this->cantidad)) $array['cantidad'] = $this->cantidad;
        if (isset($this->recibido)) $array['recibido'] = $this->recibido;
        if (isset($this->cliente)) $array['cliente'] = $this->cliente;
        if (isset($this->cliente)) $array['revendedora'] = $this->revendedora;


        return $array;
    }

}