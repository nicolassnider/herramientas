<?php
/**
 * Created by PhpStorm.
 * User: nicol
 * Date: 09/10/2018
 * Time: 12:44 PM
 */

require_once '../Repository/RemitoProductoRepository.php';

class RemitoProductoService
{

    private $repository;

    public function __construct()
    {
        $this->repository = new RemitoProductoRepository();
    }

    public function getAllActiveSorted()
    {
        return $this->repository->getAllActiveSorted();
    }

    public function create(RemitoProducto $remitoProducto)
    {
        return $this->repository->create($remitoProducto);
    }

    public function get($id)
    {
        return $this->repository->get($id);
    }

    public function getAllRemitoProductoPorRemito(int $id)
    {
        return $this->repository->getAllRemitoProductoPorRemito($id);
    }

    public function update(RemitoProducto $remitoProducto)
    {
        $this->repository->update($remitoProducto);
    }

    public function delete(int $id)
    {
        $this->repository->delete($id);
    }

    public function getCsvFile(int $remitoId): ?Archivo
    {
        return $this->repository->getCsvFile($remitoId);
    }

    public function checkCampaniaRemitoProducto(int $id)
    {
        return $this->repository->checkCampaniaRemitoProducto($id);
    }

    public function recibir(int $id)
    {
        $this->repository->recibir($id);
    }


    public function compararPedidoRemito()
    {
        $this->repository->compararPedidoRemito();
    }

}