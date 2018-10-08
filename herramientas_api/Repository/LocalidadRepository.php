<?php
/**
 * Created by PhpStorm.
 * User: nicol
 * Date: 30/08/2018
 * Time: 11:51 AM
 */
require_once "../Model/Localidad.php";
require_once "../Repository/ProvinciaRepository.php";
require_once "../Repository/AbstractRepository.php";
require_once '../Commons/Exceptions/BadRequestException.php';
class LocalidadRepository extends AbstractRepository {
    public function getAllSortedByProvincia($provincia): Array {
        $sql = "SELECT * 
                FROM localidad
                WHERE localidad.provincia =:provincia 
                ORDER BY nombre ASC";

        $db = $this->connect();
        $stmt = $db->prepare($sql);
        $stmt->bindParam(':provincia', $provincia);
        $stmt->execute();
        $items = $stmt->fetchAll(PDO::FETCH_OBJ);

        if($items == null) {
            return Array();
        }

        $localidades = Array();
        foreach($items as $item) {
            $localidad = new Localidad();
            $localidad->setId($item->id);
            $localidad->setDescripcion($item->nombre);
            array_push($localidades, $localidad);
        }

        $this->disconnect();
        return $localidades;
    }

    public function get(?int $id): ?Localidad {
        $sql = "SELECT * 
                FROM localidad 
                WHERE id=:id";

        $db = $this->connect();
        $stmt = $db->prepare($sql);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        $result = $stmt->fetchObject();

        if ($result == null) {
            return null;
        }

        $localidad = new Localidad();
        $localidad->setId($result->id);
        $localidad->setDescripcion($result->descripcion);
        $localidad->setProvincia($result->provincia != null ? (new ProvinciaRepository($this->db))->get($result->provincia) : null);

        $this->disconnect();
        return $localidad;
    }
}