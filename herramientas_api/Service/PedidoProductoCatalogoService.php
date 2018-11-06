<?php
/**
 * Created by PhpStorm.
 * User: nicol
 * Date: 09/10/2018
 * Time: 12:44 PM
 */

require_once '../Repository/PedidoProductoCatalogoRepository.php';

class PedidoProductoCatalogoService
{

    private $repository;

    public function __construct()
    {
        $this->repository = new PedidoProductoCatalogoRepository();
    }

    public function getAllActiveSorted()
    {
        return $this->repository->getAllActiveSorted();
    }

    public function create(PedidoProductoCatalogo $pedidoProductoCatalogo)
    {
        return $this->repository->create($pedidoProductoCatalogo);
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

    public function getAllProductosPorPedido(int $id)
    {
        return $this->repository->getAllProductosPorPedido($id);
    }

    public function update(PedidoProductoCatalogo $pedidoProductoCatalogo)
    {
        $this->repository->update($pedidoProductoCatalogo);
    }

    public function delete(int $id)
    {
        $this->repository->delete($id);
    }

    public function getCsvFile(int $pedidoId): ?Archivo
    {
        return $this->repository->getCsvFile($pedidoId);
    }

    public function checkCampaniaPedidoProductoCatalogo(int $id)
    {
        return $this->repository->checkCampaniaPedidoProductoCatalogo($id);
    }



}