<?php
/**
 * Created by PhpStorm.
 * User: nicol
 * Date: 08/10/2018
 * Time: 7:56 AM
 */


require_once 'Db.php';
require_once 'AbstractRepository.php';
require_once '../Model/PedidoAvon.php';
require_once '../Repository/PersonaRepository.php';
require_once '../Repository/CategoriaClienteRepository.php';
require_once '../Repository/RevendedoraRepository.php';
require_once '../Commons/Exceptions/BadRequestException.php';

class PedidoAvonRepository extends AbstractRepository
{

    /**
     * @param Cliente $cliente
     * @return null|Cliente
     * @throws BadRequestException
     */
    public function create(Campania $campania): void
    {

        try {
            $db = $this->connect();
            $db->beginTransaction();
            $sqlCreate = "INSERT INTO herramientas.pedido_avon(
                              recibido, 
                              entregado, 
                              cobrado,
                              campania) 
                      VALUES (
                              :recibido, 
                              :entregado, 
                              :cobrado,
                              :campania)";
            $recibido = false;
            $entregado = false;
            $cobrado = false;
            $campaniaId = $campania->getId();
            $stmtCreate = $db->prepare($sqlCreate);
            $stmtCreate->bindParam(':recibido', $recibido, PDO::PARAM_BOOL);
            $stmtCreate->bindParam(':entregado', $entregado, PDO::PARAM_BOOL);
            $stmtCreate->bindParam(':cobrado', $cobrado, PDO::PARAM_BOOL);
            $stmtCreate->bindParam(':campania', $campaniaId, PDO::PARAM_INT);
            $stmtCreate->execute();

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

    }


    public function delete(int $id): void
    {
        $db = $this->connect();
        $db->beginTransaction();
        try {
            $sqlDelete = "DELETE FROM herramientas.pedido_avon WHERE id=:id";
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

    public function recibir(int $id): void
    {
        $db = $this->connect();
        $db->beginTransaction();
        try {
            $sql = "UPDATE herramientas.pedido_avon SET recibido = :recibido, fecha_recibido = :fecha_recibido WHERE (id = :id);";
            $fechaRecibido = date('Y-m-d');
            $recibido = true;


            //prepara inserción base de datos
            $stmt = $db->prepare($sql);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->bindParam(':recibido', $recibido, PDO::PARAM_BOOL);
            $stmt->bindParam(':fecha_recibido', $fechaRecibido);
            $stmt->execute();
            $db->commit();

        } catch (Exception $e) {
            //TODO: implementar ex
            if ($db != null) $db->rollback();

            if ($e instanceof PDOException && $stmt->errorInfo()[0] == 23000 && $stmt->errorInfo()[1] == 1062) {
                $array = explode("'", $stmt->errorInfo()[2]);
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
            $stmt = null;
            $this->disconnect();
        }
    }

    public function entregar(int $id): void
    {
        $db = $this->connect();
        $db->beginTransaction();
        try {
            $sql = "UPDATE herramientas.pedido_avon SET entregado = :entregado WHERE (id = :id);";
            $entregado = true;


            //prepara inserción base de datos
            $stmt = $db->prepare($sql);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->bindParam(':entregado', $entregado, PDO::PARAM_BOOL);
            $stmt->execute();
            $db->commit();

        } catch (Exception $e) {
            //TODO: implementar ex
            if ($db != null) $db->rollback();

            if ($e instanceof PDOException && $stmt->errorInfo()[0] == 23000 && $stmt->errorInfo()[1] == 1062) {
                $array = explode("'", $stmt->errorInfo()[2]);
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
            $stmt = null;
            $this->disconnect();
        }
    }

    public function cobrar(int $id): void
    {
        $db = $this->connect();
        $db->beginTransaction();
        try {
            $sql = "UPDATE herramientas.pedido_avon SET cobrado = :cobrado WHERE (id = :id);";
            $cobrado = true;


            //prepara inserción base de datos
            $stmt = $db->prepare($sql);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->bindParam(':cobrado', $cobrado, PDO::PARAM_BOOL);
            $stmt->execute();
            $db->commit();

        } catch (Exception $e) {
            //TODO: implementar ex
            if ($db != null) $db->rollback();

            if ($e instanceof PDOException && $stmt->errorInfo()[0] == 23000 && $stmt->errorInfo()[1] == 1062) {
                $array = explode("'", $stmt->errorInfo()[2]);
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
            $stmt = null;
            $this->disconnect();
        }
    }


    public function getAll(bool $full = true): Array
    {
        $sql = "SELECT *
                FROM pedido_avon ORDER BY pedido_avon.id DESC";

        $db = $this->connect();
        $stmt = $db->prepare($sql);
        $stmt->execute();
        $items = $stmt->fetchAll(PDO::FETCH_OBJ);

        if ($items == null) {
            return Array();
        }

        $pedidosAvon = Array();
        foreach ($items as $item) {
            $item = $this->createFromResultset($item, $full ? ['*'] : [], $this->db);
            array_push($pedidosAvon, $item);
        }


        $this->disconnect();
        return $pedidosAvon;
    }


    public function get(int $id, bool $full = true): ?PedidoAvon
    {
        $sqlGet = "SELECT ped.*  FROM pedido_avon ped                     
                    WHERE ped.id=:id
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

    public function getPedidoPorCampania(int $id, bool $full = true): ?PedidoAvon
    {
        $sqlGet = "SELECT ped.*  FROM pedido_avon ped                     
                    WHERE ped.campania=:campaniaId
                    ";
        $db = $this->connect();
        $stmtGet = $db->prepare($sqlGet);
        $stmtGet->bindParam(':campaniaId', $id, PDO::PARAM_INT);
        $stmtGet->execute();
        $result = $stmtGet->fetchObject();

        if ($result == null) {
            return null;
        }

        $cliente = $this->createFromResultset($result, $full ? ['*'] : [], $this->db);
        $this->disconnect();
        return $cliente;
    }

    public function getPedidoPorCampaniaActual(bool $full = true): ?PedidoAvon
    {
        $sqlGet = "SELECT ped.*  FROM pedido_avon ped                     
                    WHERE ped.campania=:campaniaId
                    ";
        $campania = new CampaniaRepository();
        $campaniaActiva = $campania->getCampaniaActiva();
        $campaniaId = $campaniaActiva->getId();
        $db = $this->connect();
        $stmtGet = $db->prepare($sqlGet);
        $stmtGet->bindParam(':campaniaId', $campaniaId, PDO::PARAM_INT);
        $stmtGet->execute();
        $result = $stmtGet->fetchObject();

        if ($result == null) {
            return null;
        }

        $cliente = $this->createFromResultset($result, $full ? ['*'] : [], $this->db);
        $this->disconnect();
        return $cliente;
    }


    private
    function createFromResultset($result, array $fields, $db)
    {

        $item = new PedidoAvon();
        $item->setId((int)$result->id);
        $item->setFechaRecibido(new DateTime($result->fecha_recibido));

        $item->setRecibido((bool)$result->recibido);
        $item->setCobrado((bool)$result->entregado);
        $item->setCobrado((bool)$result->cobrado);
        return $item;
    }

}