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
require_once '../Commons/Exceptions/BadRequestException.php';

class ProductoRepository extends AbstractRepository
{

    /**
     * @param Producto $producto
     * @return null|Producto
     * @throws BadRequestException
     */
    public function create(Producto $producto): ?Producto
    {

        try {
            $db = $this->connect();
            $db->beginTransaction();
            $sqlCreate = "INSERT INTO herramientas.producto(
                              descripcion, categoria, unidad) 
                      VALUES (
                               
                              :descripcion, 
                              :categoria, 
                              :unidad)";
            $descripcion = $producto->getDescripcion();
            $categoria = (int)$producto->getCategoria()->getId();
            $unidad=(int)$producto->getUnidad()->getId();
            $stmtCreate = $db->prepare($sqlCreate);
            $stmtCreate->bindParam(':descripcion', $descripcion);
            $stmtCreate->bindParam(':categoria', $categoria,PDO::PARAM_INT);
            $stmtCreate->bindParam(':unidad', $unidad,PDO::PARAM_INT);
            $stmtCreate->execute();
            $producto->setId($db->lastInsertId());
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
        return $producto;
    }

    public function update(Producto $producto): void
    {
        $db = $this->connect();
        $db->beginTransaction();
        try {
            $sqlUpdate = "UPDATE herramientas.producto 
                                SET                                   
                                  descripcion=:descripcion,
                                  categoria=:categoria,
                                  unidad=:unidad
                                  
                                WHERE
                                  (id =:id)";

            $descripcion = $producto->getDescripcion();
            $categoria = $producto->getCategoria()->getId();
            $unidad = $producto->getUnidad()->getId();
            $id=$producto->getId();
            $stmtUpdate = $db->prepare($sqlUpdate);
            $stmtUpdate->bindParam(':descripcion', $descripcion);
            $stmtUpdate->bindParam(':categoria', $categoria, PDO::PARAM_INT);
            $stmtUpdate->bindParam(':unidad', $unidad, PDO::PARAM_INT);
            $stmtUpdate->bindParam(':id', $id, PDO::PARAM_INT);
            $stmtUpdate->execute();
            $db->commit();
        } catch (Exception $e) {
            die(print_r(Array($stmtUpdate->errorInfo())));
            if ($db != null) $db->rollback();
            if ($e instanceof PDOException && $stmtUpdate->errorInfo()[0] == 23000 && $stmtUpdate->errorInfo()[1] == 1062) {
                $array = explode("'", $stmtUpdate->errorInfo()[2]);
                switch ($array[3]) {

                    case 'persona_unique':
                        throw new BadRequestException("La combinación " . " número " . " ya existe");
                        break;
                    default:
                        die(print_r($array));

                }
            } else {
                throw $e;
            }
        } finally {
            $stmtUpdate = null;
            $this->disconnect();

        }
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

    private function createFromResultset($result, array $fields, $db)
    {

        $item = new Producto();
        $item->setId((int)$result->id);
        $item->setDescripcion(($result->descripcion));
        if (in_array('*', $fields) || in_array('categoria', $fields))
            $item->setCategoria((new CategoriaProductoRepository($db))->get($result->categoria));
        if (in_array('*', $fields) || in_array('unidad', $fields))
            $item->setUnidad((new UnidadRepository($db))->get($result->unidad));

        return $item;
    }

    public function getAllActiveSorted(): Array
    {
        $sql = "SELECT pro.* FROM producto pro";

        $db = $this->connect();
        $stmt = $db->prepare($sql);
        $stmt->execute();
        $items = $stmt->fetchAll(PDO::FETCH_OBJ);


        if ($items == null) {
            return Array();
        }

        $productos = Array();
        foreach ($items as $item) {
            $producto = $this->get($item->id);


            array_push($productos, $producto);
        }

        $this->disconnect();
        return $productos;
    }

    public function get(int $id, bool $full = true): ?Producto
    {
        $sqlGet = "SELECT pro.*  FROM producto pro               
                    WHERE pro.id=:id
                    ";
        $db = $this->connect();
        $stmtGet = $db->prepare($sqlGet);
        $stmtGet->bindParam(':id', $id, PDO::PARAM_INT);
        $stmtGet->execute();
        $result = $stmtGet->fetchObject();

        if ($result == null) {
            return null;
        }

        $producto = $this->createFromResultset($result, $full ? ['*'] : [], $this->db);
        $this->disconnect();
        return $producto;
    }



}