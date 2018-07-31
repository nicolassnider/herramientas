<?php
/**
 * Created by Nicolás Snider
 * Date: 01/07/2018
 * Time: 12:43 AM
 */
require_once '../Repository/PersonaRepository.php';

class PersonaService
{

    private $repository;
    private $parametroRepository;

    public function __construct()
    {
        $this->repository = new PersonaRepository();
    }

    public function get(int $idPersona): ?Persona
    {

        return $this->repository->get($idPersona);
    }

    public function create(Persona $persona): Persona
    {

        return $this->repository->create($idPersona);
    }
}



