<?php
require_once '../Repository/PerfilesRepository.php';

class PerfilesService {
    private $repository;

    public function __construct() {
        $this->repository = new PerfilesRepository();
    }

    public function getAll(): Array {
        return $this->repository->getAll();
    }

    public function get($id): ?Perfil {
        return $this->repository->get($id);
    }

    public function create(Perfil $perfil): Perfil {
        return $this->repository->create($perfil);
    }

    public function update(Perfil $perfil) {
        return $this->repository->update($perfil);
    }

    public function delete($id): void {
        $this->repository->delete($id);
    }
}