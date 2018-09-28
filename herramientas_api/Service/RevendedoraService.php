<?php
/**
 * Created by PhpStorm.
 * User: nicol
 * Date: 28/09/2018
 * Time: 7:55 AM
 */
require_once '../Repository/RevendedoraRepository.php'

class RevendedoraService
{
    private $repository;

    public function __construct()
    {
        $this->repository = new RevendedoraRepository();
    }

    public function get(int $idRevendedora): ?Revendedora
    {

        return $this->repository->get($idRevendedora);
    }

    public function getAll(): Array
    {
        return $this->repository->getAll();
    }

    public function getAllActiveSorted(): Array {
        return $this->repository->getAllActiveSorted();
    }


    public function create(Revendedora $revendedora): Revendedora
    {

        return $this->repository->create($revendedora);
    }

    public function grid(DataTablesResponse $dataTablesResponse, DataTableRequest $dataTableRequest)
    {

        return $this->repository->grid($dataTablesResponse, $dataTableRequest);
    }
}