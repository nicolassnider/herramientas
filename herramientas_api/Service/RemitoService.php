<?php
/**
 * Created by PhpStorm.
 * User: nicol
 * Date: 08/10/2018
 * Time: 12:23 AM
 */

require_once '../Repository/RemitoRepository.php';

class RemitoService
{

    private $repository;

    public function __construct()
    {
        $this->repository = new RemitoRepository();
    }

    public function create(Remito $remito)
    {
        return $this->repository->create($remito);
    }

    public function get(int $id)
    {
        return $this->repository->get($id);
    }

    public function update(Remito $remito)
    {
        $this->repository->update($remito);
    }

    public function getRemitosPorFactura(int $id)
    {
        return $this->repository->getRemitosPorFactura($id);
    }


}