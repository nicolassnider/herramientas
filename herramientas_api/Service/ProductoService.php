<?php
/**
 * Created by PhpStorm.
 * User: nicol
 * Date: 09/10/2018
 * Time: 12:44 PM
 */

require_once '../Repository/ProductoRepository.php';

class ProductoService
{

    private $repository;

    public function __construct()
    {
        $this->repository = new ProductoRepository();
    }

    public function getAllActiveSorted()
    {
        return $this->repository->getAllActiveSorted();
    }

    public function create(Producto $producto)
    {
        return $this->repository->create($producto);
    }

    public function get($id)
    {
        return $this->repository->get($id);
    }

    public function getAll()
    {
        return $this->repository->getAll();
    }

    public function update(Producto $producto)
    {
        $this->repository->update($producto);
    }

    public function delete(int $id)
    {
        $this->repository->delete($id);
    }

}