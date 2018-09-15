<?php

class Adjunto implements JsonSerializable {
    private $id;
    private $adjunto;
    private $archivoNombre;
    private $fechaHora;

    public function getId(): ?int {
        return $this->id;
    }

    public function setId(?int $id) {
        $this->id = $id;
    }

    public function getAdjunto(): ?string {
        return $this->adjunto;
    }

    public function setAdjunto(?string $adjunto) {
        $this->adjunto = $adjunto;
    }

    public function getArchivoNombre(): ?string {
        return $this->archivoNombre;
    }

    public function setArchivoNombre(?string $archivoNombre) {
        $this->archivoNombre = $archivoNombre;
    }

    public function getFechaHora(): ?string {
        return $this->fechaHora;
    }

    public function setFechaHora(?string $fechaHora) {
        $this->fechaHora = $fechaHora;
    }

    public function jsonSerialize(): array {
        return
            [
                'id' => $this->id,
                'adjunto' => $this->adjunto,
                'archivoNombre' => $this->archivoNombre,
                'fechaHora' => $this->fechaHora
            ];
    }
}