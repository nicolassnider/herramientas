<?php
/**
 * Created by PhpStorm.
 * User: nicol
 * Date: 06/09/2018
 * Time: 11:15 PM
 */
require_once 'Db.php';
require_once 'AbstractRepository.php';

class RevendedoraRepository extends AbstractRepository
{

    public function create(Revendedora $revendedora) :Revendedora
    {
        return $revendedora;
    }

}