<?php
require_once '../Repository/ProvinciaRepository.php';

class ProvinciaService {
    private $repository;

    public function __construct() {
        $this->repository= new ProvinciaRepository();
    }

    public function getAllSortedByPais($pais): Array {
        return $this->repository->getAllSortedByPais($pais);
    }
}