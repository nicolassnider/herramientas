<?php
/**
 * Created by PhpStorm.
 * User: nicol
 * Date: 07/10/2018
 * Time: 11:44 PM
 */

require_once 'Db.php';
require_once '../Repository/AbstractRepository.php';
require_once '../Model/Factura.php';
require_once '../Commons/Exceptions/BadRequestException.php';
require_once '../Repository/CampaniaRepository.php';

class FacturaRepository extends AbstractRepository
{

    /**
     * @param Cliente $factura
     * @return null|Cliente
     * @throws BadRequestException
     */
    public function create(Factura $factura): ?Factura
    {

        try {
            $db = $this->connect();
            $db->beginTransaction();
            $sqlCreate = "INSERT INTO `herramientas`.`factura` (
                                                                total, 
                                                                fecha_vencimiento, 
                                                                campania, 
                                                                pagado, 
                                                                nro_factura) 
                                                        VALUES (
                                                                :total, 
                                                                :fecha_vencimiento, 
                                                                :campania, 
                                                                :pagado, 
                                                                :nro_factura);
                                                                ";
            $total=$factura->getTotal();
            $fechaVencimiento=(string)$factura->getFechaVencimiento()->format("Y-m-d");
            $campania=$factura->getCampania()->getId();
            $pagado=(bool)$factura->getPagado();
            $nroFactura=$factura->getNroFactura();
            $stmtCreate = $db->prepare($sqlCreate);
            $stmtCreate->bindParam(':total', $total);
            $stmtCreate->bindParam(':fecha_vencimiento', $fechaVencimiento);
            $stmtCreate->bindParam(':campania', $campania,PDO::PARAM_INT);
            $stmtCreate->bindParam(':pagado', $pagado,PDO::PARAM_BOOL);
            $stmtCreate->bindParam(':nro_factura', $nroFactura);
            $stmtCreate->execute();
            $factura->setId($db->lastInsertId());

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
        return $factura;
    }

    public function update(Factura $factura): void
    {
        $db = $this->connect();
        $db->beginTransaction();
        try {
            $sqlUpdate = "UPDATE herramientas.factura 
                                SET 
                                  total=:total,
                                  fecha_vencimiento=:fecha_vencimiento,
                                  campania=:campania,
                                  pagado=:pagado,
                                  nro_factura=:nro_factura
                                WHERE
                                  (id =:id)
                                ";

            $total=$factura->getTotal();
            $fechaVencimiento=(string)$factura->getFechaVencimiento()->format("Y-m-d");
            $campania=$factura->getCampania()->getId();
            $pagado=(bool)$factura->getPagado();
            $nroFactura=$factura->getNroFactura();
            $id=$factura->getId();
            $stmtUpdate = $db->prepare($sqlUpdate);
            $stmtUpdate->bindParam(':categoria_cliente', $total);
            $stmtUpdate->bindParam(':fecha_vencimiento', $fechaVencimiento);
            $stmtUpdate->bindParam(':campania', $campania,PDO::PARAM_INT);
            $stmtUpdate->bindParam(':pagado', $pagado,PDO::PARAM_BOOL);
            $stmtUpdate->bindParam(':nro_factura', $nroFactura);
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
            $sqlDelete = "DELETE FROM herramientas.factura WHERE id=:id";
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

    public function Pagar(int $id): void
    {
        $db = $this->connect();
        $db->beginTransaction();
        try {
            $sqlPagar = "UPDATE herramientas.factura SET pagado = :pagado WHERE (id = :id);";
            $fechaBajaCliente = date('Y-m-d');
            $pagado = true;

            //prepara inserción base de datos
            $stmtPagar = $db->prepare($sqlPagar);
            $stmtPagar->bindParam(':id', $id, PDO::PARAM_INT);
            $stmtPagar->bindParam(':pagado', $pagado, PDO::PARAM_BOOL);
            $stmtPagar->execute();
            $db->commit();

        } catch (Exception $e) {
            //TODO: implementar ex
            if ($db != null) $db->rollback();

            if ($e instanceof PDOException && $stmtPagar->errorInfo()[0] == 23000 && $stmtPagar->errorInfo()[1] == 1062) {
                $array = explode("'", $stmtPagar->errorInfo()[2]);
                switch ($array[3]) {

                    case 'nro_factura_unico':
                        $array2 = explode("-", $array[1]);
                        $TipoDocumentoRepository = new TipoDocumentoRepository($this->db);
                        $nombreDocumento = $TipoDocumentoRepository->get($array2[0])->getDescripcion();
                        throw new BadRequestException("La combinación " . $nombreDocumento . " número " . $array2[1] . " ya existe");
                        break;
                    default:
                        die(print_r($array));

                }
            } else {
                throw $e;
            }
        } finally {
            $stmtPagar = null;
            $this->disconnect();
        }
    }

    public function getAll(bool $full = true): Array
    {
        $sql = "SELECT *
                FROM factura";

        $db = $this->connect();
        $stmt = $db->prepare($sql);
        $stmt->execute();
        $items = $stmt->fetchAll(PDO::FETCH_OBJ);

        if ($items == null) {
            return Array();
        }

        $facturas = Array();
        foreach ($items as $item) {
            $item = $this->createFromResultset($item, $full ? ['*'] : [], $this->db);
            array_push($facturas, $item);
        }


        $this->disconnect();
        return $facturas;
    }

    public function getAllSorted(): Array
    {
        $sql = "SELECT * FROM factura";

        $db = $this->connect();
        $stmt = $db->prepare($sql);
        $stmt->execute();
        $items = $stmt->fetchAll(PDO::FETCH_OBJ);


        if ($items == null) {
            return Array();
        }

        $facturas = Array();
        foreach ($items as $item) {
            $factura = $this->get($item->id);


            array_push($facturas, $factura);
        }

        $this->disconnect();
        return $facturas;
    }



    public function get(int $id, bool $full = true): ?Factura
    {
        $sqlGet = "SELECT fac.*  FROM factura fac                     
                    WHERE fac.id=:id
                    ";

        $db = $this->connect();
        $stmtGet = $db->prepare($sqlGet);
        $stmtGet->bindParam(':id', $id, PDO::PARAM_INT);
        $stmtGet->execute();
        $result = $stmtGet->fetchObject();

        if ($result == null) {
            return null;
        }

        $cliente = $this->createFromResultset($result, $full ? ['*'] : [], $this->db);
        $this->disconnect();
        return $cliente;
    }


    private function createFromResultset($result, array $fields, $db)
    {

        $item = new Factura();
        $item->setId((int)$result->id);
        $item->setTotal((float)$result->total);
        $item->setFechaVencimiento(new DateTime($result->fecha_vencimiento));
        if (in_array('*', $fields) || in_array('campania', $fields))
            $item->setCampania((new CampaniaRepository($db))->get($result->campania));
        $item->setPagado((bool)$result->pagado);
        $item->setNroFactura($result->nro_factura);
        return $item;
    }

}