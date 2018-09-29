<?php
/**
 * Created by PhpStorm.
 * User: nicol
 * Date: 29/09/2018
 * Time: 11:10 AM
 */
require_once '../Repository/CategoriaRevendedoraRepository.php';
require_once '../Model/CategoriaRevendedora.php';

class CategoriaRevendedoraService
{
    private $repository;

    public function __construct(){
        $this->repository= new CategoriaRevendedoraRepository();
    }

    public function getAllSorted(): Array{
        return $this->repository->getAllSorted();
    }

    public function getAll():Array{
        return $this->repository->getAll();
    }

    public function get(int $id):?CategoriaRevendedora{
        return $this->repository->get($id);
    }

    public function create(CategoriaRevendedora $categoriaRevendedora):?CategoriaRevendedora
    {
        return $this->repository->create($categoriaRevendedora);
    }

    public function update(CategoriaRevendedora $categoriaRevendedora)
    {
        $this->repository->update($categoriaRevendedora);
    }

    public function delete(int $id)
    {
        $this->repository->delete($id);
    }


}