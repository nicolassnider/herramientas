<?php
/**
 * Created by PhpStorm.
 * User: nicol
 * Date: 07/10/2018
 * Time: 4:12 PM
 */
require_once '../Repository/CategoriaClienteRepository.php';
require_once '../Model/CategoriaCliente.php';
class CategoriaClienteService
{
    private $repository;

    public function __construct(){
        $this->repository= new CategoriaClienteRepository();
    }

    public function getAllSorted(): Array{
        return $this->repository->getAllSorted();
    }

    public function getAll():Array{
        return $this->repository->getAll();
    }

    public function get(int $id):?CategoriaCliente{
        return $this->repository->get($id);
    }

    public function create(CategoriaCliente $categoriaCliente):?CategoriaCliente
    {
        return $this->repository->create($categoriaCliente);
    }

    public function update(CategoriaCliente $categoriaCliente)
    {
        $this->repository->update($categoriaCliente);
    }

    public function delete(int $id)
    {
        $this->repository->delete($id);
    }


}