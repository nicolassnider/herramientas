<?php
/**
 * Created by PhpStorm.
 * User: nicol
 * Date: 08/10/2018
 * Time: 9:36 PM
 */


require_once 'Db.php';
require_once 'AbstractRepository.php';
require_once '../Model/Unidad.php';

class UnidadRepository extends AbstractRepository
{

    /**
     * @param Cliente $unidad
     * @return null|Cliente
     * @throws BadRequestException
     */
    public function create(Unidad $unidad): ?Unidad
    {

        try {
            $db = $this->connect();
            $db->beginTransaction();
            $sqlCreate = "INSERT INTO herramientas.unidad(
                              descripcion) 
                      VALUES (
                              :descripcion)";
            $descripcion = $unidad->getDescripcion();
            $stmtCreate = $db->prepare($sqlCreate);
            $stmtCreate->bindParam(':direccion_entrega', $descripcion);
            $stmtCreate->execute();
            $unidad->setId($db->lastInsertId());
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
        return $unidad;
    }

    public function update(Unidad $unidad): void
    {
        $db = $this->connect();
        $db->beginTransaction();
        try {
            $sqlUpdate = "UPDATE herramientas.unidad 
                                SET 
                                  descripcion=:descripcion
                                WHERE
                                  (id =:id)
                                ";

            $descripcion = $unidad->getDescripcion();
            $id=$unidad->getId();
            $stmtUpdate = $db->prepare($sqlUpdate);
            $stmtUpdate->bindParam(':descripcion', $descripcion);
            $stmtUpdate->bindParam(':id', $id, PDO::PARAM_INT);
            $stmtUpdate->execute();
            $db->commit();
        } catch (Exception $e) {
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
            $sqlDelete = "DELETE FROM herramientas.unidad WHERE id=:id";
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
                FROM unidad";

        $db = $this->connect();
        $stmt = $db->prepare($sql);
        $stmt->execute();
        $items = $stmt->fetchAll(PDO::FETCH_OBJ);

        if ($items == null) {
            return Array();
        }

        $unidades = Array();
        foreach ($items as $item) {
            $item = $this->createFromResultset($item, $full ? ['*'] : [], $this->db);
            array_push($unidades, $item);
        }


        $this->disconnect();
        return $unidades;
    }

    public function getAllActiveSorted(): Array
    {
        $sql = "SELECT * FROM unidad uni";

        $db = $this->connect();
        $stmt = $db->prepare($sql);
        $stmt->execute();
        $items = $stmt->fetchAll(PDO::FETCH_OBJ);


        if ($items == null) {
            return Array();
        }

        $unidades = Array();
        foreach ($items as $item) {
            $unidad = $this->get($item->id);


            array_push($unidades, $unidad);
        }

        $this->disconnect();
        return $unidades;
    }



    public function get(int $id, bool $full = true): ?Unidad
    {
        $sqlGet = "SELECT uni.*  FROM unidad uni                     
                    WHERE uni.id=:id
                    ";

        $db = $this->connect();
        $stmtGet = $db->prepare($sqlGet);
        $stmtGet->bindParam(':id', $id, PDO::PARAM_INT);
        $stmtGet->execute();
        $result = $stmtGet->fetchObject();

        if ($result == null) {
            return null;
        }

        $unidad = $this->createFromResultset($result, $full ? ['*'] : [], $this->db);
        $this->disconnect();

        return $unidad;
    }


    private function createFromResultset($result, array $fields, $db)
    {

        $item = new Unidad();
        $item->setId((int)$result->id);
        $item->setDescripcion($result->descripcion);


        return $item;
    }

}