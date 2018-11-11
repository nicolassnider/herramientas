<?php
/**
 * Created by PhpStorm.
 * User: nicol
 * Date: 10/11/2018
 * Time: 6:33 PM
 */

class ComparaPedidoRemito
{
    private $cantidad;
    private $productoId;

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
    public function getProductoId(): ?int
    {
        return $this->productoId;
    }

    /**
     * @param mixed $productoId
     */
    public function setProductoId(?int $productoId): void
    {
        $this->productoId = $productoId;
    }


}