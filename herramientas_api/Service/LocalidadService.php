<?php
require_once '../Repository/LocalidadRepository.php';

class LocalidadService {
    private $repository;

    public function __construct() {
        $this->repository = new LocalidadRepository();
    }

    public function getAllSortedByProvincia($provincia): Array {
        return $this->repository->getAllSortedByProvincia($provincia);
    }
}