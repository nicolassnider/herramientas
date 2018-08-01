<?php
/**
 * Created by Nicolás Snider
 * Date: 01/07/2018
 * Time: 12:43 AM
 */
require_once '../Repository/TipoDocumentoRepository.php';

class TipoDocumentoService {
    private $repository;

    public function __construct() {
        $this->repository = new TipoDocumentoRepository();
    }

    public function getAllSorted(): Array {
        return $this->repository->getAllSorted();
    }
}