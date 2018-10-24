<?php
/**
 * Created by PhpStorm.
 * User: nicol
 * Date: 03/10/2018
 * Time: 6:03 PM
 */
require_once "../Repository/CatalogoRepository.php";

class CatalogoService
{

    private $repository;


    public function getAll()
    {

        $this->repository = new CatalogoRepository();
        return $this->repository->getAll();
    }

    public function getAllActiveSorted()
    {
        $this->repository = new CatalogoRepository();
        return $this->repository->getAllActiveSorted();
    }

    public function getAllActiveSortedSinProducto(int $id)
    {
        $this->repository = new CatalogoRepository();
        return $this->repository->getAllActiveSortedSinProducto($id);
    }

    public function get(int $id): ?Catalogo
    {
        $this->repository = new CatalogoRepository();
        return $this->repository->get($id);

    }

    public function create(Catalogo $catalogo): ?Catalogo
    {
        $this->repository = new CatalogoRepository();
        return $this->repository->create($catalogo);
    }

    public function update(Catalogo $catalogo)
    {
        $this->repository = new CatalogoRepository();
        $this->repository->update($catalogo);
    }

    public function delete(int $id)
    {
        $this->repository = new CatalogoRepository();
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

    public function createCatalogoByCampania(CatalogoCampania $catalogoCampania)
    {
        $this->repository = new CatalogoRepository();
        return $this->repository->createCatalogoByCampania($catalogoCampania);
    }


}