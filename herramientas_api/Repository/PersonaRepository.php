<?php
/**
 * Created by Nicolás Snider
 * Date: 09/07/2018
 * Time: 12:33 PM
 */
require_once 'Db.php';
require_once '../Model/Persona.php';
require_once '../Repository/AbstractRepository.php';
require_once '../Repository/LocalidadRepository.php';
require_once '../Repository/TipoDocumentoRepository.php';


class PersonaRepository extends AbstractRepository
{
    public function getAll(): Array
    {
        $sqlGetAll = "SELECT persona.*,r.id AS r_id, u.id AS u_id  FROM persona
                        LEFT JOIN revendedora r on persona.id = r.persona
                        LEFT JOIN usuario u on r.id = u.revendedora";

        $db = $this->connect();
        $db->beginTransaction();
        $stmtGetAll = $db->prepare($sqlGetAll);
        $stmtGetAll->execute();
        $items = $stmtGetAll->fetchAll(PDO::FETCH_OBJ);
        $db->commit();

        if ($items == null) {
            return Array();
        }

        $personas = Array();
        foreach ($items as $item) {
            $persona = new Persona();

            $persona->setId((int)$item->id);
            $tipoDocumento = ((new TipoDocumentoRepository($this->db))->get((int)$item->tipo_documento));
            $persona->setTipoDocumento($tipoDocumento);
            $persona->setDocumento($item->documento);
            $persona->setTelefono($item->telefono);
            $persona->setEmail($item->email);
            $persona->setActivo((bool)$item->activo);
            $localidad = ((new LocalidadRepository($this->db))->get((int)$item->localidad));
            $persona->setLocalidad($localidad);
            $persona->setNombre($item->nombre);
            $persona->setNombreSegundo($item->nombre_segundo);
            $persona->setApellido($item->apellido);
            $persona->setApellidoSegundo($item->apellido_segundo);
            $persona->setFechaAltaPersona(new DateTime ($item->fecha_alta_persona));
            $persona->setEsUsuario((bool)$item->es_usuario);
            $usuario = ((new UsuarioRepository($this->db))->get((int)$item->u_id));
            $persona->setUsuario($usuario);


            array_push($personas, $persona);
        }


        $this->disconnect();
        return $personas;
    }

    public function get(int $id, bool $full = true): ?Persona
    {

        try {
            $db = $this->connect();

            $sqlGet = "SELECT persona.*,r.id AS r_id, u.id AS u_id  FROM persona
                        LEFT JOIN revendedora r on persona.id = r.persona
                        LEFT JOIN usuario u on r.id = u.revendedora
                        WHERE persona.id=:id";

            $stmtGet = $db->prepare($sqlGet);
            $stmtGet->bindParam(':id', $id);
            $stmtGet->execute();

            $item = $stmtGet->fetchObject();


            if ($item == null) {
                return null;
            }

            $persona = new Persona();

            $persona->setId((int)$item->id);
            $tipoDocumento = ((new TipoDocumentoRepository($this->db))->get((int)$item->tipo_documento));
            $persona->setTipoDocumento($tipoDocumento);
            $persona->setDocumento($item->documento);
            $persona->setTelefono($item->telefono);
            $persona->setEmail($item->email);
            $persona->setActivo((bool)$item->activo);
            $localidad = ((new LocalidadRepository($this->db))->get((int)$item->localidad));
            $persona->setLocalidad($localidad);
            $persona->setNombre($item->nombre);
            $persona->setNombreSegundo($item->nombre_segundo);
            $persona->setApellido($item->apellido);
            $persona->setApellidoSegundo($item->apellido_segundo);
            $persona->setFechaAltaPersona(new DateTime ($item->fecha_alta_persona));
            $persona->setEsUsuario((bool)$item->es_usuario);
            $usuario = ((new UsuarioRepository($this->db))->get((int)$item->u_id));
            $persona->setUsuario($usuario);

        } catch (PDOException $e) {
            throw  $e;

        } finally {
            $stmtGet = null;
            $db = null;
            $this->disconnect();
            return $persona;
        }
    }

    public function create(Persona $persona)
    {
        $db = $this->connect();
        $db->beginTransaction();

        try {
            $sqlCreate = "INSERT INTO herramientas.persona(
                                  tipo_documento, 
                                  documento, 
                                  nombre, 
                                  nombre_segundo, 
                                  apellido, 
                                  apellido_segundo, 
                                  telefono, 
                                  email, 
                                  activo,
                                  localidad,
                                  es_usuario, 
                                  fecha_alta_persona)
                                  VALUES (
                                  :tipo_documento,
                                  :documento,
                                  :nombre,
                                  :nombre_segundo,
                                  :apellido,
                                  :apellido_segundo,
                                  :telefono,
                                  :email,
                                  :activo,
                                  :localidad,
                                  :es_usuario,
                                  :fecha_alta_persona
                                                )";

            $tipoDocumento = $persona->getTipoDocumento() != null ? $persona->getTipoDocumento()->getId() : null;
            $documento = $persona->getDocumento();
            $nombre = $persona->getNombre();
            $nombreSegundo = $persona->getNombreSegundo();
            $apellido = $persona->getApellido();
            $apellidoSegundo = $persona->getApellidoSegundo();
            $telefono = $persona->getTelefono();
            $email = $persona->getEmail();
            $activo = $persona->getActivo();
            $localidad = $persona->getLocalidad() != null ? $persona->getLocalidad()->getId() : null;
            $esUsuario = $persona->getEsUsuario();
            $fechaAltaPersona = date('Y-m-d');


            //prepara inserción base de datos
            $stmtCreate = $db->prepare($sqlCreate);
            $stmtCreate->bindParam(':tipo_documento', $tipoDocumento, PDO::PARAM_INT);
            $stmtCreate->bindParam(':documento', $documento);
            $stmtCreate->bindParam(':nombre', $nombre);
            $stmtCreate->bindParam(':nombre_segundo', $nombreSegundo);
            $stmtCreate->bindParam(':apellido', $apellido);
            $stmtCreate->bindParam(':apellido_segundo', $apellidoSegundo);
            $stmtCreate->bindParam(':telefono', $telefono);
            $stmtCreate->bindParam(':email', $email);
            $stmtCreate->bindParam(':activo', $activo, PDO::PARAM_BOOL);
            $stmtCreate->bindParam(':localidad', $localidad, PDO::PARAM_INT);
            $stmtCreate->bindParam(':es_usuario', $esUsuario, PDO::PARAM_BOOL);
            $stmtCreate->bindParam(':fecha_alta_persona', $fechaAltaPersona);
            $stmtCreate->execute();
            $persona->setId($db->lastInsertId());
            $db->commit();


        } catch (Exception $e) {
            if ($db != null) $db->rollback();
            if ($e instanceof PDOException && $stmtCreate->errorInfo()[0] == 23000 && $stmtCreate->errorInfo()[1] == 1062) {
                $array = explode("'", $stmtCreate->errorInfo()[2]);
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

        return PersonaRepository::get($persona->getId());
    }

    public function update(Persona $persona): void
    {
        $db = $this->connect();
        $db->beginTransaction();
        try {
            $sqlUpdate = "UPDATE herramientas.persona 
                                SET 
                                tipo_documento  =:tipo_documento, 
                                 documento  = :documento, 
                                 nombre  = :nombre, 
                                 nombre_segundo  = :nombre_segundo, 
                                 apellido  = :apellido, 
                                 apellido_segundo  = :apellido_segundo, 
                                 telefono  = :telefono,
                                 email=:email, 
                                 activo  = :activo, 
                                 localidad  = :localidad,                                   
                                 es_usuario  = :es_usuario
                                  
                                WHERE 
                                ( id  = :id)
                                ";

            $tipoDocumento = $persona->getTipoDocumento() != null ? $persona->getTipoDocumento()->getId() : null;
            $documento = $persona->getDocumento();
            $nombre = $persona->getNombre();
            $nombreSegundo = $persona->getNombreSegundo();
            $apellido = $persona->getApellido();
            $apellidoSegundo = $persona->getApellidoSegundo();
            $telefono = $persona->getTelefono();
            $email = $persona->getEmail();
            $activo = $persona->getActivo();
            $localidad = $persona->getLocalidad() != null ? $persona->getLocalidad()->getId() : null;
            $esUsuario = $persona->getEsUsuario();
            $id = $persona->getId();

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

    public function delete(int $id): void
    {
        $db = $this->connect();
        $db->beginTransaction();
        try {
            $sqlDelete = "DELETE FROM herramientas.persona WHERE id=:id";
            $stmtDelete = $db->prepare($sqlDelete);
            $stmtDelete->bindParam(':id', $id, PDO::PARAM_INT);
            $stmtDelete->execute();
            $db->commit();

        } catch (Exception $e) {
            if ($db != null) $db->rollback();
            if ($e instanceof PDOException && $stmtDelete->errorInfo()[0] == 23000 && $stmtDelete->errorInfo()[1] == 1451) {
                $array = explode("`", $stmtDelete->errorInfo()[2]);

                switch ($array[5]) {

                    case 'PERSONA_REVENDEDORA':
                        //TODO:verificar id de revendedora
                        $personaRepository = new PersonaRepository($this->db);
                        throw new BadRequestException("Existe una relación para la persona " . $personaRepository->get($id)->getNombre() . " " . $personaRepository->get($id)->getApellidoSegundo() . " con Revendedora id X");
                        break;
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
            $sqlDeactivate = "UPDATE herramientas.persona SET activo = '0', fecha_baja_persona = :fecha_baja_persona WHERE (id = :id);";
            $fechaBajaPersona=date('Y-m-d');
            //prepara inserción base de datos
            $stmtDeactivate = $db->prepare($sqlDeactivate);
            $stmtDeactivate->bindParam(':id', $id, PDO::PARAM_INT);
            $stmtDeactivate->bindParam(':fecha_baja_persona', $fechaBajaPersona);
            $stmtDeactivate->execute();
            $db->commit();
        } catch (Exception $e) {
            if ($db != null) $db->rollback();
            $array= $stmtDeactivate->errorInfo();
            //TODO:verificar ex
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
            $stmtDeletePersona = null;
            $this->disconnect();
        }
    }

    public function activate(int $id): void
    {
        $db = $this->connect();
        $db->beginTransaction();
        try {
            $sqlActivate = "UPDATE herramientas.persona SET activo = '1' WHERE (id = :id);";

            //prepara inserción base de datos
            $stmtActivate = $db->prepare($sqlActivate);
            $stmtActivate->bindParam(':id', $id, PDO::PARAM_INT);
            $stmtActivate->execute();
            $db->commit();
        } catch (Exception $e) {
            if ($db != null) $db->rollback();
            $array= $stmtActivate->errorInfo();
            die(print_r($array));
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
            $stmtDeletePersona = null;
            $this->disconnect();

        }
    }

    public function getByUsuario(string $usuario): ?Persona
    {
        $sql = "SELECT per.*, usu.id as usuario FROM persona per 
INNER JOIN revendedora rev on per.id= rev.persona
INNER JOIN usuario usu on usu.revendedora=rev.id
WHERE per.activo=1 and usu.usuario=:usuario";

        $db = $this->connect();
        $stmt = $db->prepare($sql);
        $stmt->bindParam(':usuario', $usuario);
        $stmt->execute();
        $result = $stmt->fetchObject();

        $item = null;
        if ($result != null) {
            $item = $this->createFromResultset($result, ['*'], $this->db);
        }

        $this->disconnect();
        return $item;
    }

    public function getByToken(string $token): ?Persona
    {
        $sql = "SELECT per.*, ust.usuario, ust.expiracion as expiracion
                FROM usuarios_tokens ust
                LEFT JOIN usuario usu ON ust.usuario = usu.id
                LEFT JOIN revendedora rev ON usu.revendedora = rev.id
                LEFT JOIN persona per on rev.persona = per.id
                WHERE ust.expiracion >= :currentDatetime
                and per.activo = '1'
                and per.es_usuario = '1'
                and per.fecha_baja_persona is null
                AND ust.token = :token";

        $db = $this->connect();
        $stmt = $db->prepare($sql);
        $currentDatetime = (new DateTime())->format('Y-m-d H:i:s');
        $stmt->bindParam(':currentDatetime', $currentDatetime);
        $stmt->bindParam(':token', $token);
        $stmt->execute();
        $result = $stmt->fetchObject();

        $item = null;
        if ($result != null) {
            $item = $this->createFromResultset($result, ['usuario'], $this->db);
            $item->getUsuario()->setToken($token);
            $tokenExpire = $result->expiracion;
            $item->getUsuario()->setTokenExpire($tokenExpire);
        }

        $this->disconnect();
        return $item;
    }

    public function getAllActiveSorted(): Array
    {
        $sql = "SELECT per.*, dot.id as documentoTipoId, dot.descripcion as descripcion
                FROM persona as per
                INNER JOIN tipo_documento as dot on dot.id = per.tipo_documento
                WHERE per.activo=1
                ORDER BY per.nombre, per.apellido ASC";

        $db = $this->connect();
        $stmt = $db->prepare($sql);
        $stmt->execute();
        $items = $stmt->fetchAll(PDO::FETCH_OBJ);

        if ($items == null) {
            return Array();
        }

        $personas = Array();
        foreach ($items as $item) {
            $persona = $this->createFromResultset($item, [], $this->db);

            $tipoDocumento = new TipoDocumento();
            $tipoDocumento->setId($item->documentoTipoId);
            $tipoDocumento->setDescripcion($item->descripcion);
            $persona->setTipoDocumento($tipoDocumento);

            array_push($personas, $persona);
        }

        $this->disconnect();
        return $personas;
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


    /**
     * Usar esta función para crear una entidad a partir del resultado
     * obtenido de la consulta a la base de datos.
     * Parámetros:
     *  $result: Resultado obtenido de la consulta a la base de datos.
     *  $fields: Array que especifica qué entidades relacionadas se deben obtener.
     *          Si se quieren obtener todas las entidades relacionadas se debe enviar ['*'].
     *  $db: Conexión a la base de datos.
     */
    private function createFromResultset($result, array $fields, $db)
    {


        $item = new Persona();
        $item->setId((int)$result->id);
        $item->setDocumento($result->documento);
        $item->setTelefono($result->telefono);
        $item->setEmail($result->email);
        $item->setActivo((bool)$result->activo);
        $item->setFechaAltaPersona(new DateTime ($result->fecha_alta_persona));
        $item->setNombre($result->nombre);
        $item->setNombreSegundo($result->nombre_segundo);
        $item->setApellido($result->apellido);
        $item->setApellidoSegundo($result->apellido_segundo);
        $item->setEsUsuario($result->es_usuario);

        if (in_array('*', $fields) || in_array('tipoDocumento', $fields))
            $item->setTipoDocumento((new TipoDocumentoRepository($db))->get($result->tipo_documento));

        if (in_array('*', $fields) || in_array('localidad', $fields))
            $item->setLocalidad((new LocalidadRepository($db))->get($result->localidad));

        if ((in_array('*', $fields) || in_array('usuario', $fields)) && $item->getEsUsuario())
            $item->setUsuario((new UsuarioRepository($db))->get($result->usuario));
        return $item;
    }


}