<?php
/**
 * Created by PhpStorm.
 * User: nicol
 * Date: 08/10/2018
 * Time: 12:23 AM
 */

require_once '../Repository/FacturaRepository.php';

class FacturaService
{

    private $repository;

    public function __construct()
    {
        $this->repository = new FacturaRepository();
    }

    public function getAllSorted()
    {
        return $this->repository->getAllSorted();
    }

    public function create(Factura $factura)
    {
        return $this->repository->create($factura);
    }

    public function get($id)
    {
        return $this->repository->get($id);
    }

    public function getAll()
    {
        return $this->repository->getAll();
    }

    public function update(Factura $factura)
    {
        $this->repository->update($factura);
    }


    public function pagar(int $id)
    {
        $this->repository->pagar($id);
    }

    public function delete(int $id)
    {
        $this->repository->delete($id);
    }

}