<?php
/**
 * Created by Nicolás Snider
 * Date: 09/07/2018
 * Time: 12:33 PM
 */
require_once 'Db.php';
require_once '../Model/Persona.php';


class PersonaRepository extends AbstractRepository
{

    public function create(Persona $persona)
    {

        try {

            $consulta = "INSERT INTO personas(/*..*/) 
                        VALUES (/*..*/)";


            //prepara inserción base de datos
            $db = $this->connect();
            $db->beginTransaction();
            $stmt = $db->prepare($consulta);
            $db->commit();


        } catch (Exception $e) {
            if ($db != null) $db->rollback();
            if ($e instanceof PDOException && $stmt->errorInfo()[0] == 23000 && $stmt->errorInfo()[1] == 1062) {
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


}