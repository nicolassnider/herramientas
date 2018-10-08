<?php
/**
 * Created by PhpStorm.
 * User: nicol
 * Date: 07/10/2018
 * Time: 3:58 PM
 */

require_once 'Db.php';
require_once 'AbstractRepository.php';
require_once '../Model/CategoriaCliente.php';
require_once '../Commons/Exceptions/BadRequestException.php';

class CategoriaClienteRepository extends AbstractRepository
{
    public function getAllSorted(): Array{
        $sql = "SELECT * 
                FROM categoria_cliente 
                ORDER BY descripcion ASC";

        $db = $this->connect();
        $stmt = $db->prepare($sql);
        $stmt->execute();
        $items = $stmt->fetchAll(PDO::FETCH_OBJ);

        if ($items == null) {
            return Array();
        }

        $categoriaClientes = Array();
        foreach ($items as $item) {
            $categoriaCliente = new CategoriaCliente();
            $categoriaCliente->setId($item->id);
            $categoriaCliente->setDescripcion($item->descripcion);
            array_push($categoriaClientes, $categoriaCliente);
        }

        $this->disconnect();
        return $categoriaClientes;
    }

    public function get(int $id):?CategoriaCliente {
        $sql = "SELECT * 
                FROM categoria_cliente 
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

        $item = new CategoriaCliente();
        $item->setId((int)$result->id);
        $item->setDescripcion($result->descripcion);

        $this->disconnect();
        return $item;
    }

    public function getAll():Array{
        $sqlGetAll="SELECT * FROM categoria_cliente";
        $db = $this->connect();
        $stmtGetAll= $db->prepare($sqlGetAll);
        $stmtGetAll->execute();
        $items=$stmtGetAll->fetchAll(PDO::FETCH_OBJ);
        if ($items==null){
            return Array();
        }

        $categoriasCliente = Array();
        foreach ($items as $item) {
            $categoriaCliente = new CategoriaCliente();
            $categoriaCliente->setId((int)$item->id);
            $categoriaCliente->setDescripcion((string)$item->descripcion);
            array_push($categoriasCliente, $categoriaCliente);
        }

        $this->disconnect();
        return $categoriasCliente;
    }

    public function create(CategoriaCliente $categoriaCliente): ?CategoriaCliente
    {

        $db = $this->connect();
        $db->beginTransaction();
        $sqlCreate = "INSERT INTO categoria_cliente (descripcion) VALUES (:descripcion)";
        $descripcion = $categoriaCliente->getDescripcion();
        $stmtCreate = $db->prepare($sqlCreate);
        $stmtCreate->bindParam(':descripcion', $descripcion);
        $stmtCreate->execute();
        $categoriaCliente->setId($db->lastInsertId());
        $db->commit();
        return $categoriaCliente;
    }

    public function update(CategoriaCliente $categoriaCliente)
    {

        try {
            $db = $this->connect();
            $db->beginTransaction();
            $sqlUpdate = "UPDATE 
                        categoria_cliente SET                        
                        descripcion=:descripcion                        
                        WHERE
                        id=:id";
            $id = $categoriaCliente->getId();
            $descripcion = $categoriaCliente->getDescripcion();
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
            $sqlDelete = "DELETE FROM herramientas.categoria_cliente WHERE (id =:id)";
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