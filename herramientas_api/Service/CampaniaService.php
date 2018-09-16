<?php
/**
 * Created by PhpStorm.
 * User: nicol
 * Date: 16/09/2018
 * Time: 12:09 PM
 */
require_once '../Repository/CampaniaRepository.php';

class CampaniaService
{

    private $repository;

    public function __construct()
    {
        $this->repository = new CampaniaRepository();
    }

    public function getAll()
    {
        return $this->repository->getAll();
    }

    public function get(int $id)
    {
        return $this->repository->get($id);
    }

    public function getCampaniaActiva()
    {
        return $this->repository->getCampaniaActiva();
    }

    public function desactivarCampania(int $id)
    {
        $this->repository->desactivarCampania($id);
    }

    public function create(Campania $campania)
    {
        return $this->repository->create($campania);
    }

    public function update(Campania $campania)
    {
        $this->repository->update($campania);
    }

    public function delete(int $id)
    {
        $this->repository->delete($id);
    }


}