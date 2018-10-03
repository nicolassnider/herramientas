<?php
/**
 * Created by PhpStorm.
 * User: nicol
 * Date: 03/10/2018
 * Time: 7:38 AM
 */

require_once '../Model/Catalogo.php';

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
            $sqlGetCatalogo = "SELECT cat.*, cat_cam.campania FROM catalogo cat
                            LEFT JOIN catalogo_campania cat_cam on cat.id = cat_cam.catalogo
                            WHERE cat.id=:id";
            $stmtGetCatalogo = $db->prepare($sqlGetCatalogo);
            $stmtGetCatalogo->bindParam(':id', $id);
            $stmtGetCatalogo->execute();
            $result = $stmtGetCatalogo->fetchObject();

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

            throw $e;
        } finally {
            $db->disconnect();
            $sqlGetCatalogo = null;
        }

    }

    public function getAll(): Array
    {
        $db = $this->connect();
        $sqlGetCatalogo = "SELECT cat.*, cat_cam.campania FROM catalogo cat
                            LEFT JOIN catalogo_campania cat_cam on cat.id = cat_cam.catalogo
                            WHERE cat.id=:id";
        $stmtGetCatalogo = $db->prepare($sqlGetCatalogo);
    }

    public function getAllActiveSorted(): Array
    {

        $db = $this->connect();
        $sqlGetCatalogo = "SELECT cat.*, cat_cam.campania FROM catalogo cat
                            LEFT JOIN catalogo_campania cat_cam on cat.id = cat_cam.catalogo
                            WHERE cat.id=:id";
        $stmtGetCatalogo = $db->prepare($sqlGetCatalogo);
    }

    public function create(): ?Catalogo
    {

        $db = $this->connect();
        $sqlGetCatalogo = "SELECT cat.*, cat_cam.campania FROM catalogo cat
                            LEFT JOIN catalogo_campania cat_cam on cat.id = cat_cam.catalogo
                            WHERE cat.id=:id";
        $stmtGetCatalogo = $db->prepare($sqlGetCatalogo);
    }

    public function update(): void
    {
        $sqlUpdateCatalogo = "";
        $stmtUpdateCatalogo = "";
    }

    public function delete(): void
    {
        $sqlDeleteCatalogo = "";
        $stmtDeleteCatalogo = "";
    }

    public function deactivate(): void
    {
        $sqlDeactivateCatalogo = "";
        $stmtDeactivateCatalogo = "";
    }

    public function activate(): void
    {
        $sqlActivateCatalogo = "";
        $stmtActivateCatalogo = "";
    }

    private function createFromResultset($result, array $fields, $db)
    {

        $item = new Campania();
        $item->setId((int)$result->id);
        $item->setFechaInicio(DateTime::createFromFormat('Y-m-d', $result->fecha_inicio));
        $item->setFechaFin(DateTime::createFromFormat('Y-m-d', $result->fecha_fin));
        $item->setDescripcion($result->descripcion);
        $item->setActivo((bool)$result->activo);
        return $item;
    }

}