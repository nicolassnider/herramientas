<?php
require_once '../Model/Provincia.php';
require_once 'AbstractRepository.php';
require_once 'PaisRepository.php';

class ProvinciaRepository extends AbstractRepository {
    public function getAllSortedByPais($pais): Array {
        $sql = "SELECT * 
                FROM provincia 
                WHERE provincia.pais =:pais 
                ORDER BY nombre";
        
        $db = $this->connect();
        $stmt = $db->prepare($sql);
        $stmt->bindParam(':pais', $pais);
        $stmt->execute();
        $items = $stmt->fetchAll(PDO::FETCH_OBJ);

        if ($items == null) {
            return Array();
        }

        $provincias = Array();
        foreach($items as $item) {
            $provincia = new Provincia();
            $provincia->setId($item->id);
            $provincia->setDescripcion($item->descripcion);
            array_push($provincias, $provincia);
        }

        $this->disconnect();
        return $provincias;
    }

    public function get($id) {
        $sql = "SELECT * 
                FROM provincia 
                WHERE id=:id";

        $db = $this->connect();
        $stmt = $db->prepare($sql);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        $result = $stmt->fetchObject();
        
        $item = null;
        if ($result != null) {
            $item = new Provincia();
            $item->setId((int)$result->id);
            $item->setDescripcion($result->descripcion);
            $item->setPais($result->pais != null ? (new PaisRepository($this->db))->get($result->pais) : null);
        }
        $this->disconnect();
        return $item;
    }
}