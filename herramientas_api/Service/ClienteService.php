<?php
/**
 * Created by PhpStorm.
 * User: nicol
 * Date: 07/10/2018
 * Time: 7:20 PM
 */

require_once '../Repository/ClienteRepository.php';
require_once '../Model/Archivo.php';

class ClienteService
{

    private $repository;

    public function __construct()
    {
        $this->repository = new ClienteRepository();
    }

    public function getClientesporRevendedoraCsvFile(int $revendedoraId): ?Archivo
    {
        return $this->repository->getClientesporRevendedoraCsvFile($revendedoraId);
    }

    public function getAllActiveSorted()
    {
        return $this->repository->getAllActiveSorted();
    }

    public function create(Cliente $cliente)
    {
        return $this->repository->create($cliente);
    }

    public function get($id)
    {
        return $this->repository->get($id);
    }

    public function getAll()
    {
        return $this->repository->getAll();
    }

    public function update(Cliente $cliente)
    {
        $this->repository->update($cliente);
    }

    public function activate(int $id)
    {
        $this->repository->activate($id);
    }
    public function deactivate(int $id)
    {
        $this->repository->deactivate($id);
    }

    public function delete(int $id)
    {
        $this->repository->delete($id);
    }

}