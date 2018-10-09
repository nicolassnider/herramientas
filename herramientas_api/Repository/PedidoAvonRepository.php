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
    public function create(PedidoAvon $pedidoAvon): ?PedidoAvon
    {

        try {
            $db = $this->connect();
            $db->beginTransaction();
            $sqlCreate = "INSERT INTO herramientas.pedido_avon(
                              cliente, 
                              revendedora, 
                              fecha_alta, 
                              recibido, 
                              entregado, 
                              cobrado) 
                      VALUES (
                              :cliente, 
                              :revendedora, 
                              :fecha_alta, 
                              :recibido, 
                              :entregado, 
                              :cobrado 
                              )";
            $cliente = (int)$pedidoAvon->getCliente()->getId();
            $revendedora = (int)$pedidoAvon->getRevendedora()->getId();
            $fechaAlta = date('Y-m-d');
            $recibido = false;
            $entregado = false;
            $cobrado = false;
            $stmtCreate = $db->prepare($sqlCreate);
            $stmtCreate->bindParam(':cliente', $cliente, PDO::PARAM_INT);
            $stmtCreate->bindParam(':revendedora', $revendedora, PDO::PARAM_INT);
            $stmtCreate->bindParam(':fecha_alta', $fechaAlta);
            $stmtCreate->bindParam(':recibido', $recibido, PDO::PARAM_BOOL);
            $stmtCreate->bindParam(':entregado', $entregado, PDO::PARAM_BOOL);
            $stmtCreate->bindParam(':cobrado', $cobrado, PDO::PARAM_BOOL);
            $stmtCreate->execute();
            $pedidoAvon->setId($db->lastInsertId());
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
        return $pedidoAvon;
    }

    public function update(PedidoAvon $pedidoAvon): void
    {
        $db = $this->connect();
        $db->beginTransaction();
        try {
            $sqlUpdate = "UPDATE herramientas.pedido_avon 
                                SET 
                                  cliente=:cliente,
                                  revendedora=:revendedora
                                WHERE
                                  (id =:id)
                                ";

            $cliente = (int)$pedidoAvon->getCliente()->getId();
            $revendedora = (int)$pedidoAvon->getRevendedora()->getId();
            $id = (int)$pedidoAvon->getId();
            $stmtUpdate = $db->prepare($sqlUpdate);
            $stmtUpdate->bindParam(':cliente', $cliente, PDO::PARAM_INT);
            $stmtUpdate->bindParam(':revendedora', $revendedora, PDO::PARAM_INT);
            $stmtUpdate->bindParam(':id', $id, PDO::PARAM_INT);
            $stmtUpdate->execute();
            $db->commit();
        } catch (Exception $e) {
            //TODO:implement ex
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
                FROM pedido_avon";

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



    public function grid(DataTableResponse $dataTablesResponse, DataTableRequest $dataTableRequest)
    {
        $db = $this->connect();

        $length = $dataTableRequest->getLength();
        $start = $dataTableRequest->getStart();
        $searchGeneral = $dataTableRequest->getSearch();
        $orderColumn = $dataTableRequest->getOrderColumn();
        $arrayColsFilter = $dataTableRequest->getArrayColsFilter();

        //RecordsTotal
        $consultaTotal = "SELECT COUNT(*) FROM persona";
        $stmtTotal = $db->prepare($consultaTotal);
        $stmtTotal->execute();
        $recordsTotal = $stmtTotal->fetchColumn();
        $dataTablesResponse->setRecordsTotal((int)$recordsTotal);

        //Prepara Consulta
        $consulta = "SELECT p.id,
                            p.nombre,
                            p.apellido,
                            p.es_activo,
                            p.es_usuario,
                            p.foto,
                            p.legajo_numero,
                            p.base,
                            b.descripcion as base_descripcion,
                            p.categoria,
                            pc.nombre AS categoria_nombre
                     FROM persona per
                        LEFT JOIN persona_categorias pc ON (p.categoria = pc.id)
                        LEFT JOIN bases b ON (p.base = b.id)
                     WHERE '1=1'";

        $stmt = $db->prepare($consulta);

        foreach ($arrayColsFilter as $columna) {
            if ($columna['search']['value'] != null) {
                $columnaSearchValue = $columna['search']['value'];
                switch ($columna['data']) {
                    case "esActivo":
                        $consulta .= " AND p.es_activo = '" . $columnaSearchValue . "' ";
                        break;
                    case "esUsuario":
                        $consulta .= " AND p.es_usuario = '" . $columnaSearchValue . "' ";
                        break;
                    case "nombre":
                        $consulta .= " AND p.nombre LIKE '%" . $columnaSearchValue . "%' ";
                        break;
                    case "apellido":
                        $consulta .= " AND p.apellido LIKE '%" . $columnaSearchValue . "%' ";
                        break;
                    case "legajoNumero":
                        $consulta .= " AND p.legajo_numero LIKE '%" . $columnaSearchValue . "%' ";
                        break;
                    case "base":
                        $consulta .= " AND b.id = '" . $columnaSearchValue . "' ";
                        break;
                    case "categoria":
                        $consulta .= " AND pc.id = '" . $columnaSearchValue . "' ";
                        break;
                }
            }
        }

        //RecordsFiltered
        $consultaRecordsFiltered = $consulta;
        $stmtRecordsFiltered = $db->prepare($consultaRecordsFiltered);
        $stmtRecordsFiltered->execute();
        $recordsFiltered = $stmtRecordsFiltered->rowCount();
        $dataTablesResponse->setRecordsFiltered($recordsFiltered);

        if ($searchGeneral != null) {
            $consulta .= " AND (p.nombre LIKE '%" . $searchGeneral . "%' OR p.apellido LIKE '%" . $searchGeneral . "%') ";
            $stmt = $db->prepare($consulta);
        }

        //Order by
        $columnaAOrdernar = $arrayColsFilter[$orderColumn['column']]['data'];
        switch ($columnaAOrdernar) {
            case "esUsuario":
                $consulta .= " ORDER BY p.es_usuario" . "  " . $orderColumn['dir'];
                break;
            case "apellido":
                $consulta .= " ORDER BY p.apellido" . "  " . $orderColumn['dir'];
                break;
            case "nombre":
                $consulta .= " ORDER BY p.nombre" . "  " . $orderColumn['dir'];
                break;
            case "legajoNumero":
                $consulta .= " ORDER BY p.legajo_numero" . "  " . $orderColumn['dir'];
                break;
            case "base":
                $consulta .= " ORDER BY b.descripcion" . "  " . $orderColumn['dir'];
                break;
            case "categoria":
                $consulta .= " ORDER BY pc.nombre" . "  " . $orderColumn['dir'];
                break;
        }

        //Limit Start, Length
        if ($length != -1) {
            $consulta .= " LIMIT " . $start . " ," . $length;
            $stmt = $db->prepare($consulta);
        }

        //Prepara Data
        $stmt->execute();
        $items = $stmt->fetchAll(PDO::FETCH_OBJ);
        $personasGrid = Array();

        foreach ($items as $item) {
            $base = null;
            if ($item->base != null) {
                $base = new Base();
                $base->setId((int)$item->base);
                $base->setDescripcion($item->base_descripcion);
            }

            $personaCategoria = null;
            if ($item->categoria != null) {
                $personaCategoria = new PersonaCategoria();
                $personaCategoria->setId((int)$item->categoria);
                $personaCategoria->setNombre($item->categoria_nombre);
            }

            $personaGrid = new PersonaGrid();
            $personaGrid->setId((int)$item->id);
            $personaGrid->setNombre($item->nombre);
            $personaGrid->setApellido($item->apellido);
            $personaGrid->setEsActivo((bool)$item->es_activo);
            $personaGrid->setLegajoNumero($item->legajo_numero);
            $personaGrid->setEsUsuario((bool)$item->es_usuario);
            $personaGrid->setFoto($item->foto);
            $personaGrid->setBase($base);
            $personaGrid->setCategoria($personaCategoria);
            array_push($personasGrid, $personaGrid);
        }
        $dataTableRequest->setLength($length);
        $dataTablesResponse->setData($personasGrid);

        $db = null;
        $personas = null;
        $items = null;
        $this->disconnect();
        return $dataTablesResponse;
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


    private function createFromResultset($result, array $fields, $db)
    {

        $item = new PedidoAvon();
        $item->setId((int)$result->id);
        if (in_array('*', $fields) || in_array('cliente', $fields))
            $item->setCliente((new ClienteRepository($db))->get($result->cliente));
        if (in_array('*', $fields) || in_array('revendedora', $fields))
            $item->setRevendedora((new RevendedoraRepository($db))->get($result->revendedora));

        $item->setFechaAlta(new DateTime($result->fecha_alta));
        $item->setFechaRecibido(new DateTime($result->fecha_recibido));
        $item->setRecibido((bool)$result->recibido);
        $item->setCobrado((bool)$result->entregado);
        $item->setCobrado((bool)$result->cobrado);
        return $item;
    }

}