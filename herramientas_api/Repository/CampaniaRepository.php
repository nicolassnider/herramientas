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
        $campanias = Array();
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
            if ($result == null) return null;
            $db->commit();
            return $this->createFromResultset($result, $full ? ['*'] : [], $this->db);


        } catch (PDOException $e) {
            throw  $e;

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
            if ($result == null) return null;
            return $this->createFromResultset($result, $full ? ['*'] : [], $this->db);


        } catch (PDOException $e) {
            throw  $e;

        } finally {
            $stmtGetCampaniaActiva = null;
            $db = null;
            $this->disconnect();
        }
    }

    public function getCampaniaPorPedido(int $id, bool $full = true): ?Campania
    {
        try {
            $db = $this->connect();
            $db->beginTransaction();
            $sqlGetCampaniaActiva = "select campania.* from campania 
                                      inner join pedido_avon on campania.id=pedido_avon.campania
                                      where pedido_avon.id=:id";
            $stmtGetCampaniaActiva = $db->prepare($sqlGetCampaniaActiva);
            $stmtGetCampaniaActiva->bindParam(':id', $id);
            $stmtGetCampaniaActiva->execute();
            $result = $stmtGetCampaniaActiva->fetchObject();
            $db->commit();
            if ($result == null) return null;
            return $this->createFromResultset($result, $full ? ['*'] : [], $this->db);


        } catch (PDOException $e) {
            throw  $e;

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
        CampaniaRepository::checkCampaniaActiva($campania->getFechaInicio());
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
        CampaniaRepository::crearCatalogoCampania($campania);
        $pedidoAvonRepository = new PedidoAvonRepository();
        $pedidoAvonRepository->create($campania);
        return $campania;
    }

    public function crearCatalogoCampania(Campania $campania)
    {
        $catalogoRepository = new CatalogoRepository();
        $catalogos = $catalogoRepository->getAll();
        foreach ($catalogos as $catalogo) {

            $db = $this->connect();

            if ($catalogo->getActivo()) {

                $campaniaId = $campania->getId();
                $catalogoId = $catalogo->getId();
                $sqlCrearCatalogoCampania = "INSERT INTO catalogo_campania(catalogo, campania) VALUES (:catalogo,:campania)";
                $stmtCrearCatalogoCampania = $db->prepare($sqlCrearCatalogoCampania);
                $stmtCrearCatalogoCampania->bindParam(':catalogo', $catalogoId, PDO::PARAM_INT);
                $stmtCrearCatalogoCampania->bindParam(':campania', $campaniaId, PDO::PARAM_INT);
                $stmtCrearCatalogoCampania->execute();
                $this->disconnect();

            }
            $this->disconnect();
        }

    }


    /**
     * @throws BadRequestException
     */
    public function checkCampaniaActiva($fecha)
    {
        try {

            $db = $this->connect();
            $sqlCheckCampaniaActiva = " SELECT COUNT(id)AS campanias_activas FROM herramientas.campania 
                                        WHERE campania.activo=1";
            $stmtCheckCampaniaActiva = $db->prepare($sqlCheckCampaniaActiva);
            $stmtCheckCampaniaActiva->execute();
            $result = $stmtCheckCampaniaActiva->fetchObject();
            if ($result->campanias_activas != 0) {
                throw new BadRequestException("Existe una Campania activa, por favor verificar");
            }
            $sqlCheckCampaniaActiva = null;
            $stmtCheckCampaniaActivaCampaniaActiva = null;

            $sqlCheckUltimaFecha = " SELECT fecha_fin FROM campania";
            $stmtCheckUltimaFecha = $db->prepare($sqlCheckUltimaFecha);
            $stmtCheckUltimaFecha->execute();

            $resultsFechas = $stmtCheckUltimaFecha->fetchAll(PDO::FETCH_OBJ);
            foreach ($resultsFechas as $resultFecha) {
                $fechaFin = $resultFecha->fecha_fin;
                if ($fecha->format("Y-m-d") <= $fechaFin) {
                    throw new BadRequestException("Verificar el inicio de campania");
                }
            }


        } catch (PDOException $e) {
            throw  $e;

        } finally {
            $result = null;
            $sqlCheckCampaniaActiva = null;
            $stmtCheckCampaniaActivaCampaniaActiva = null;
        }
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