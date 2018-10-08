<?php
/**
 * Created by PhpStorm.
 * User: nicol
 * Date: 03/10/2018
 * Time: 7:38 AM
 */

require_once '../Model/Catalogo.php';
require_once '../Model/Campania.php';
require_once '../Repository/CampaniaRepository.php';
require_once '../Commons/Exceptions/BadRequestException.php';

class CatalogoRepository extends AbstractRepository
{

    /**
     * @param int $id
     * @return Catalogo|null
     * @throws Exception
     */
    public function get(int $id): ?Catalogo
    {
        try {
            $db = $this->connect();
            $sqlGetCatalogo = "SELECT cat.* FROM catalogo cat WHERE id=:id";
            $stmtGetCatalogo = $db->prepare($sqlGetCatalogo);
            $stmtGetCatalogo->bindParam(':id', $id, PDO::PARAM_INT);
            $stmtGetCatalogo->execute();
            $item = $stmtGetCatalogo->fetch(PDO::FETCH_OBJ);
            if ($item == null) {
                return null;
            }
            $catalogo = $this->createFromResultset($item, ['*'], $this->db);


        } catch (Exception $e) {
            if ($db != null) $db->rollback();

            if ($e instanceof PDOException && $stmtGetCatalogo->errorInfo()[0] == 23000 && $stmtGetCatalogo->errorInfo()[1] == 1062) {
                $array = explode("'", $stmtGetCatalogo->errorInfo()[2]);

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
            $this->disconnect();
        }

        return $catalogo;
    }

    public function getAll(): Array
    {
        try {
            $db = $this->connect();
            $sqlGetAllCatalogo = "SELECT cat.* FROM catalogo cat";
            $stmtGetAllCatalogo = $db->prepare($sqlGetAllCatalogo);
            $stmtGetAllCatalogo->execute();
            $items = $stmtGetAllCatalogo->fetchAll(PDO::FETCH_OBJ);
            $catalogos = Array();
            foreach ($items as $item) {
                $item = $this->createFromResultset($item, ['*'], $this->db);
                array_push($catalogos, $item);
            }
            return $catalogos;


        } catch (Exception $e) {
            if ($db != null) $db->rollback();

            if ($e instanceof PDOException && $stmtGetAllCatalogo->errorInfo()[0] == 23000 && $stmtGetAllCatalogo->errorInfo()[1] == 1062) {
                $array = explode("'", $stmtGetAllCatalogo->errorInfo()[2]);

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
            $this->disconnect();
        }

        return $item;
    }

    public function getAllActiveSorted(): Array
    {

        return CatalogoRepository::getAll();
    }

    public function create(Catalogo $catalogo)
    {
        $db = $this->connect();
        $db->beginTransaction();

        try {
            $sqlCreateCatalogo = "INSERT INTO herramientas.catalogo(
                                  descripcion, observaciones, activo)
                                  VALUES (
                                  :descripcion,:observaciones,:activo)";

            $descripcion = $catalogo->getDescripcion();
            $observaciones = $catalogo->getObservaciones();
            $activo = $catalogo->getActivo();

            //prepara inserción base de datos
            $stmtCreateCatalogo = $db->prepare($sqlCreateCatalogo);
            $stmtCreateCatalogo->bindParam(':descripcion', $descripcion);
            $stmtCreateCatalogo->bindParam(':observaciones', $observaciones);
            $stmtCreateCatalogo->bindParam(':activo', $activo, PDO::PARAM_BOOL);
            $stmtCreateCatalogo->execute();
            $catalogo->setId($db->lastInsertId());
            $db->commit();


        } catch (Exception $e) {
            if ($db != null) $db->rollback();
            if ($e instanceof PDOException && $stmtCreateCatalogo->errorInfo()[0] == 23000 && $stmtCreateCatalogo->errorInfo()[1] == 1062) {
                $array = explode("'", $stmtCreateCatalogo->errorInfo()[2]);
                switch ($array[3]) {

                    case 'descripcion_catalogo_unico':
                        $array2 = explode("-", $array[1]);
                        throw new BadRequestException("Existe un catalogo con descripcion '" . $descripcion . "'.");
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
        $db=null;
        $sqlCreateCatalogo=null;
        $stmtCreateCatalogo=null;

        return CatalogoRepository::get($catalogo->getId());
    }

    /**
     * @param Catalogo $catalogo
     * @throws BadRequestException
     */
    public function update(Catalogo $catalogo)
    {
        $db = $this->connect();
        $db->beginTransaction();

        try {
            $sqlUpdateCatalogo = "UPDATE herramientas.catalogo 
                                    SET descripcion = :descripcion, 
                                    observaciones =:observaciones, 
                                    activo = :activo 
                                    WHERE (id =:id);
                                    ";

            $descripcion = $catalogo->getDescripcion();
            $observaciones = $catalogo->getObservaciones();
            $activo = $catalogo->getActivo();
            $id=$catalogo->getId();

            //prepara inserción base de datos
            $stmtUpdateCatalogo = $db->prepare($sqlUpdateCatalogo);
            $stmtUpdateCatalogo->bindParam(':descripcion', $descripcion);
            $stmtUpdateCatalogo->bindParam(':observaciones', $observaciones);
            $stmtUpdateCatalogo->bindParam(':activo', $activo, PDO::PARAM_BOOL);
            $stmtUpdateCatalogo->bindParam(':id',$id,PDO::PARAM_INT);
            $stmtUpdateCatalogo->execute();
            $catalogo->setId($db->lastInsertId());
            $db->commit();


        } catch (Exception $e) {
            if ($db != null) $db->rollback();
            if ($e instanceof PDOException && $stmtUpdateCatalogo->errorInfo()[0] == 23000 && $stmtUpdateCatalogo->errorInfo()[1] == 1062) {
                $array = explode("'", $stmtUpdateCatalogo->errorInfo()[2]);
                switch ($array[3]) {

                    case 'descripcion_catalogo_unico':
                        $array2 = explode("-", $array[1]);
                        throw new BadRequestException("Existe un catalogo con descripcion '" . $descripcion . "'.");
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
        $db=null;
        $sqlUpdateCatalogo=null;
        $stmtUpdateCatalogo=null;


    }

    public function delete(int $id): void
    {
        $db = $this->connect();
        $db->beginTransaction();

        try {
            $sqlDeleteCatalogo = "DELETE FROM herramientas.catalogo 
                                    WHERE (id =:id);
                                    ";


            //prepara inserción base de datos
            $stmtDeleteCatalogo = $db->prepare($sqlDeleteCatalogo);
            $stmtDeleteCatalogo->bindParam(':id',$id,PDO::PARAM_INT);
            $stmtDeleteCatalogo->execute();
            $db->commit();


        } catch (Exception $e) {
            //TODO: recuperar error
            if ($db != null) $db->rollback();
            if ($e instanceof PDOException && $stmtDeleteCatalogo->errorInfo()[0] == 23000 && $stmtDeleteCatalogo->errorInfo()[1] == 1062) {
                $array = explode("'", $stmtDeleteCatalogo->errorInfo()[2]);
                switch ($array[3]) {

                    case 'descripcion_catalogo_unico':
                        $array2 = explode("-", $array[1]);
                        throw new BadRequestException("Existe un catalogo con descripcion '" . $descripcion . "'.");
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
        $db=null;
        $sqlDeleteCatalogo=null;
        $stmtDeleteCatalogo=null;


    }

    public function deactivate(int $id): void
    {
        $db = $this->connect();
        $db->beginTransaction();
        try {
            $sqlDeactivateCatalogo = "UPDATE herramientas.catalogo SET activo = :activo WHERE (id = :id);";
            $activo=false;

            //prepara inserción base de datos
            $stmtDeactivateCatalogo = $db->prepare($sqlDeactivateCatalogo);
            $stmtDeactivateCatalogo->bindParam(':id', $id, PDO::PARAM_INT);
            $stmtDeactivateCatalogo->bindParam(':activo', $activo, PDO::PARAM_BOOL);
            $stmtDeactivateCatalogo->execute();
            $db->commit();

        } catch (Exception $e) {
            if ($db != null) $db->rollback();

            if ($e instanceof PDOException && $stmtDeactivateCatalogo->errorInfo()[0] == 23000 && $stmtDeactivateCatalogo->errorInfo()[1] == 1062) {
                //TODO: verificar ex
                $array = explode("'", $stmtDeactivateCatalogo->errorInfo()[2]);
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
            $stmtDeactivateCatalogo = null;
            $this->disconnect();
        }
    }

    /**
     * @param int $id
     * @throws BadRequestException
     */
    public function activate(int $id): void
    {
        $db = $this->connect();
        $db->beginTransaction();
        try {
            $sqlActivateCatalogo = "UPDATE herramientas.catalogo SET activo = :activo WHERE (id = :id);";
            $activo=true;
            //prepara inserción base de datos
            $stmtActivateRevendedora = $db->prepare($sqlActivateCatalogo);
            $stmtActivateRevendedora->bindParam(':id', $id, PDO::PARAM_INT);
            $stmtActivateRevendedora->bindParam(':activo', $activo, PDO::PARAM_BOOL);
            $stmtActivateRevendedora->execute();
            $db->commit();
            $stmtActivateRevendedora->errorInfo();
        } catch (Exception $e) {
            if ($db != null) $db->rollback();


            if ($e instanceof PDOException && $stmtActivateRevendedora->errorInfo()[0] == 23000 && $stmtActivateRevendedora->errorInfo()[1] == 1062) {
                $array = explode("'", $stmtActivateRevendedora->errorInfo()[2]);
                //TODO: verificar ex
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

    public function createCatalogoByCampania(CatalogoCampania $catalogoCampania)
    {
        $db = $this->connect();
        $db->beginTransaction();

        try {
            $sqlCreateCatalogoCampania = "INSERT INTO herramientas.catalogo_campania
                                        (catalogo, campania, activo) 
                                  VALUES 
                                        (:catalogo,:campania,:activo)";

            $catalogo = (int)$catalogoCampania->getCatalogo()->getId();
            $campania = (int)$catalogoCampania->getCampania()->getId();
            $activo = true;

            //prepara inserción base de datos
            $stmtCreateCatalogoCampania = $db->prepare($sqlCreateCatalogoCampania);
            $stmtCreateCatalogoCampania->bindParam(':catalogo', $catalogo,PDO::PARAM_INT);
            $stmtCreateCatalogoCampania->bindParam(':campania', $campania,PDO::PARAM_INT);
            $stmtCreateCatalogoCampania->bindParam(':activo', $activo, PDO::PARAM_BOOL);
            $stmtCreateCatalogoCampania->execute();
            $catalogoCampania->setId($db->lastInsertId());
            $db->commit();


        } catch (Exception $e) {
            if ($db != null) $db->rollback();
            die(Array($stmtCreateCatalogoCampania->errorInfo()));

            if ($e instanceof PDOException && $stmtCreateCatalogoCampania->errorInfo()[0] == 23000 && $stmtCreateCatalogoCampania->errorInfo()[1] == 1062) {
                $array = explode("'", $stmtCreateCatalogoCampania->errorInfo()[2]);
                switch ($array[3]) {

                    case 'descripcion_catalogo_unico':
                        $array2 = explode("-", $array[1]);
                        throw new BadRequestException("Existe un catalogo con descripcion '" . $descripcion . "'.");
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
        $db=null;
        $sqlCreateCatalogoCampania=null;
        $stmtCreateCatalogoCampania=null;
    }

    private function createFromResultset($result, array $fields, $db)
    {
        $item = new Catalogo();
        $item->setId((int)$result->id);
        $item->setDescripcion($result->descripcion);
        $item->setObservaciones($result->observaciones);
        $item->setActivo((bool)$result->activo);
        return $item;
    }

}