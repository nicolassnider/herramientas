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

    public function update(Remito $remito): void
    {
        $db = $this->connect();
        $db->beginTransaction();
        try {
            $sqlUpdate = "UPDATE herramientas.remito 
                                SET 
                                factura  =:factura, 
                                 numero_remito  = :numero_remito
                                  
                                WHERE 
                                ( id  = :id)
                                ";

            $factura = $remito->getFactura()->getId();
            $tipoDocumento = $remito->getTipoDocumento() != null ? $remito->getTipoDocumento()->getId() : null;
            $documento = $remito->getDocumento();
            $nombre = $remito->getNombre();
            $nombreSegundo = $remito->getNombreSegundo();
            $apellido = $remito->getApellido();
            $apellidoSegundo = $remito->getApellidoSegundo();
            $telefono = $remito->getTelefono();
            $email = $remito->getEmail();
            $activo = $remito->getActivo();
            $localidad = $remito->getLocalidad() != null ? $remito->getLocalidad()->getId() : null;
            $esUsuario = $remito->getEsUsuario();
            $id = $remito->getId();

            //prepara inserción base de datos
            $stmtUpdate = $db->prepare($sqlUpdate);
            $stmtUpdate->bindParam(':tipo_documento', $tipoDocumento, PDO::PARAM_INT);
            $stmtUpdate->bindParam(':documento', $documento);
            $stmtUpdate->bindParam(':nombre', $nombre);
            $stmtUpdate->bindParam(':nombre_segundo', $nombreSegundo);
            $stmtUpdate->bindParam(':apellido', $apellido);
            $stmtUpdate->bindParam(':apellido_segundo', $apellidoSegundo);
            $stmtUpdate->bindParam(':telefono', $telefono);
            $stmtUpdate->bindParam(':email', $email);
            $stmtUpdate->bindParam(':activo', $activo, PDO::PARAM_BOOL);
            $stmtUpdate->bindParam(':localidad', $localidad, PDO::PARAM_INT);
            $stmtUpdate->bindParam(':es_usuario', $esUsuario, PDO::PARAM_BOOL);
            $stmtUpdate->bindParam(':id', $id, PDO::PARAM_INT);
            $stmtUpdate->execute();
            $db->commit();
        } catch (Exception $e) {
            if ($db != null) $db->rollback();
            if ($e instanceof PDOException && $stmtUpdate->errorInfo()[0] == 23000 && $stmtUpdate->errorInfo()[1] == 1062) {
                $array = explode("'", $stmtUpdate->errorInfo()[2]);
                switch ($array[3]) {

                    case 'documento_unico':
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
            $stmtUpdate = null;
            $this->disconnect();

        }
    }

    public function getRemitosPorFactura(int $id, bool $full = true): ?array
    {
        $sqlGet = "SELECT remito.*  FROM remito                     
                    WHERE remito.factura=:id
                    ";

        $db = $this->connect();
        $stmtGet = $db->prepare($sqlGet);
        $stmtGet->bindParam(':id', $id, PDO::PARAM_INT);
        $stmtGet->execute();
        $results = $stmtGet->fetchAll(PDO::FETCH_OBJ);

        if ($results == null) {
            return Array();
        }

        $remitos = Array();


        foreach ($results as $result) {
            $remito = $this->createFromResultset($result, $full ? ['*'] : [], $this->db);
            array_push($remitos, $remito);
        }
        $this->disconnect();
        return $remitos;
    }


    private function createFromResultset($result, array $fields, $db)
    {

        $item = new Remito();
        $item->setId((int)$result->id);
        $item->setFactura((new FacturaRepository($db))->get($result->factura));
        $item->setNumeroRemito($result->numero_remito);

        return $item;
    }

}