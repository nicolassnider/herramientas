<?php
/**
 * Created by PhpStorm.
 * User: nicol
 * Date: 07/10/2018
 * Time: 11:44 PM
 */

require_once 'Db.php';
require_once '../Repository/AbstractRepository.php';
require_once '../Model/Remito.php';
require_once '../Commons/Exceptions/BadRequestException.php';


class RemitoRepository extends AbstractRepository
{

    /**
     * @param Cliente $remito
     * @return null|Cliente
     * @throws BadRequestException
     */
    public function create(Remito $remito): ?Remito
    {

        try {
            $db = $this->connect();
            $db->beginTransaction();
            $sqlCreate = "INSERT INTO `herramientas`.`remito` (factura, numero_remito) VALUES (:factura,:numero_remito)
                                                                ";
            $factura = $remito->getFactura()->getId();
            $numeroRemito = $remito->getNumeroRemito();
            $stmtCreate = $db->prepare($sqlCreate);
            $stmtCreate->bindParam(':factura', $factura, PDO::PARAM_INT);
            $stmtCreate->bindParam(':numero_remito', $numeroRemito);
            $stmtCreate->execute();
            $remito->setId($db->lastInsertId());

            $db->commit();

        } catch (Exception $e) {
            if ($db != null) $db->rollback();
            if ($e instanceof PDOException && $stmtCreate->errorInfo()[0] == 23000 && $stmtCreate->errorInfo()[1] == 1062) {
                //TODO: implementar ex
                $array = explode("'", $stmtCreate->errorInfo()[2]);
                switch ($array[3]) {
                    case "NUMERO_REMITO_UNICO":
                        throw new BadRequestException("existe una ocurrencia para el remito id: " . $array[1]);
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
        return $remito;
    }

    public function get(int $id, bool $full = true): ?Remito
    {
        $sqlGet = "SELECT remito.*  FROM remito                     
                    WHERE remito.id=:id
                    ";

        $db = $this->connect();
        $stmtGet = $db->prepare($sqlGet);
        $stmtGet->bindParam(':id', $id, PDO::PARAM_INT);
        $stmtGet->execute();
        $result = $stmtGet->fetchObject();

        if ($result == null) {
            return null;
        }

        $remito = $this->createFromResultset($result, $full ? ['*'] : [], $this->db);
        $this->disconnect();
        return $remito;
    }


    private function createFromResultset($result, array $fields, $db)
    {

        $item = new Remito();
        $item->setId((int)$result->id);
        $item->setTotal((float)$result->total);
        $item->setFechaVencimiento(new DateTime($result->fecha_vencimiento));
        if (in_array('*', $fields) || in_array('campania', $fields))
            $item->setCampania((new CampaniaRepository($db))->get($result->campania));
        $item->setPagado((bool)$result->pagado);
        $item->setNroRemito($result->nro_remito);
        return $item;
    }

}