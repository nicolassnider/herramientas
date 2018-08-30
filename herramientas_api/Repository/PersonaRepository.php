<?php
/**
 * Created by Nicolás Snider
 * Date: 09/07/2018
 * Time: 12:33 PM
 */
require_once 'Db.php';
require_once '../Model/Persona.php';
require_once '../Repository/AbstractRepository.php';


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

    public function get($id): ?Persona
    {

        return $item;
    }


}