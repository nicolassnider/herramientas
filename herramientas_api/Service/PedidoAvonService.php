<?php
/**
 * Created by PhpStorm.
 * User: nicol
 * Date: 08/10/2018
 * Time: 8:57 PM
 */

require_once '../Repository/PedidoAvonRepository.php';
require_once '../Commons/Files/FileUtil.php';

use Slim\Http\UploadedFile;

class PedidoAvonService
{
    private $repository;

    public function __construct()
    {
        $this->repository = new PedidoAvonRepository();
    }

    public function create(PedidoAvon $pedidoAvon): ?PedidoAvon
    {
        return $this->repository->create($pedidoAvon);
    }

    public function get(int $id): ?PedidoAvon
    {
        return $this->repository->get($id);
    }

    public function getPedidoPorCampania(int $id): ?PedidoAvon
    {
        return $this->repository->getPedidoPorCampaniaActual($id);
    }


    public function getPedidoPorCampaniaActual(): ?PedidoAvon
    {
        return $this->repository->getPedidoPorCampaniaActual();
    }

    public function getAll(): Array
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

    public function saveFile(UploadedFile $file, int $id = 1): string
    {
        $directory = Config::get('storage.series.informe.path');
        $filename = FileUtil::moveUploadedFile($directory, $file, $id);
        return $filename;
    }


}