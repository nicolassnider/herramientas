<?php
require_once '../Model/Pais.php';
require_once 'AbstractRepository.php';

class PaisRepository extends AbstractRepository {
    public function getAllSorted(): Array{
        $sql = "SELECT * 
                FROM pais 
                ORDER BY descripcion ASC";

        $db = $this->connect();
        $stmt = $db->prepare($sql);
        $stmt->execute();
        $items = $stmt->fetchAll(PDO::FETCH_OBJ);

        if ($items == null) {
            return Array();
        }

        $paises = Array();
        foreach ($items as $item) {
            $pais = new Pais();
            $pais->setId($item->id);
            $pais->setDescripcion($item->nombre);
            array_push($paises, $pais);
        }

        $this->disconnect();
        return $paises;
    }

    public function get($id) {
        $sql = "SELECT * 
                FROM pais 
                WHERE id=:id";
                
        $db = $this->connect();
        $stmt = $db->prepare($sql);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        $result = $stmt->fetchObject();
        if ($result == null) {
            return null;
        }

        $item = null;

        $item = new Pais();
        $item->setId((int)$result->id);
        $item->setDescripcion($result->nombre);

        $this->disconnect();
        return $item;
    }
}
