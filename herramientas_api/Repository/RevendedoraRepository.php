<?php
/**
 * Created by PhpStorm.
 * User: nicol
 * Date: 06/09/2018
 * Time: 11:15 PM
 */
require_once 'Db.php';
require_once 'AbstractRepository.php';
require_once '../Model/Revendedora.php';
require_once '../Model/Usuario.php';
require_once '../Repository/PersonaRepository.php';
require_once '../Repository/CategoriaRevendedoraRepository.php';
require_once '../Repository/UsuarioRepository.php';
require_once '../Commons/Exceptions/BadRequestException.php';

class RevendedoraRepository extends AbstractRepository
{

    /**
     * @param Revendedora $revendedora
     * @return null|Revendedora
     * @throws BadRequestException
     */
    public function create(Revendedora $revendedora): ?Revendedora
    {

        try {
            $db = $this->connect();
            $db->beginTransaction();
            $sqlCreateRevendedora = "INSERT INTO herramientas.revendedora(categoria_revendedora, fecha_alta_revendedora, activo, persona )  
                      VALUES (:categoria_revendedora,:fecha_alta_revendedora,:activo,:persona)";
            $categoriaRevendedora = (int)$revendedora->getCategoriaRevendedora()->getId();
            $fechaAltaRevendedora = date('Y-m-d');
            $activo = (bool)$revendedora->getActivo();
            $persona = (int)$revendedora->getPersona()->getId();
            $stmtCreateRevendedora = $db->prepare($sqlCreateRevendedora);
            $stmtCreateRevendedora->bindParam(':categoria_revendedora', $categoriaRevendedora);
            $stmtCreateRevendedora->bindParam(':fecha_alta_revendedora', $fechaAltaRevendedora);
            $stmtCreateRevendedora->bindParam(':activo', $activo, PDO::PARAM_BOOL);
            $stmtCreateRevendedora->bindParam(':persona', $persona, PDO::PARAM_INT);
            $stmtCreateRevendedora->execute();
            $revendedora->setId($db->lastInsertId());
            (new UsuarioRepository($this->db))->create($revendedora);
            $db->commit();

        } catch (Exception $e) {
            if ($db != null) $db->rollback();
            if ($e instanceof PDOException && $stmtCreateRevendedora->errorInfo()[0] == 23000 && $stmtCreateRevendedora->errorInfo()[1] == 1062) {
                $array = explode("'", $stmtCreateRevendedora->errorInfo()[2]);
                switch ($array[3]) {
                    case "persona_unique":
                        throw new BadRequestException("existe una ocurrencia para la persona id: ".$array[1]);
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
        return $revendedora;
    }

    public function update(Revendedora $revendedora): void
    {
        $db = $this->connect();
        $db->beginTransaction();
        try {
            $sqlUpdateRevendedora = "UPDATE herramientas.revendedora 
                                SET 
                                 categoria_revendedora  =:categoria_revendedora, 
                                 persona=:persona                                 
                                WHERE 
                                ( id  = :id)
                                ";

            $categoriaRevendedora = $revendedora->getCategoriaRevendedora() != null ? $revendedora->getCategoriaRevendedora()->getId() : null;
            $persona=$revendedora->getPersona() != null ? $revendedora->getPersona()->getId() : null;
            $id = $revendedora->getId();

            //prepara inserción base de datos
            $stmtUpdateRevendedora = $db->prepare($sqlUpdateRevendedora);
            $stmtUpdateRevendedora->bindParam(':categoria_revendedora', $categoriaRevendedora, PDO::PARAM_INT);
            $stmtUpdateRevendedora->bindParam(':persona', $persona, PDO::PARAM_INT);
            $stmtUpdateRevendedora->bindParam(':id', $id, PDO::PARAM_INT);
            $stmtUpdateRevendedora->execute();
            $db->commit();
        } catch (Exception $e) {
            if ($db != null) $db->rollback();
            if ($e instanceof PDOException && $stmtUpdateRevendedora->errorInfo()[0] == 23000 && $stmtUpdateRevendedora->errorInfo()[1] == 1062) {
                $array = explode("'", $stmtUpdateRevendedora->errorInfo()[2]);
                switch ($array[3]) {

                    case 'persona_unique':
                        throw new BadRequestException("La combinación " . " número " .  " ya existe");
                        break;
                    default:
                        die(print_r($array));

                }
            } else {
                throw $e;
            }
        } finally {
            $stmtUpdateRevendedora = null;
            $this->disconnect();

        }
    }

    public function delete(int $id): void
    {
        $db = $this->connect();
        $db->beginTransaction();
        try {
            $sqlDeleteRevendedora = "DELETE FROM herramientas.revendedora WHERE id=:id";
            $stmtDeleteRevendedora = $db->prepare($sqlDeleteRevendedora);
            $stmtDeleteRevendedora->bindParam(':id', $id, PDO::PARAM_INT);
            $stmtDeleteRevendedora->execute();
            $db->commit();

        } catch (Exception $e) {
            if ($db != null) $db->rollback();
            if ($e instanceof PDOException && $stmtDeleteRevendedora->errorInfo()[0] == 23000 && $stmtDeleteRevendedora->errorInfo()[1] == 1451) {
                $array = explode("`", $stmtDeleteRevendedora->errorInfo()[2]);

                switch ($array[5]) {

                    case 'PERSONA_REVENDEDORA':
                        //TODO:verificar id de revendedora
                        $personaRepository = new PersonaRepository($this->db);
                        throw new BadRequestException("Existe una relación para la persona " . $personaRepository->get($id)->getNombre() . " " . $personaRepository->get($id)->getApellidoSegundo() . " con Revendedora id X");
                        break;
                    default:die(print_r($array));
                }
            } else {
                throw $e;
            }
        } finally {

            $stmtDeleteRevendedora = null;
            $this->disconnect();

        }
    }

    public function deactivate(int $id): void
    {
        $db = $this->connect();
        $db->beginTransaction();
        try {
            $sqlDeactivateRevendedora = "UPDATE herramientas.revendedora SET activo = :activo, fecha_baja_revendedora = :fecha_baja_revendedora WHERE (id = :id);";
            $fechaBajaRevendedora=date('Y-m-d');
            $activo=false;

            //prepara inserción base de datos
            $stmtDeactivateRevendedora = $db->prepare($sqlDeactivateRevendedora);
            $stmtDeactivateRevendedora->bindParam(':id', $id, PDO::PARAM_INT);
            $stmtDeactivateRevendedora->bindParam(':activo', $activo, PDO::PARAM_BOOL);
            $stmtDeactivateRevendedora->bindParam(':fecha_baja_persona', $fechaBajaRevendedora);
            $stmtDeactivateRevendedora->execute();
            $db->commit();

        } catch (Exception $e) {
            if ($db != null) $db->rollback();

            if ($e instanceof PDOException && $stmtDeactivateRevendedora->errorInfo()[0] == 23000 && $stmtDeactivateRevendedora->errorInfo()[1] == 1062) {
                $array = explode("'", $stmtDeactivateRevendedora->errorInfo()[2]);
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
            $stmtDeactivateRevendedora = null;
            $this->disconnect();
        }
    }

    public function activate(int $id): void
    {
        $db = $this->connect();
        $db->beginTransaction();
        try {
            $sqlActivateRevendedora = "UPDATE herramientas.revendedora SET activo = :activo, fecha_baja_revendedora=:fecha_baja_revendedora WHERE (id = :id);";
            $activo=true;
            $fecha_baja_persona=null;
            //prepara inserción base de datos
            $stmtActivateRevendedora = $db->prepare($sqlActivateRevendedora);
            $stmtActivateRevendedora->bindParam(':id', $id, PDO::PARAM_INT);
            $stmtActivateRevendedora->bindParam(':activo', $activo, PDO::PARAM_BOOL);
            $stmtActivateRevendedora->bindParam(':fecha_baja_persona', $fecha_baja_persona);
            $stmtActivateRevendedora->execute();
            $db->commit();
            $stmtActivateRevendedora->errorInfo();
        } catch (Exception $e) {
            if ($db != null) $db->rollback();


            if ($e instanceof PDOException && $stmtActivateRevendedora->errorInfo()[0] == 23000 && $stmtActivateRevendedora->errorInfo()[1] == 1062) {
                $array = explode("'", $stmtActivateRevendedora->errorInfo()[2]);
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
            $stmtActivateRevendedora = null;
            $this->disconnect();

        }
    }

    public function getAll(bool $full = true): Array
    {
        $sql = "SELECT *
                FROM revendedora";

        $db = $this->connect();
        $stmt = $db->prepare($sql);
        $stmt->execute();
        $items = $stmt->fetchAll(PDO::FETCH_OBJ);


        if ($items == null) {
            return Array();
        }

        $revendedoras = Array();
        foreach ($items as $item) {
            $item = $this->createFromResultset($item, $full ? ['*'] : [], $this->db);
            array_push($revendedoras, $item);
        }


        $this->disconnect();
        return $revendedoras;
    }

    public function getAllActiveSorted(): Array
    {
        $sql = "SELECT rev.id, per.nombre, per.apellido FROM revendedora rev
LEFT JOIN persona per on rev.persona = per.id
WHERE per.activo=1";

        $db = $this->connect();
        $stmt = $db->prepare($sql);
        $stmt->execute();
        $items = $stmt->fetchAll(PDO::FETCH_OBJ);


        if ($items == null) {
            return Array();
        }

        $revendedoras = Array();
        foreach ($items as $item) {
            $revendedora = $this->get($item->id);


            array_push($revendedoras, $revendedora);
        }

        $this->disconnect();
        return $revendedoras;
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

    public function get(int $id, bool $full = true): ?Revendedora
    {
        $sqlGet = "SELECT rev.*, usu.id usu_id  FROM revendedora rev 
                    LEFT JOIN usuario usu on rev.id = usu.revendedora
                    WHERE rev.id=:id
                    ";

        $db = $this->connect();
        $stmtGet = $db->prepare($sqlGet);
        $stmtGet->bindParam(':id', $id, PDO::PARAM_INT);
        $stmtGet->execute();
        $result = $stmtGet->fetchObject();

        if ($result == null) {
            return null;
        }

        $revendedora = $this->createFromResultset($result, $full ? ['*'] : [], $this->db);

        $this->disconnect();
        return $revendedora;
    }


    private function createFromResultset($result, array $fields, $db)
    {

        $item = new Revendedora();
        $item->setId((int)$result->id);
        $item->setFechaAltaRevendedora(new DateTime($result->fecha_alta_revendedora));
        if ($result->fecha_baja_revendedora) {
            $item->setFechaBajaRevendedora(DateTime::createFromFormat('Y-m-d', $result->fecha_baja_revendedora));
        }
        $item->setActivo((bool)$result->activo);
        if (in_array('*', $fields) || in_array('categoriaRevendedora', $fields))
            $item->setCategoriaRevendedora((new CategoriaRevendedoraRepository($db))->get($result->categoria_revendedora));
        if (in_array('*', $fields) || in_array('persona', $fields))
            $item->setPersona((new PersonaRepository($db))->get($result->persona));
        if (in_array('*', $fields) || in_array('usuario', $fields))
            $item->setUsuario((new UsuarioRepository($db))->get($result->usu_id));
        return $item;
    }

}