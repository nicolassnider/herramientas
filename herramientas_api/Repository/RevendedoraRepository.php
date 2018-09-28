<?php
/**
 * Created by PhpStorm.
 * User: nicol
 * Date: 06/09/2018
 * Time: 11:15 PM
 */
require_once 'Db.php';
require_once 'AbstractRepository.php';
require_once '../Model/Revendedora.php';
require_once '../Repository/PersonaRepository.php';
require_once '../Repository/CategoriaRevendedoraRepository.php';

class RevendedoraRepository extends AbstractRepository
{

    public function create(Revendedora $revendedora) :Revendedora
    {
        return $revendedora;
    }

    public function getAll(): Array {
        $sql = "SELECT *
                FROM revendedora";

        $db = $this->connect();
        $stmt = $db->prepare($sql);
        $stmt->execute();
        $items = $stmt->fetchAll(PDO::FETCH_OBJ);

        if ($items == null) {
            return Array();
        }

        $revendedoras = Array();
        foreach ($items as $item) {
            $revendedora = $this->createFromResultset($item, [], $this->db);
            array_push($revendedoras, $revendedora);
        }

        $this->disconnect();
        return $revendedoras;
    }


    private function createFromResultset($result, array $fields, $db)
    {
        $item = new Revendedora();
        $item->setId((int)$result->id);
        $item->setFechaAltaRevendedora(new DateTime ($result->fecha_alta_revendedora));
        $item->setFechaBajaRevendedora(new DateTime ($result->fecha_baja_revendedora));
        $item->setActivo((bool)$result->activo);


        if (in_array('*', $fields) || in_array('categoriaPersona', $fields))
            $item->setCategoriaRevendedora((new CategoriaRevendedoraRepository($db))->get($result->categoria_persona));
        if (in_array('*', $fields) || in_array('persona', $fields))
            $item->setPersona((new PersonaRepository($db))->get($result->categoria_persona));

        return $item;
    }

}