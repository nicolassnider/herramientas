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
            $stmtCreate->bindParam(':categoria_cliente', $total);
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

    public function grid(DataTablesResponse $dataTablesResponse, DataTableRequest $dataTableRequest)
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