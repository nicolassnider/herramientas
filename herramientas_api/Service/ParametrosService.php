<?php
require_once '../Repository/ParametroRepository.php';

class ParametrosService
{
    private $repository;

    public function __construct() {
        $this->repository = new ParametroRepository();
    }

    public function getAll(): Array {
        return $this->repository->getAll();
    }

    public function get($parametro): ?Parametro {
        return $this->repository->get($parametro);
    }

}