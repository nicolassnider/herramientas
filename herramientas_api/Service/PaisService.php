<?php
require_once '../Repository/PaisRepository.php';

class PaisService {
    private $repository;

    public function __construct() {
        $this->repository = new PaisRepository();
    }

    public function getAllSorted(): Array {
        return $this->repository->getAllSorted();
    }
}