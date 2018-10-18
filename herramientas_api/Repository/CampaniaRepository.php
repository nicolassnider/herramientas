<?php
/**
 * Created by PhpStorm.
 * User: nicol
 * Date: 16/09/2018
 * Time: 12:17 AM
 */
require_once '../Model/Campania.php';
require_once '../Commons/Exceptions/BadRequestException.php';
class CampaniaRepository extends AbstractRepository
{

    public function getAll(bool $full = true): Array
    {
        $db = $this->connect();
        $sqlGetAll = "SELECT * FROM campania";
        $result = $db->query($sqlGetAll);
        $items = $result->fetchAll(PDO::FETCH_OBJ);
        if ($items == null) {
            return Array();
        }
        $campanias=Array();
        foreach ($items as $item) {
            $item = $this->createFromResultset($item, $full ? ['*'] : [], $this->db);
            array_push($campanias, $item);
        }


        return $campanias;
    }

    public function getAllGrilla(bool $full = true): Array
    {
        $db = $this->connect();
        $sqlGetAll = "SELECT * FROM campania";
        $result = $db->query($sqlGetAll);
        $items = $result->fetchAll(PDO::FETCH_OBJ);
        if ($items == null) {
            return Array();
        }
        $campanias = Array();
        foreach ($items as $item) {
            $item = $this->createFromResultset($item, $full ? ['fechaInicio', 'fechaFin', 'descripcion'] : [], $this->db);
            $item->setId(null);
            $item->setActivo(null);
            array_push($campanias, $item);
        }


        return $campanias;
    }


    public function get(int $id, bool $full = true): ?Campania
    {
        try {
            $db = $this->connect();
            $db->beginTransaction();
            $sqlGet = "SELECT * FROM campania
                        WHERE id=:id";
            $stmtGet = $db->prepare($sqlGet);
            $stmtGet->bindParam(':id', $id);
            $stmtGet->execute();
            $result = $stmtGet->fetchObject();
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

    public function getCampaniaActiva(bool $full = true): ?Campania
    {
        try {
            $db = $this->connect();
            $db->beginTransaction();
            $sqlGetCampaniaActiva = " SELECT * FROM campania WHERE campania.activo= 1";
            $stmtGetCampaniaActiva = $db->prepare($sqlGetCampaniaActiva);
            $stmtGetCampaniaActiva->execute();
            $result = $stmtGetCampaniaActiva->fetchObject();
            $db->commit();
            return $this->createFromResultset($result, $full ? ['*'] : [], $this->db);


        } catch (PDOException $e) {
            throw  $e ;

        } finally {
            $stmtGetCampaniaActiva = null;
            $db = null;
            $this->disconnect();
        }
    }

    public function desactivarCampania(int $id, bool $full = true): void
    {
        try {
            $db = $this->connect();
            $db->beginTransaction();
            $sqlDesactivar = "UPDATE 
                        campania SET
                        activo=0
                        WHERE
                        id=:id";
            $stmtDesactivar = $db->prepare($sqlDesactivar);
            $stmtDesactivar->bindParam(':id', $id);
            $stmtDesactivar->execute();
            $db->commit();

        } catch (Exception $e) {
            if ($db != null) $db->rollback();

        } finally {
            $stmtDesactivar = null;
            $db = null;
            $this->disconnect();
        }
    }

    public function create(Campania $campania): ?Campania
    {

        $db = $this->connect();
        $db->beginTransaction();
        $sqlCreate = "INSERT INTO campania (fecha_inicio, fecha_fin, descripcion, activo) VALUES (:fechaInicio,:fechaFin,:descripcion,:activo)";
        $fechaInicio = (string)$campania->getFechaInicio()->format("Y-m-d");
        $fechaFin = (string)$campania->getFechaFin()->format("Y-m-d");
        $descripcion = $campania->getDescripcion();
        $activo = $campania->getActivo();
        $stmtCreate = $db->prepare($sqlCreate);
        $stmtCreate->bindParam(':fechaInicio', $fechaInicio);
        $stmtCreate->bindParam(':fechaFin', $fechaFin);
        $stmtCreate->bindParam(':descripcion', $descripcion);
        $stmtCreate->bindParam(':activo', $activo, PDO::PARAM_BOOL);
        $stmtCreate->execute();
        $campania->setId($db->lastInsertId());
        $db->commit();
        return $campania;
    }

    public function update(Campania $campania)
    {

        try {
            $db = $this->connect();
            $db->beginTransaction();
            $sqlUpdate = "UPDATE 
                        campania SET
                        fecha_inicio=:fechaInicio,
                        fecha_fin=:fechaFin,
                        descripcion=:descripcion,
                        activo=:activo
                        WHERE
                        id=:id";
            $id = $campania->getId();
            $fechaInicio = $campania->getFechaInicio()->format('Y-m-d');
            $fechaFin = $campania->getFechaFin()->format('Y-m-d');
            $descripcion = $campania->getDescripcion();
            $activo = $campania->getActivo();
            $stmtUpdate = $db->prepare($sqlUpdate);
            $stmtUpdate->bindParam(':id', $id);
            $stmtUpdate->bindParam(':fechaInicio', $fechaInicio);
            $stmtUpdate->bindParam(':fechaFin', $fechaFin);
            $stmtUpdate->bindParam(':descripcion', $descripcion);
            $stmtUpdate->bindParam(':activo', $activo);
            $stmtUpdate->execute();
            $db->commit();

        } catch (Exception $e) {
            if ($db != null) $db->rollback();


        } finally {
            $stmtUpdate = null;
            $db = null;
            $this->disconnect();
        }

    }

    public function delete(int $id): void
    {

        try {
            $db = $this->connect();
            $db->beginTransaction();
            $sqlDelete = "DELETE FROM herramientas.campania WHERE (id =:id)";
            $stmtDelete = $db->prepare($sqlDelete);
            $stmtDelete->bindParam(':id', $id);
            $stmtDelete->execute();
            $db->commit();

        } catch (Exception $e) {
            if ($db != null) $db->rollback();

        } finally {
            $stmtDelete = null;
            $db = null;
            $this->disconnect();
        }

    }

    private function createFromResultset($result, array $fields, $db)
    {

        $item = new Campania();
        $item->setId((int)$result->id);

        if (in_array('*', $fields) || in_array('fechaInicio', $fields))
            $item->setFechaInicio(DateTime::createFromFormat('Y-m-d', $result->fecha_inicio));

        if (in_array('*', $fields) || in_array('fechaFin', $fields))
            $item->setFechaFin(DateTime::createFromFormat('Y-m-d', $result->fecha_fin));

        if (in_array('*', $fields) || in_array('descripcion', $fields))
            $item->setDescripcion($result->descripcion);

        $item->setActivo((bool)$result->activo);
        return $item;
    }

}