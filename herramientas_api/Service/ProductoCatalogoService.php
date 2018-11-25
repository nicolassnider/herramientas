<?php
/**
 * Created by PhpStorm.
 * User: nicol
 * Date: 09/10/2018
 * Time: 12:44 PM
 */

require_once '../Repository/ProductoCatalogoRepository.php';

class ProductoCatalogoService
{

    private $repository;

    public function __construct()
    {
        $this->repository = new ProductoCatalogoRepository();
    }

    public function getAllActiveSorted()
    {
        return $this->repository->getAllActiveSorted();
    }

    public function getAllActiveSortedByCatalogoRevendedora()
    {
        return $this->repository->getAllActiveSortedByCatalogoRevendedora();
    }

    public function create(ProductoCatalogo $productoCatalogo)
    {
        return $this->repository->create($productoCatalogo);
    }

    public function get($id)
    {
        return $this->repository->get($id);
    }

    public function getAll()
    {
        return $this->repository->getAll();
    }

    public function getAllCatalogosPorProducto(int $id)
    {
        return $this->repository->getAllCatalogoProductoPorProducto($id);
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