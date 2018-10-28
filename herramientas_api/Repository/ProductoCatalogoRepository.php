<?php
/**
 * Created by PhpStorm.
 * User: nicol
 * Date: 09/10/2018
 * Time: 12:20 PM
 */

require_once 'Db.php';
require_once 'AbstractRepository.php';
require_once '../Model/Producto.php';
require_once '../Model/Catalogo.php';
require_once '../Model/ProductoCatalogo.php';

require_once '../Repository/CatalogoRepository.php';
require_once '../Repository/ProductoRepository.php';


require_once '../Commons/Exceptions/BadRequestException.php';

class ProductoCatalogoRepository extends AbstractRepository
{

    /**
     * @param Producto $productoCatalogo
     * @return null|Producto
     * @throws BadRequestException
     */
    public function create(ProductoCatalogo $productoCatalogo): ?ProductoCatalogo
    {

        try {
            $db = $this->connect();
            $db->beginTransaction();
            $sqlCreate = "INSERT INTO herramientas.producto_catalogo(producto, catalogo, precio, activo
                              ) 
                      VALUES (:producto,:catalogo,:precio,:activo                              
                              )";
            $producto = $productoCatalogo->getProducto()->getId();
            $catalogo = $productoCatalogo->getCatalogo()->getId();
            $precio = (float)$productoCatalogo->getPrecio();
            $activo = (bool)$productoCatalogo->getActivo();

            $stmtCreate = $db->prepare($sqlCreate);
            $stmtCreate->bindParam(':producto', $producto, PDO::PARAM_INT);
            $stmtCreate->bindParam(':catalogo', $catalogo, PDO::PARAM_INT);
            $stmtCreate->bindParam(':precio', $precio);
            $stmtCreate->bindParam(':activo', $activo, PDO::PARAM_BOOL);
            $stmtCreate->execute();
            $productoCatalogo->setId($db->lastInsertId());
            $db->commit();

        } catch (Exception $e) {
            if ($db != null) $db->rollback();
            if ($e instanceof PDOException && $stmtCreate->errorInfo()[0] == 23000 && $stmtCreate->errorInfo()[1] == 1062) {
                //TODO: implementar ex
                $array = explode("'", $stmtCreate->errorInfo()[2]);
                switch ($array[3]) {
                    case "persona_unique":
                        throw new BadRequestException("existe una ocurrencia para la persona id: " . $array[1]);
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
        return $productoCatalogo;
    }

    public function delete(int $id): void
    {
        $db = $this->connect();
        $db->beginTransaction();
        try {
            $sqlDelete = "DELETE FROM herramientas.producto WHERE id=:id";
            $stmtDelete = $db->prepare($sqlDelete);
            $stmtDelete->bindParam(':id', $id, PDO::PARAM_INT);
            $stmtDelete->execute();
            $db->commit();

        } catch (Exception $e) {
            //TODO: implementar ex
            if ($db != null) $db->rollback();
            if ($e instanceof PDOException && $stmtDelete->errorInfo()[0] == 23000 && $stmtDelete->errorInfo()[1] == 1451) {
                $array = explode("`", $stmtDelete->errorInfo()[2]);

                switch ($array[5]) {

                    case 'PERSONA_REVENDEDORA':
                        //TODO:verificar id de revendedora
                        $personaRepository = new PersonaRepository($this->db);
                        throw new BadRequestException("Existe una relación para la persona " . $personaRepository->get($id)->getNombre() . " " . $personaRepository->get($id)->getApellidoSegundo() . " con Revendedora id X");
                        break;
                    default:
                        die(print_r($array));
                }
            } else {
                throw $e;
            }
        } finally {

            $stmtDelete = null;
            $this->disconnect();

        }
    }


    public function getAll(bool $full = true): Array
    {
        $sql = "SELECT *
                FROM producto";

        $db = $this->connect();
        $stmt = $db->prepare($sql);
        $stmt->execute();
        $items = $stmt->fetchAll(PDO::FETCH_OBJ);

        if ($items == null) {
            return Array();
        }

        $productos = Array();
        foreach ($items as $item) {
            $item = $this->createFromResultset($item, $full ? ['*'] : [], $this->db);
            array_push($productos, $item);
        }


        $this->disconnect();
        return $productos;
    }

    public function get(bool $full = true): ?ProductoCatalogo
    {
        $sql = "SELECT *
                FROM producto_catalogo";

        $db = $this->connect();
        $stmt = $db->prepare($sql);
        $stmt->execute();
        $item = $stmt->fetch(PDO::FETCH_OBJ);

        if ($item == null) {
            return null;
        }
        $productoCatalogo = $this->createFromResultset($item, ['*'], $db);


        $this->disconnect();
        return $productoCatalogo;
    }

    private function createFromResultset($result, array $fields, $db)
    {

        $item = new ProductoCatalogo();
        $item->setId((int)$result->id);
        $item->setProducto((new ProductoRepository())->get($result->producto));
        $item->setCatalogo((new CatalogoRepository())->get($result->catalogo));
        $item->setPrecio((float)$result->precio);
        $item->setActivo((bool)$result->activo);
        return $item;
    }

    public function getAllCatalogoProductoPorProducto(int $id, bool $full = true): Array
    {
        $productoId = $id;
        $sql = "SELECT *
                FROM producto_catalogo WHERE producto=:id";

        $db = $this->connect();
        $stmt = $db->prepare($sql);
        $stmt->bindParam(':id', $productoId, PDO::PARAM_INT);
        $stmt->execute();
        $items = $stmt->fetchAll(PDO::FETCH_OBJ);

        if ($items == null) {
            return Array();
        }

        $productoCatalogos = Array();
        foreach ($items as $item) {
            $item = $this->createFromResultset($item, $full ? ['*'] : [], $this->db);
            array_push($productoCatalogos, $item);
        }


        $this->disconnect();
        return $productoCatalogos;
    }

    public function getAllActiveSorted(): Array
    {
        $sql = "SELECT * FROM producto_catalogo";

        $db = $this->connect();
        $stmt = $db->prepare($sql);
        $stmt->execute();
        $items = $stmt->fetchAll(PDO::FETCH_OBJ);


        if ($items == null) {
            return Array();
        }

        $productoCatalogos = Array();
        foreach ($items as $item) {
            $productoCatalogo = $this->createFromResultset($item, ['*'], $db);
            array_push($productoCatalogos, $productoCatalogo);
        }

        $this->disconnect();
        return $productoCatalogos;
    }


}