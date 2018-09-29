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
            $categoriaRevendedora->setDescripcion($item->descripcion);
            array_push($categoriaRevendedoras, $categoriaRevendedora);
        }

        $this->disconnect();
        return $categoriaRevendedoras;
    }

    public function get(int $id):?CategoriaRevendedora {
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

    public function getAll():Array{
        $sqlGetAll="SELECT * FROM categoria_revendedora";
        $db = $this->connect();
        $stmtGetAll= $db->prepare($sqlGetAll);
        $stmtGetAll->execute();
        $items=$stmtGetAll->fetchAll(PDO::FETCH_OBJ);
        if ($items==null){
            return Array();
        }

        $categoriasRevendedora = Array();
        foreach ($items as $item) {
            $categoriaRevendedora = new CategoriaRevendedora();
            $categoriaRevendedora->setId((int)$item->id);
            $categoriaRevendedora->setDescripcion((string)$item->descripcion);
            array_push($categoriasRevendedora, $categoriaRevendedora);
        }

        $this->disconnect();
        return $categoriasRevendedora;
    }

    public function create(CategoriaRevendedora $categoriaRevendedora): ?CategoriaRevendedora
    {

        $db = $this->connect();
        $db->beginTransaction();
        $sqlCreate = "INSERT INTO categoria_revendedora (descripcion) VALUES (:descripcion)";
        $descripcion = $categoriaRevendedora->getDescripcion();
        $stmtCreate = $db->prepare($sqlCreate);
        $stmtCreate->bindParam(':descripcion', $descripcion);
        $stmtCreate->execute();
        $categoriaRevendedora->setId($db->lastInsertId());
        $db->commit();
        return $categoriaRevendedora;
    }

    public function update(CategoriaRevendedora $categoriaRevendedora)
    {

        try {
            $db = $this->connect();
            $db->beginTransaction();
            $sqlUpdate = "UPDATE 
                        categoria_revendedora SET                        
                        descripcion=:descripcion                        
                        WHERE
                        id=:id";
            $id = $categoriaRevendedora->getId();
            $descripcion = $categoriaRevendedora->getDescripcion();
            $stmtUpdate = $db->prepare($sqlUpdate);
            $stmtUpdate->bindParam(':id', $id);
            $stmtUpdate->bindParam(':descripcion', $descripcion);
            $stmtUpdate->execute();
            $db->commit();

        } catch (Exception $e) {
            if ($db != null) $db->rollback();

        } finally {
            $stmtUpdate = null;
            $db = null;
            $this->disconnect();
        }

    }

    public function delete(int $id): void
    {

        try {
            $db = $this->connect();
            $db->beginTransaction();
            $sqlDelete = "DELETE FROM herramientas.categoria_revendedora WHERE (id =:id)";
            $stmtDelete = $db->prepare($sqlDelete);
            $stmtDelete->bindParam(':id', $id);
            $stmtDelete->execute();
            $db->commit();

        } catch (Exception $e) {
            if ($db != null) $db->rollback();

        } finally {
            $stmtDelete = null;
            $db = null;
            $this->disconnect();
        }

    }

}