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

        try {
            $tipoDocumento=$persona->getTipoDocumento();
            $documento=$persona->getDocumento();
            $telefono=$persona->getTelefono();
            $email=$persona->getEmail();
            $activo=$persona->getActivo();
            $localidad=$persona->getLocalidad();
            $fechaAltaPersona=date('Y-m-d H:i:s');

            $sqlInsert = "INSERT INTO persona(
                  tipo_documento, 
                  documento, 
                  telefono, 
                  email, 
                  activo, 
                  localidad, 
                  fecha_alta_persona) 
                        VALUES (
                  :tipo_documento, 
                  :documento, 
                  :telefono, 
                  :email, 
                  :activo, 
                  :localidad, 
                  :fecha_alta_persona
                        )";


            //prepara inserción base de datos
            $db = $this->connect();
            $db->beginTransaction();
            $stmtInsert = $db->prepare($sqlInsert);
            $stmtInsert->bindParam(':tipo_documento', $tipoDocumento,PDO::PARAM_INT);
            $stmtInsert->bindParam(':documento',$documento);
            $stmtInsert->bindParam(':telefono', $telefono);
            $stmtInsert->bindParam(':email', $email);
            $stmtInsert->bindParam(':activo', $activo);
            $stmtInsert->bindParam(':localidad', $localidad,PDO::PARAM_INT);
            $stmtInsert->bindParam(':fecha_alta_persona', $fechaAltaPersona);
            $stmtInsert->execute();
            $persona->setId($db->lastInsertId());
            $db->commit();



        } catch (Exception $e) {
            if ($db != null) $db->rollback();
            if ($e instanceof PDOException && $stmtInsert->errorInfo()[0] == 23000 && $stmtInsert->errorInfo()[1] == 1062) {
                if ($db != null) $db->rollback();
            } else {
                throw $e;
            }
        } finally {
            $stmt = null;
            $this->disconnect();
        }

        return $persona;
    }

    public function getByUsuario(string $usuario): ?Persona {
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
    private function createFromResultset($result, array $fields, $db) {
        $item = new Persona();
        $item->setId((int)$result->id);
        $item->setDocumento($result->documento);
        $item->setTelefono($result->telefono);
        $item->setEmail($result->email);
        $item->setActivo((bool)$result->activo);
        $item->setFechaAltaPersona( new DateTime ($result->fecha_alta_persona));
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