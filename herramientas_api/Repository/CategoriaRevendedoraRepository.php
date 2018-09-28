<?php
/**
 * Created by PhpStorm.
 * User: nicol
 * Date: 28/09/2018
 * Time: 8:45 AM
 */
require_once 'Db.php';
require_once 'AbstractRepository.php';
require_once '../Model/CategoriaRevendedora.php';

class CategoriaRevendedoraRepository extends AbstractRepository
{
    public function getAllSorted(): Array{
        $sql = "SELECT * 
                FROM categoria_revendedora 
                ORDER BY descripcion ASC";

        $db = $this->connect();
        $stmt = $db->prepare($sql);
        $stmt->execute();
        $items = $stmt->fetchAll(PDO::FETCH_OBJ);

        if ($items == null) {
            return Array();
        }

        $categoriaRevendedoras = Array();
        foreach ($items as $item) {
            $categoriaRevendedora = new Pais();
            $categoriaRevendedora->setId($item->id);
            $categoriaRevendedora->setDescripcion($item->descipcion);
            array_push($categoriaRevendedoras, $categoriaRevendedora);
        }

        $this->disconnect();
        return $categoriaRevendedoras;
    }

    public function get($id) {
        $sql = "SELECT * 
                FROM categoria_revendedora 
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

        $item = new CategoriaRevendedora();
        $item->setId((int)$result->id);
        $item->setDescripcion($result->descripcion);

        $this->disconnect();
        return $item;
    }
}