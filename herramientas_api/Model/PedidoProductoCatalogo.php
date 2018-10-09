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
        return $array;
    }

}