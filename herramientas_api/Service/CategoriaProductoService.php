<?php
/**
 * Created by PhpStorm.
 * User: nicol
 * Date: 09/10/2018
 * Time: 8:08 AM
 */

require_once '../Repository/CategoriaProductoRepository.php';
require_once '../Model/CategoriaProducto.php';

class CategoriaProductoService
{
    private $repository;

    public function __construct(){
        $this->repository= new CategoriaProductoRepository();
    }

    public function getAllSorted(): Array{
        return $this->repository->getAllSorted();
    }

    public function getAll():Array{
        return $this->repository->getAll();
    }

    public function get(int $id):?CategoriaProducto{
        return $this->repository->get($id);
    }

    public function create(CategoriaProducto $categoriaProducto):?CategoriaProducto
    {
        return $this->repository->create($categoriaProducto);
    }

    public function update(CategoriaProducto $categoriaProducto)
    {
        $this->repository->update($categoriaProducto);
    }

    public function delete(int $id)
    {
        $this->repository->delete($id);
    }


}