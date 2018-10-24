<?php
/**
 * Created by PhpStorm.
 * User: nicol
 * Date: 09/10/2018
 * Time: 12:20 PM
 */

require_once 'Db.php';
require_once 'AbstractRepository.php';
require_once '../Model/Producto.php';
require_once '../Model/Catalogo.php';
require_once '../Model/ProductoCatalogo.php';

require_once '../Repository/CatalogoRepository.php';
require_once '../Repository/ProductoRepository.php';


require_once '../Commons/Exceptions/BadRequestException.php';

class ProductoCatalogoRepository extends AbstractRepository
{

    /**
     * @param Producto $producto
     * @return null|Producto
     * @throws BadRequestException
     */
    public function create(Producto $producto): ?Producto
    {

        try {
            $db = $this->connect();
            $db->beginTransaction();
            $sqlCreate = "INSERT INTO herramientas.producto(
                              descripcion, categoria, unidad) 
                      VALUES (
                               
                              :descripcion, 
                              :categoria, 
                              :unidad)";
            $descripcion = $producto->getDescripcion();
            $categoria = (int)$producto->getCategoria()->getId();
            $unidad = (int)$producto->getUnidad()->getId();
            $stmtCreate = $db->prepare($sqlCreate);
            $stmtCreate->bindParam(':descripcion', $descripcion);
            $stmtCreate->bindParam(':categoria', $categoria, PDO::PARAM_INT);
            $stmtCreate->bindParam(':unidad', $unidad, PDO::PARAM_INT);
            $stmtCreate->execute();
            $producto->setId($db->lastInsertId());
            $db->commit();

        } catch (Exception $e) {
            if ($db != null) $db->rollback();
            if ($e instanceof PDOException && $stmtCreate->errorInfo()[0] == 23000 && $stmtCreate->errorInfo()[1] == 1062) {
                //TODO: implementar ex
                $array = explode("'", $stmtCreate->errorInfo()[2]);
                switch ($array[3]) {
                    case "persona_unique":
                        throw new BadRequestException("existe una ocurrencia para la persona id: " . $array[1]);
                        break;
                    default:
                        die(print_r($array));
                        break;
                }
            } else {
                throw $e;
            }
        } finally {
            $this->disconnect();

        }
        return $producto;
    }

    public function update(Producto $producto): void
    {
        $db = $this->connect();
        $db->beginTransaction();
        try {
            $sqlUpdate = "UPDATE herramientas.producto 
                                SET                                   
                                  descripcion=:descripcion,
                                  categoria=:categoria,
                                  unidad=:unidad
                                  
                                WHERE
                                  (id =:id)";

            $descripcion = $producto->getDescripcion();
            $categoria = $producto->getCategoria()->getId();
            $unidad = $producto->getUnidad()->getId();
            $id = $producto->getId();
            $stmtUpdate = $db->prepare($sqlUpdate);
            $stmtUpdate->bindParam(':descripcion', $descripcion);
            $stmtUpdate->bindParam(':categoria', $categoria, PDO::PARAM_INT);
            $stmtUpdate->bindParam(':unidad', $unidad, PDO::PARAM_INT);
            $stmtUpdate->bindParam(':id', $id, PDO::PARAM_INT);
            $stmtUpdate->execute();
            $db->commit();
        } catch (Exception $e) {
            die(print_r(Array($stmtUpdate->errorInfo())));
            if ($db != null) $db->rollback();
            if ($e instanceof PDOException && $stmtUpdate->errorInfo()[0] == 23000 && $stmtUpdate->errorInfo()[1] == 1062) {
                $array = explode("'", $stmtUpdate->errorInfo()[2]);
                switch ($array[3]) {

                    case 'persona_unique':
                        throw new BadRequestException("La combinación " . " número " . " ya existe");
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
            $sqlDelete = "DELETE FROM herramientas.producto WHERE id=:id";
            $stmtDelete = $db->prepare($sqlDelete);
            $stmtDelete->bindParam(':id', $id, PDO::PARAM_INT);
            $stmtDelete->execute();
            $db->commit();

        } catch (Exception $e) {
            //TODO: implementar ex
            if ($db != null) $db->rollback();
            if ($e instanceof PDOException && $stmtDelete->errorInfo()[0] == 23000 && $stmtDelete->errorInfo()[1] == 1451) {
                $array = explode("`", $stmtDelete->errorInfo()[2]);

                switch ($array[5]) {

                    case 'PERSONA_REVENDEDORA':
                        //TODO:verificar id de revendedora
                        $personaRepository = new PersonaRepository($this->db);
                        throw new BadRequestException("Existe una relación para la persona " . $personaRepository->get($id)->getNombre() . " " . $personaRepository->get($id)->getApellidoSegundo() . " con Revendedora id X");
                        break;
                    default:
                        die(print_r($array));
                }
            } else {
                throw $e;
            }
        } finally {

            $stmtDelete = null;
            $this->disconnect();

        }
    }


    public function getAll(bool $full = true): Array
    {
        $sql = "SELECT *
                FROM producto";

        $db = $this->connect();
        $stmt = $db->prepare($sql);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        $items = $stmt->fetchAll(PDO::FETCH_OBJ);

        if ($items == null) {
            return Array();
        }

        $productos = Array();
        foreach ($items as $item) {
            $item = $this->createFromResultset($item, $full ? ['*'] : [], $this->db);
            array_push($productos, $item);
        }


        $this->disconnect();
        return $productos;
    }

    private function createFromResultset($result, array $fields, $db)
    {

        $item = new ProductoCatalogo();
        $item->setId((int)$result->id);
        $item->setProducto((new ProductoRepository($db))->get($result->producto));
        $item->setCatalogo((new CatalogoRepository($db))->get($result->catalogo));
        $item->setPrecio((float)$result->precio);
        $item->setActivo((bool)$result->activo);
        return $item;
    }

    public function getAllCatalogoProductoPorProducto(int $id, bool $full = true): Array
    {
        $productoId = $id;
        $sql = "SELECT *
                FROM producto_catalogo WHERE producto=:id";

        $db = $this->connect();
        $stmt = $db->prepare($sql);
        $stmt->bindParam(':id', $productoId, PDO::PARAM_INT);
        $stmt->execute();
        $items = $stmt->fetchAll(PDO::FETCH_OBJ);

        if ($items == null) {
            return Array();
        }

        $productoCatalogos = Array();
        foreach ($items as $item) {
            $item = $this->createFromResultset($item, $full ? ['*'] : [], $this->db);
            array_push($productoCatalogos, $item);
        }


        $this->disconnect();
        return $productoCatalogos;
    }

    public function getAllActiveSorted(): Array
    {
        $sql = "SELECT pro.* FROM producto pro";

        $db = $this->connect();
        $stmt = $db->prepare($sql);
        $stmt->execute();
        $items = $stmt->fetchAll(PDO::FETCH_OBJ);


        if ($items == null) {
            return Array();
        }

        $productos = Array();
        foreach ($items as $item) {
            $producto = $this->get($item->id);


            array_push($productos, $producto);
        }

        $this->disconnect();
        return $productos;
    }

    public function get(int $id, bool $full = true): ?Producto
    {
        $sqlGet = "SELECT pro.*  FROM producto pro               
                    WHERE pro.id=:id
                    ";

        $db = $this->connect();
        $stmtGet = $db->prepare($sqlGet);
        $stmtGet->bindParam(':id', $id, PDO::PARAM_INT);
        $stmtGet->execute();
        $result = $stmtGet->fetchObject();

        if ($result == null) {
            return null;
        }

        $producto = $this->createFromResultset($result, $full ? ['*'] : [], $this->db);
        $this->disconnect();
        return $producto;
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

}