<?php
/**
 * Created by PhpStorm.
 * User: nicol
 * Date: 10/11/2018
 * Time: 6:33 PM
 */

class ConsumoClientes
{
    private $pedido_avon;
    private $idCliente;
    private $nombre;
    private $apellido;
    private $idProducto;
    private $descripcion;
    private $consumo;

    /**
     * @return mixed
     */
    public function getPedidoAvon()
    {
        return $this->pedido_avon;
    }

    /**
     * @param mixed $pedido_avon
     */
    public function setPedidoAvon($pedido_avon): void
    {
        $this->pedido_avon = $pedido_avon;
    }

    /**
     * @return mixed
     */
    public function getIdCliente()
    {
        return $this->idCliente;
    }

    /**
     * @param mixed $idCliente
     */
    public function setIdCliente($idCliente): void
    {
        $this->idCliente = $idCliente;
    }

    /**
     * @return mixed
     */
    public function getIdProducto()
    {
        return $this->idProducto;
    }

    /**
     * @param mixed $idProducto
     */
    public function setIdProducto($idProducto): void
    {
        $this->idProducto = $idProducto;
    }

    /**
     * @return mixed
     */
    public function getDescripcion()
    {
        return $this->descripcion;
    }

    /**
     * @param mixed $descripcion
     */
    public function setDescripcion($descripcion): void
    {
        $this->descripcion = $descripcion;
    }

    /**
     * @return mixed
     */
    public function getConsumo()
    {
        return $this->consumo;
    }

    /**
     * @param mixed $consumo
     */
    public function setConsumo($consumo): void
    {
        $this->consumo = $consumo;
    }


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


}