<?php
/**
 * Created by PhpStorm.
 * User: nicol
 * Date: 13/08/2018
 * Time: 4:18 PM
 */

class RemitoProducto implements JsonSerializable
{

    private $id;
    private $remito;
    private $productoCatalogo;
    private $cantidad;
    private $precioUnitario;


    public function jsonSerialize()
    {
        $array = Array();
        if (isset($this->id)) $array['id'] = $this->id;
        if (isset($this->remito)) $array['remito'] = $this->remito;
        if (isset($this->productoCatalogo)) $array['productoCatalogo'] = $this->productoCatalogo;
        if (isset($this->cantidad)) $array['cantidad'] = $this->cantidad;
        if (isset($this->precioUnitario)) $array['precioUnitario'] = $this->precioUnitario;
        return $array;
    }
}