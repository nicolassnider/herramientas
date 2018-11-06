<?php
/**
 * Created by PhpStorm.
 * User: nicol
 * Date: 13/08/2018
 * Time: 4:18 PM
 */

class Factura implements JsonSerializable
{

    private $id;
    private $total;
    private $fechaVencimiento;
    private $campania;
    private $pagado;
    private $nroFactura;

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
    public function getTotal():?float
    {
        return $this->total;
    }

    /**
     * @param mixed $total
     */
    public function setTotal(?float $total): void
    {
        $this->total = $total;
    }

    /**
     * @return mixed
     */
    public function getFechaVencimiento():?DateTime
    {
        return $this->fechaVencimiento;
    }

    /**
     * @param mixed $fechaVencimiento
     */
    public function setFechaVencimiento(?DateTime $fechaVencimiento): void
    {
        $this->fechaVencimiento = $fechaVencimiento;
    }

    /**
     * @return mixed
     */
    public function getCampania():?Campania
    {
        return $this->campania;
    }

    /**
     * @param mixed $campania
     */
    public function setCampania(Campania $campania): void
    {
        $this->campania = $campania;
    }

    /**
     * @return mixed
     */
    public function getPagado():?bool
    {
        return $this->pagado;
    }

    /**
     * @param mixed $pagado
     */
    public function setPagado(?bool $pagado): void
    {
        $this->pagado = $pagado;
    }

    /**
     * @return mixed
     */
    public function getNroFactura():?string
    {
        return $this->nroFactura;
    }

    /**
     * @param mixed $nroFactura
     */
    public function setNroFactura(?string $nroFactura): void
    {
        $this->nroFactura = $nroFactura;
    }


    public function jsonSerialize()
    {
        $array = Array();
        if (isset($this->id)) $array['id'] = $this->id;
        if (isset($this->total)) $array['total'] = $this->total;
        if (isset($this->fechaVencimiento)) $array['fechaVencimiento'] = $this->fechaVencimiento->format('Y-m-d');;
        if (isset($this->campania)) $array['campania'] = $this->campania;
        if (isset($this->pagado)) $array['pagado'] = $this->pagado;
        if (isset($this->nroFactura)) $array['nroFactura'] = $this->nroFactura;
        return $array;
    }
}