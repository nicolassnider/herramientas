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


class PersonaRepository extends AbstractRepository
{

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

            $tipoDocumento = $persona->getTipoDocumento()!=null?$persona->getTipoDocumento()->getId():null;
            $documento = $persona->getDocumento();
            $nombre = $persona->getNombre();
            $nombreSegundo = $persona->getNombreSegundo();
            $apellido = $persona->getApellido();
            $apellidoSegundo = $persona->getApellidoSegundo();
            $telefono = $persona->getTelefono();
            $email = $persona->getEmail();
            $activo = $persona->getActivo();
            $localidad = $persona->getLocalidad()!=null?$persona->getLocalidad()->getId():null;
            $esUsuario = $persona->getEsUsuario();
            $fechaAltaPersona = date('Y-m-d H:i:s');

            //prepara inserción base de datos
            $stmtCreatePersona = $db->prepare($sqlCreatePersona);
            $stmtCreatePersona->bindParam(':tipo_documento', $tipoDocumento, PDO::PARAM_INT);
            $stmtCreatePersona->bindParam(':documento', $documento);
            $stmtCreatePersona->bindParam(':nombre', $nombre);
            $stmtCreatePersona->bindParam(':nombre_segundo', $nombreSegundo);
            $stmtCreatePersona->bindParam(':apellido', $apellidoSegundo);
            $stmtCreatePersona->bindParam(':telefono', $telefono);
            $stmtCreatePersona->bindParam(':email', $email);
            $stmtCreatePersona->bindParam(':activo', $activo,PDO::PARAM_BOOL);
            $stmtCreatePersona->bindParam(':localidad', $localidad, PDO::PARAM_INT);
            $stmtCreatePersona->bindParam(':es_usuario',$esUsuario,PDO::PARAM_BOOL)
            $stmtCreatePersona->bindParam(':fecha_alta_persona', $fechaAltaPersona);
            $stmtCreatePersona->execute();
            $persona->setId($db->lastInsertId());
            if($transaction) $db->commit();


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

    public function get($id): ?Persona
    {

        return $item;
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


        if (in_array('*', $fields) || in_array('documentoTipo', $fields))
            $item->setTipoDocumento((new TipoDocumentoRepository($db))->get($result->tipo_documento));
        if (in_array('*', $fields) || in_array('localidad', $fields))
            $item->setLocalidad((new LocalidadRepository($db))->get($result->localidad));
        if ((in_array('*', $fields) || in_array('usuario', $fields)) && $item->getEsUsuario())
            $item->setUsuario((new UsuarioRepository($db))->get($result->usuario));
        return $item;
    }


}