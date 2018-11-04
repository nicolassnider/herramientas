<?php
/**
 * Created by PhpStorm.
 * User: nicol
 * Date: 09/10/2018
 * Time: 8:04 AM
 */

require_once 'Db.php';
require_once 'AbstractRepository.php';
require_once '../Model/CategoriaProducto.php';
require_once '../Commons/Exceptions/BadRequestException.php';

class CategoriaProductoRepository extends AbstractRepository
{
    public function getAllSorted(): Array{
        $sql = "SELECT * 
                FROM categoria_producto 
                ORDER BY descripcion ASC";

        $db = $this->connect();
        $stmt = $db->prepare($sql);
        $stmt->execute();
        $items = $stmt->fetchAll(PDO::FETCH_OBJ);

        if ($items == null) {
            return Array();
        }

        $categoriaProductos = Array();
        foreach ($items as $item) {
            $categoriaProducto = new CategoriaProducto();
            $categoriaProducto->setId($item->id);
            $categoriaProducto->setDescripcion($item->descripcion);
            array_push($categoriaProductos, $categoriaProducto);
        }

        $this->disconnect();
        return $categoriaProductos;
    }

    public function get(int $id):?CategoriaProducto {
        $sql = "SELECT * 
                FROM categoria_producto 
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

        $item = new CategoriaProducto();
        $item->setId((int)$result->id);
        $item->setDescripcion($result->descripcion);

        $this->disconnect();
        return $item;
    }

    public function getAll():Array{
        $sqlGetAll="SELECT * FROM categoria_producto";
        $db = $this->connect();
        $stmtGetAll= $db->prepare($sqlGetAll);
        $stmtGetAll->execute();
        $items=$stmtGetAll->fetchAll(PDO::FETCH_OBJ);
        if ($items==null){
            return Array();
        }

        $categoriasCliente = Array();
        foreach ($items as $item) {
            $categoriaProducto = new CategoriaProducto();
            $categoriaProducto->setId((int)$item->id);
            $categoriaProducto->setDescripcion((string)$item->descripcion);
            array_push($categoriasCliente, $categoriaProducto);
        }

        $this->disconnect();
        return $categoriasCliente;
    }

    public function create(CategoriaProducto $categoriaProducto): ?CategoriaProducto
    {

        try {
            $db = $this->connect();
            $db->beginTransaction();
        $sqlCreate = "INSERT INTO categoria_producto (descripcion) VALUES (:descripcion)";
        $descripcion = $categoriaProducto->getDescripcion();
        $stmtCreate = $db->prepare($sqlCreate);
        $stmtCreate->bindParam(':descripcion', $descripcion);
        $stmtCreate->execute();
        $categoriaProducto->setId($db->lastInsertId());
            $db->commit();
        } catch (Exception $e) {
            if ($db != null) $db->rollback();
            if ($e instanceof PDOException && $stmtCreate->errorInfo()[0] == 23000 && $stmtCreate->errorInfo()[1] == 1062) {
                //TODO: implementar ex
                $array = explode("'", $stmtCreate->errorInfo()[2]);
                switch ($array[3]) {
                    case "UNICO_UNIDAD_DESCRIPCION":
                        throw new BadRequestException("existe una ocurrencia para la unidad id: " . $array[1]);
                        break;
                    default:
                        die(print_r($array));
                        break;
                }
            } else {
                throw $e;
            }
        } finally {
            $this->disconnect();

        }
        return $categoriaProducto;
    }

    public function update(CategoriaProducto $categoriaProducto)
    {

        try {
            $db = $this->connect();
            $db->beginTransaction();
            $sqlUpdate = "UPDATE 
                        categoria_producto SET                        
                        descripcion=:descripcion                        
                        WHERE
                        id=:id";
            $id = $categoriaProducto->getId();
            $descripcion = $categoriaProducto->getDescripcion();
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
            $sqlDelete = "DELETE FROM herramientas.categoria_producto WHERE (id =:id)";
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