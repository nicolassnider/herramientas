<?php
/**
 * Created by Nicolás Snider
 * Date: 01/07/2018
 * Time: 12:43 AM
 */
require_once '../Repository/PersonaRepository.php';

class PersonaService
{

    private $repository;
    private $parametroRepository;

    public function __construct()
    {
        $this->repository = new PersonaRepository();
    }

    public function get(int $id): ?Persona
    {

        return $this->repository->get($id);
    }

    public function getAll(): Array
    {
        return $this->repository->getAll();
    }

    public function getAllActiveSorted(): Array {
        return $this->repository->getAllActiveSorted();
    }

    public function getAllActiveSortedSinCLiente(): Array
    {
        return $this->repository->getAllActiveSortedSinCliente();
    }


    public function create(Persona $persona): Persona
    {

        return $this->repository->create($persona);
    }

    public function update(Persona $persona): void
    {
        $this->repository->update($persona);
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



