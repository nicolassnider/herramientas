<?php
require_once 'ApiErrors.php';

class ApiError implements JsonSerializable {
    private $codigo;
    private $mensaje;
    private $detalle;

    public function __construct(int $codigo, ?array $detalle){
    	$this->codigo = $codigo;
    	$this->mensaje = ApiErrors::errors[$codigo];
    	$this->detalle = $detalle;
    }

    public function getCodigo() : int {
        return $this->codigo;
    }

    public function setCodigo(int $codigo): void {
        $this->codigo = $codigo;
    }

    public function getMensaje() : int {
        return $this->mensaje;
    }

    public function setMensaje(int $mensaje): void {
        $this->mensaje = $mensaje;
    }

    public function getDetalle() : array {
        return $this->detalle;
    }

    public function setDetalle(array $detalle): void {
        $this->detalle = $detalle;
    }

    public function jsonSerialize() {
        return [
			'codigo' => $this->codigo,
			'mensaje' => $this->mensaje,
			'detalle' => $this->detalle
		];
    }
}