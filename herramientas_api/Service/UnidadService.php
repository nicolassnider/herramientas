<?php
/**
 * Created by PhpStorm.
 * User: nicol
 * Date: 08/10/2018
 * Time: 10:17 PM
 */

require_once '../Repository/UnidadRepository.php';


class UnidadService
{
    private $repository;

    public function __construct()
    {
        $this->repository = new UnidadRepository();
    }

    public function getAllActiveSorted()
    {
        return $this->repository->getAllActiveSorted();
    }

    public function create(Unidad $unidad)
    {
        return $this->repository->create($unidad);
    }

    public function get($id)
    {
        return $this->repository->get($id);
    }

    public function getAll()
    {
        return $this->repository->getAll();
    }

    public function update(Unidad $unidad)
    {
        $this->repository->update($unidad);
    }

    public function delete(int $id)
    {
        $this->repository->delete($id);
    }

}