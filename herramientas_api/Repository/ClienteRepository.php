<?php
/**
 * Created by PhpStorm.
 * User: nicol
 * Date: 06/09/2018
 * Time: 11:15 PM
 */
require_once 'Db.php';
require_once 'AbstractRepository.php';
require_once '../Model/Cliente.php';
require_once '../Repository/PersonaRepository.php';
require_once '../Repository/CategoriaClienteRepository.php';
require_once '../Repository/RevendedoraRepository.php';
require_once '../Commons/Exceptions/BadRequestException.php';


class ClienteRepository extends AbstractRepository
{

    /**
     * @param Cliente $cliente
     * @return null|Cliente
     * @throws BadRequestException
     */
    public function create(Cliente $cliente): ?Cliente
    {

        try {
            $db = $this->connect();
            $db->beginTransaction();
            $sqlCreate = "INSERT INTO herramientas.cliente(
                              categoria_cliente, 
                              direccion_entrega, 
                              ubicacion, 
                              fecha_alta_cliente, 
                              anio_nacimiento, 
                              madre, 
                              apodo, 
                              persona, 
                              activo, 
                              revendedora) 
                      VALUES (
                              :categoria_cliente, 
                              :direccion_entrega, 
                              :ubicacion, 
                              :fecha_alta_cliente, 
                              :anio_nacimiento, 
                              :madre, 
                              :apodo, 
                              :persona, 
                              :activo, 
                              :revendedora)";
            $categoriaCliente = (int)$cliente->getCategoriaCliente()->getId();
            $direccionEntrega = $cliente->getDireccionEntrega();
            //TODO: implementar ubicacion
            $ubicacion = null;
            $fechaAltaCliente = date('Y-m-d');
            $anioNacimiento = (string)$cliente->getAnioNacimiento()->format("Y-m-d");
            $madre = $cliente->getMadre();
            $apodo = $cliente->getApodo();
            $persona = (int)$cliente->getPersona()->getId();
            $activo = (bool)$cliente->getActivo();
            $revendedora = (int)$cliente->getRevendedora()->getId();
            $stmtCreate = $db->prepare($sqlCreate);
            $stmtCreate->bindParam(':categoria_cliente', $categoriaCliente, PDO::PARAM_INT);
            $stmtCreate->bindParam(':direccion_entrega', $direccionEntrega);
            $stmtCreate->bindParam(':ubicacion', $ubicacion);
            $stmtCreate->bindParam(':fecha_alta_cliente', $fechaAltaCliente);
            $stmtCreate->bindParam(':anio_nacimiento', $anioNacimiento);
            $stmtCreate->bindParam(':madre', $madre, PDO::PARAM_BOOL);
            $stmtCreate->bindParam(':apodo', $apodo);
            $stmtCreate->bindParam(':persona', $persona, PDO::PARAM_INT);
            $stmtCreate->bindParam(':activo', $activo, PDO::PARAM_BOOL);
            $stmtCreate->bindParam(':revendedora', $revendedora, PDO::PARAM_INT);
            $stmtCreate->execute();
            $cliente->setId($db->lastInsertId());
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
        return $cliente;
    }

    public function update(Cliente $cliente): void
    {
        $db = $this->connect();
        $db->beginTransaction();
        try {
            $sqlUpdate = "UPDATE herramientas.cliente 
                                SET 
                                  categoria_cliente=:categoria_cliente,
                                  direccion_entrega=:direccion_entrega,
                                  ubicacion=:ubicacion,
                                  anio_nacimiento=:anio_nacimiento,
                                  madre=:madre,
                                  apodo=:apodo,
                                  revendedora=:revendedora
                                WHERE
                                  (id =:id)
                                ";

            $categoriaCliente = (int)$cliente->getCategoriaCliente()->getId();
            $direccionEntrega = $cliente->getDireccionEntrega();
            //TODO: implementar ubicacion
            $ubicacion = null;
            $anioNacimiento = (string)$cliente->getAnioNacimiento()->format("Y-m-d");
            $madre = $cliente->getMadre();
            $apodo = $cliente->getApodo();
            $revendedora = (int)$cliente->getRevendedora()->getId();
            $id=$cliente->getId();
            $stmtUpdate = $db->prepare($sqlUpdate);
            $stmtUpdate->bindParam(':categoria_cliente', $categoriaCliente, PDO::PARAM_INT);
            $stmtUpdate->bindParam(':direccion_entrega', $direccionEntrega);
            $stmtUpdate->bindParam(':ubicacion', $ubicacion);
            $stmtUpdate->bindParam(':anio_nacimiento', $anioNacimiento);
            $stmtUpdate->bindParam(':madre', $madre, PDO::PARAM_BOOL);
            $stmtUpdate->bindParam(':apodo', $apodo);
            $stmtUpdate->bindParam(':revendedora', $revendedora, PDO::PARAM_INT);
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
            $sqlDelete = "DELETE FROM herramientas.cliente WHERE id=:id";
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

    public function deactivate(int $id): void
    {
        $db = $this->connect();
        $db->beginTransaction();
        try {
            $sqlDeactivate = "UPDATE herramientas.cliente SET activo = :activo, fecha_baja_cliente = :fecha_baja_cliente WHERE (id = :id);";
            $fechaBajaCliente = date('Y-m-d');
            $activo = false;

            //prepara inserción base de datos
            $stmtDeactivate = $db->prepare($sqlDeactivate);
            $stmtDeactivate->bindParam(':id', $id, PDO::PARAM_INT);
            $stmtDeactivate->bindParam(':activo', $activo, PDO::PARAM_BOOL);
            $stmtDeactivate->bindParam(':fecha_baja_cliente', $fechaBajaCliente);
            $stmtDeactivate->execute();
            $db->commit();

        } catch (Exception $e) {
            //TODO: implementar ex
            if ($db != null) $db->rollback();

            if ($e instanceof PDOException && $stmtDeactivate->errorInfo()[0] == 23000 && $stmtDeactivate->errorInfo()[1] == 1062) {
                $array = explode("'", $stmtDeactivate->errorInfo()[2]);
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
            $stmtDeactivate = null;
            $this->disconnect();
        }
    }

    public function activate(int $id): void
    {
        $db = $this->connect();
        $db->beginTransaction();
        try {
            $sqlActivate = "UPDATE herramientas.cliente SET activo = :activo, fecha_baja_cliente=:fecha_baja_cliente WHERE (id = :id);";
            $activo = true;
            $fechaBajaCliente = null;
            //prepara inserción base de datos
            $stmtActivate = $db->prepare($sqlActivate);
            $stmtActivate->bindParam(':id', $id, PDO::PARAM_INT);
            $stmtActivate->bindParam(':activo', $activo, PDO::PARAM_BOOL);
            $stmtActivate->bindParam(':fecha_baja_cliente', $fechaBajaCliente);
            $stmtActivate->execute();
            $db->commit();
            $stmtActivate->errorInfo();
        } catch (Exception $e) {
            if ($db != null) $db->rollback();


            if ($e instanceof PDOException && $stmtActivate->errorInfo()[0] == 23000 && $stmtActivate->errorInfo()[1] == 1062) {
                $array = explode("'", $stmtActivate->errorInfo()[2]);
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
            $stmtActivate = null;
            $this->disconnect();

        }
    }

    public function getAll(bool $full = true): Array
    {
        $sql = "SELECT *
                FROM cliente";

        $db = $this->connect();
        $stmt = $db->prepare($sql);
        $stmt->execute();
        $items = $stmt->fetchAll(PDO::FETCH_OBJ);

        if ($items == null) {
            return Array();
        }

        $clientes = Array();
        foreach ($items as $item) {
            $item = $this->createFromResultset($item, $full ? ['*'] : [], $this->db);
            array_push($clientes, $item);
        }


        $this->disconnect();
        return $clientes;
    }

    public function getAllActiveSorted(): Array
    {
        $sql = "SELECT cli.id, per.nombre, per.apellido FROM cliente cli
LEFT JOIN persona per on cli.persona = per.id
WHERE cli.activo=1";

        $db = $this->connect();
        $stmt = $db->prepare($sql);
        $stmt->execute();
        $items = $stmt->fetchAll(PDO::FETCH_OBJ);


        if ($items == null) {
            return Array();
        }

        $clientes = Array();
        foreach ($items as $item) {
            $cliente = $this->get($item->id);


            array_push($clientes, $cliente);
        }

        $this->disconnect();
        return $clientes;
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

    public function get(int $id, bool $full = true): ?Cliente
    {
        $sqlGet = "SELECT cli.*  FROM cliente cli                     
                    WHERE cli.id=:id
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

        $item = new Cliente();
        $item->setId((int)$result->id);
        if (in_array('*', $fields) || in_array('categoriaCliente', $fields))
            $item->setCategoriaCliente((new CategoriaClienteRepository($db))->get($result->categoria_cliente));
        $item->setDireccionEntrega($result->direccion_entrega);
        //TODO: implementar ubicacion
        /*if (in_array('*', $fields) || in_array('ubicacion', $fields))
            $item->setUbicacion((new UbicacionRepository($db))->get($result->ubicacion));*/

        $item->setFechaAltaCliente(new DateTime($result->fecha_alta_cliente));
        $item->setFechaBajaCliente(new DateTime($result->fecha_baja_cliente));
        $item->setAnioNacimiento(new DateTIme($result->anio_nacimiento));
        $item->setMadre((bool)$result->madre);
        $item->setApodo($result->apodo);
        if (in_array('*', $fields) || in_array('persona', $fields))
            $item->setPersona((new PersonaRepository($db))->get($result->persona));
        $item->setActivo((bool)$result->activo);
        if (in_array('*', $fields) || in_array('revendedora', $fields))
            $item->setRevendedora((new RevendedoraRepository($db))->get($result->revendedora));

        return $item;
    }

}