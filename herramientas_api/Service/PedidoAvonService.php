<?php
/**
 * Created by PhpStorm.
 * User: nicol
 * Date: 08/10/2018
 * Time: 8:57 PM
 */

require_once '../Repository/PedidoAvonRepository.php';


class PedidoAvonService
{
    private $repository;

    public function __construct()
    {
        $this->repository = new PedidoAvonRepository();
    }

    public function create(PedidoAvon $pedidoAvon):?PedidoAvon
    {
        return $this->repository->create($pedidoAvon);
    }

    public function get(int $id):?PedidoAvon
    {
        return $this->repository->get($id);
    }

    public function getAll():Array
    {
        return $this->repository->getAll();
    }

    public function recibir(int $id)
    {
        $this->repository->recibir($id);
    }

    public function entregar(int $id)
    {
        $this->repository->entregar($id);
    }
    public function cobrar(int $id)
    {
        $this->repository->cobrar($id);
    }

    public function delete(int $id)
    {
        $this->repository->delete($id);
    }


}