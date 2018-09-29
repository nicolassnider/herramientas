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
    public function get(int $id, bool $full = true): ?Persona
    {
        try {
            $db = $this->connect();
            $db->beginTransaction();
            $sqlGet = "SELECT persona.*,r.id as r_id, u.id as u_id FROM persona
                        LEFT JOIN revendedora r on persona.id = r.persona
                        LEFT JOIN usuario u on r.id = u.revendedora
                        WHERE persona.id=:id";
            $stmtGet = $db->prepare($sqlGet);
            $stmtGet->bindParam(':id', $id);
            $stmtGet->execute();
            $result = $stmtGet->fetchObject();
            if ($result==null)
            {
                return null;
            }
            $db->commit();
            return $this->createFromResultset($result, $full ? ['*'] : [], $this->db);


        } catch (PDOException $e) {
            throw  $e ;

        } finally {
            $stmtGet = null;
            $db = null;
            $this->disconnect();
        }
    }

    public function create(Persona $persona)
    {
        $db = $this->connect();
        $transaction = false;

        if (!$db->inTransaction()) {
            $db->beginTransaction();
            $transaction = true;
        }

        try {
            $sqlCreatePersona = "INSERT INTO persona(
            tipo_documento,
            documento,
            nombre,
            nombre_segundo,
            apellido,
            apellido_segundo,
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
            $fechaAltaPersona = date('Y-m-d H:i:s');

            //prepara inserción base de datos
            $stmtCreatePersona = $db->prepare($sqlCreatePersona);
            $stmtCreatePersona->bindParam(':tipo_documento', $tipoDocumento, PDO::PARAM_INT);
            $stmtCreatePersona->bindParam(':documento', $documento);
            $stmtCreatePersona->bindParam(':nombre', $nombre);
            $stmtCreatePersona->bindParam(':nombre_segundo', $nombreSegundo);
            $stmtCreatePersona->bindParam(':apellido', $apellido);
            $stmtCreatePersona->bindParam(':apellido_segundo', $apellidoSegundo);
            $stmtCreatePersona->bindParam(':telefono', $telefono);
            $stmtCreatePersona->bindParam(':email', $email);
            $stmtCreatePersona->bindParam(':activo', $activo, PDO::PARAM_BOOL);
            $stmtCreatePersona->bindParam(':localidad', $localidad, PDO::PARAM_INT);
            $stmtCreatePersona->bindParam(':es_usuario', $esUsuario, PDO::PARAM_BOOL);
            $stmtCreatePersona->bindParam(':fecha_alta_persona', $fechaAltaPersona);
            $stmtCreatePersona->execute();
            $persona->setId($db->lastInsertId());
            if ($transaction) $db->commit();


        } catch (Exception $e) {
            if ($db != null && $transaction) $db->rollback();
            if ($e instanceof PDOException && $stmtCreatePersona->errorInfo()[0] == 23000 && $stmtCreatePersona->errorInfo()[1] == 1062) {
                $array = explode("'", $stmtCreatePersona->errorInfo()[2]);
                switch ($array[3]) {
                    case 'legajo_unico':
                        throw new BadRequestException("El legajo " . $array[1] . " ya existe.");
                        break;
                    case 'documento_unico':
                        $array2 = explode("-", $array[1]);
                        $TipoDocumentoRepository = new TipoDocumentoRepository($this->db);
                        $nombreDocumento = $TipoDocumentoRepository->get($array2[0])->getDescripcion();
                        throw new BadRequestException($nombreDocumento . ": " . $array2[1] . " ya existe");
                        break;
                }
            } else {
                throw $e;
            }
        } finally {
            $stmt = null;
            $this->disconnect();
        }

        return $persona;
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


    public function getAll(): Array
    {
        $sql = "SELECT *
                FROM persona";

        $db = $this->connect();
        $stmt = $db->prepare($sql);
        $stmt->execute();
        $items = $stmt->fetchAll(PDO::FETCH_OBJ);

        if ($items == null) {
            return Array();
        }

        $personas = Array();
        foreach ($items as $item) {
            $persona = $this->createFromResultset($item, ['*'], $this->db);
            array_push($personas, $persona);
        }

        $this->disconnect();
        return $personas;
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
        $item->setFechaAltaPersona(DateTime::createFromFormat('Y-m-d', $result->fecha_alta_persona));
        $item->setNombre($result->nombre);
        $item->setNombreSegundo($result->nombre_segundo);
        $item->setApellido($result->apellido);
        $item->setApellidoSegundo($result->apellido_segundo);
        $item->setEsUsuario((bool)$result->es_usuario);
        if (in_array('*', $fields) || in_array('tipoDocumento', $fields))
            $item->setTipoDocumento((new TipoDocumentoRepository($db))->get((int)$result->tipo_documento));
        if (in_array('*', $fields) || in_array('localidad', $fields))
            $item->setLocalidad((new LocalidadRepository($db))->get($result->localidad));
        if ($item->getEsUsuario()) {
            if ((in_array('usuario', $fields)))
                $item->setUsuario((new UsuarioRepository($db))->get($result->usuario));
        }


        return $item;
    }


}