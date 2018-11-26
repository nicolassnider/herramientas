<?php
/**
 * Created by PhpStorm.
 * User: nicol
 * Date: 28/09/2018
 * Time: 7:55 AM
 */
require_once '../Repository/RevendedoraRepository.php';

class RevendedoraService
{
    private $repository;

    public function __construct()
    {
        $this->repository = new RevendedoraRepository();
    }

    public function getRevendedorasMasDeudores(): ?Archivo
    {
        return $this->repository->getRevendedorasMasDeudoresCsvFile();
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


    public function create(Revendedora $revendedora)
    {

        return $this->repository->create($revendedora);
    }
    public function update(Revendedora $revendedora): void
    {
        $this->repository->update($revendedora);
    }

    public function delete(int $id): void
    {
        $this->repository->delete($id);
    }

    public function deactivate(int $id): void
    {
        $this->repository->deactivate($id);
    }

    public function activate(int $id): void
    {
        $this->repository->activate($id);
    }

    public function grid(DataTableResponse $dataTablesResponse, DataTableRequest $dataTableRequest)
    {

        return $this->repository->grid($dataTablesResponse, $dataTableRequest);
    }
}