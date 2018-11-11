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
require_once '../Model/PedidoProductoCatalogo.php';
require_once '../Model/Archivo.php';
require_once '../Model/RemitoProducto.php';
require_once '../Model/ComparaPedidoRemito.php';

require_once '../Repository/CatalogoRepository.php';
require_once '../Repository/ProductoRepository.php';


require_once '../Commons/Exceptions/BadRequestException.php';

class RemitoProductoRepository extends AbstractRepository
{

    /**
     * @param PedidoProductoCatalogo $pedidoProductoCatalogo
     * @return null
     * @throws BadRequestException
     */
    public function create(RemitoProducto $remitoProducto): ?RemitoProducto
    {

        try {
            $db = $this->connect();
            $db->beginTransaction();
            $sqlCreate = "INSERT INTO herramientas.remito_producto
                        (remito, producto, cantidad) 
                        VALUES (:remito,:producto,:cantidad)";

            $remito = (int)$remitoProducto->getRemito()->getId();
            $producto = $remitoProducto->getProducto()->getId();
            $cantidad = $remitoProducto->getCantidad();

            $stmtCreate = $db->prepare($sqlCreate);
            $stmtCreate->bindParam(':remito', $remito, PDO::PARAM_INT);
            $stmtCreate->bindParam(':producto', $producto, PDO::PARAM_INT);
            $stmtCreate->bindParam(':cantidad', $cantidad, PDO::PARAM_INT);
            $stmtCreate->execute();
            $remitoProducto->setId($db->lastInsertId());
            $db->commit();

        } catch (Exception $e) {
            if ($db != null) $db->rollback();
            if ($e instanceof PDOException && $stmtCreate->errorInfo()[0] == 23000 && $stmtCreate->errorInfo()[1] == 1062) {
                //TODO: implementar ex
                $array = explode("'", $stmtCreate->errorInfo()[2]);
                switch ($array[3]) {
                    case "REMITO_PRODUCTO_UNICO":
                        throw new BadRequestException("existe una ocurrencia para el item de producto: ");
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
        return $remitoProducto;
    }

    public function update(PedidoProductoCatalogo $pedidoProductoCatalogo)
    {

        try {
            $db = $this->connect();
            $db->beginTransaction();
            $sqlCreate = "UPDATE 
                            herramientas.pedido_producto_catalogo
                          SET 
                            producto_catalogo = :producto_catalogo, 
                            cantidad = :cantidad, 
                            cliente = :cliente, 
                            revendedora = :revendedora,
                            precio_total=:precio_total,
                            precio_unitario=:precio_unitario
                          WHERE 
                            (id = :id);";
            $productoCatalogoRepository = new ProductoCatalogoRepository();
            $productoCatalogoObjeto = $productoCatalogoRepository->get((int)$pedidoProductoCatalogo->getProductoCatalogo()->getId());
            $productoCatalogo = (int)$productoCatalogoObjeto->getId();
            $cantidad = (int)$pedidoProductoCatalogo->getCantidad();
            $cliente = $pedidoProductoCatalogo->getCliente() ? (int)$pedidoProductoCatalogo->getCliente()->getId() : null;
            $revendedora = $pedidoProductoCatalogo->getRevendedora() ? (int)$pedidoProductoCatalogo->getRevendedora()->getId() : null;
            $id = (int)$pedidoProductoCatalogo->getId();
            $precioUnitario = (float)$productoCatalogoObjeto->getPrecio();
            $precioTotal = $precioUnitario * $cantidad;
            $stmtCreate = $db->prepare($sqlCreate);
            $stmtCreate->bindParam(':producto_catalogo', $productoCatalogo, PDO::PARAM_INT);
            $stmtCreate->bindParam(':cantidad', $cantidad, PDO::PARAM_INT);
            $stmtCreate->bindParam(':cliente', $cliente, PDO::PARAM_INT);
            $stmtCreate->bindParam(':revendedora', $revendedora, PDO::PARAM_INT);
            $stmtCreate->bindParam(':precio_unitario', $precioUnitario);
            $stmtCreate->bindParam(':precio_total', $precioTotal);
            $stmtCreate->bindParam(':id', $id, PDO::PARAM_INT);

            $stmtCreate->execute();
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

    }

    public function recibir(int $id): void
    {
        $db = $this->connect();
        $db->beginTransaction();
        try {
            $sql = "UPDATE herramientas.remito_producto SET recibido = :recibido WHERE (id = :id)";

            $recibido = true;


            //prepara inserción base de datos
            $stmt = $db->prepare($sql);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->bindParam(':recibido', $recibido, PDO::PARAM_BOOL);
            $stmt->execute();

            $sqlRecibirEnPedido = ("SELECT pedido_producto_catalogo.id FROM herramientas.remito_producto
inner join herramientas.remito on remito_producto.remito=remito.id
inner join herramientas.factura on remito.factura=factura.id
inner join herramientas.campania on factura.campania=campania.id
inner join herramientas.pedido_avon on pedido_avon.campania=campania.id
inner join herramientas.pedido_producto_catalogo on pedido_avon.id=pedido_producto_catalogo.pedido_avon 
where remito_producto.id=:id
;");

            $stmtRecibirEnPedido = $db->prepare($sqlRecibirEnPedido);
            $stmtRecibirEnPedido->bindParam(':id', $id, PDO::PARAM_INT);
            $stmtRecibirEnPedido->execute();

            $items = $stmtRecibirEnPedido->fetchAll(PDO::FETCH_OBJ);
            foreach ($items as $item) {
                $pedidoProductoCatalogoRepository = new PedidoProductoCatalogoRepository($this->db);
                $pedidoProductoCatalogoRepository->recibir((int)$item->id);
            }
            $db->commit();

        } catch (Exception $e) {
            //TODO: implementar ex
            if ($db != null) $db->rollback();

            if ($e instanceof PDOException && $stmt->errorInfo()[0] == 23000 && $stmt->errorInfo()[1] == 1062) {
                $array = explode("'", $stmt->errorInfo()[2]);
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
            $stmt = null;
            $this->disconnect();
        }
    }

    public function getCsvFile(int $remitoId)
    {

        $datos = array();
        $datosPlanos = array();
        $cabecera = array('Id', 'ProductoN', 'Descripcion', 'Cantidad');

        // Datos de presentaciones
        $remitoProductosPorRemito = $this->getAllRemitoProductoPorRemito($remitoId);
        foreach ($remitoProductosPorRemito as $remitoProductoPorRemito) {
            $fila = [
                $remitoProductoPorRemito->getId(),
                $remitoProductoPorRemito->getProducto()->getId(),
                $remitoProductoPorRemito->getProducto()->getDescripcion(),
                $remitoProductoPorRemito->getCantidad()

            ];
            array_push($datosPlanos, $fila);

        }


        $delimiter = ",";
        $filename = "remito" . $remitoId . ".csv";

        $f = fopen('php://memory', 'r+');

        //set column headers
        $fields = array('Id', 'ProductoN', 'Descripcion', 'Cantidad');
        fputcsv($f, $fields, $delimiter);

        //output each row of the data, format line as csv and write to file pointer


        foreach ($datosPlanos as $filacsv) {
            fputcsv($f, $filacsv, $delimiter);

        }

        rewind($f);
        $contenido = rtrim(stream_get_contents($f));

        $archivo = new Archivo();
        $archivo->setNombre($filename);
        $archivo->setTipo("text/csv");
        $archivo->setContenido($contenido);
        return $archivo;
    }


    private function createFromResultset($result, array $fields, $db)
    {


        $item = new RemitoProducto();
        $item->setId((int)$result->id);
        $item->setRemito((new RemitoRepository($db))->get($result->remito));
        $item->setProducto((new ProductoRepository($db))->get($result->producto));
        $item->setCantidad((int)$result->cantidad);
        $item->setRecibido((bool)$result->recibido);
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

    public function getAllProductosPorPedido(int $id, bool $full = true): Array
    {

        $sql = "SELECT *
                FROM pedido_producto_catalogo WHERE pedido_avon=:id";

        $db = $this->connect();
        $stmt = $db->prepare($sql);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        $items = $stmt->fetchAll(PDO::FETCH_OBJ);

        if ($items == null) {
            return Array();
        }

        $productosPorPedido = Array();
        foreach ($items as $item) {
            $item = $this->createFromResultset($item, $full ? ['*'] : [], $this->db);
            array_push($productosPorPedido, $item);
        }
        $this->disconnect();
        return $productosPorPedido;
    }

    public function getAllRemitoProductoPorRemito(int $id, bool $full = true): Array
    {

        $sql = "SELECT *
                FROM remito_producto WHERE remito=:id 
                ORDER BY producto";

        $db = $this->connect();
        $stmt = $db->prepare($sql);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        $items = $stmt->fetchAll(PDO::FETCH_OBJ);

        if ($items == null) {
            return Array();
        }

        $remitoProductosPorRemito = Array();
        foreach ($items as $item) {
            $item = $this->createFromResultset($item, $full ? ['*'] : [], $this->db);
            array_push($remitoProductosPorRemito, $item);
        }
        $this->disconnect();
        return $remitoProductosPorRemito;
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

    /**
     * @param int $id
     * @throws BadRequestException
     */
    public function delete(int $id): void
    {
        $db = $this->connect();

        $db->beginTransaction();
        try {
            PedidoProductoCatalogoRepository::checkCampaniaPedidoProductoCatalogo($id);
            $sqlDelete = "DELETE FROM herramientas.pedido_producto_catalogo WHERE id=:id";
            $stmtDelete = $db->prepare($sqlDelete);
            $stmtDelete->bindParam(':id', $id, PDO::PARAM_INT);
            $stmtDelete->execute();
            $db->commit();

        } catch (Exception $e) {
            if ($db != null) $db->rollback();
            if ($e instanceof PDOException && $stmtDelete->errorInfo()[0] == 23000 && $stmtDelete->errorInfo()[1] == 1451) {
                $array = explode("`", $stmtDelete->errorInfo()[2]);

                switch ($array[5]) {

                    case 'PERSONA_REVENDEDORA':
                        //TODO:verificar id de revendedora
                        $personaRepository = new PersonaRepository($this->db);
                        throw new BadRequestException("Existe una relación para la persona " . $personaRepository->get($id)->getNombre() . " " . $personaRepository->get($id)->getApellidoSegundo() . " con Revendedora id X");
                        break;
                }
            } else {
                throw $e;
            }
        } finally {

            $stmtDelete = null;
            $this->disconnect();

        }
    }

    public function checkCampaniaPedidoProductoCatalogo(int $id)
    {
        try {

            $db = $this->connect();
            $sqlCheckCampaniaPedidoProductoCatalogo = "SELECT campania.activo as activo from herramientas.campania 
INNER JOIN herramientas.pedido_avon on herramientas.pedido_avon.campania= campania.id
INNER JOIN herramientas.pedido_producto_catalogo on herramientas.pedido_producto_catalogo.pedido_avon= pedido_avon.id 
WHERE pedido_producto_catalogo.id=:id";
            $stmtCheckCampaniaPedidoProductoCatalogo = $db->prepare($sqlCheckCampaniaPedidoProductoCatalogo);
            $stmtCheckCampaniaPedidoProductoCatalogo->bindParam(':id', $id, PDO::PARAM_INT);
            $stmtCheckCampaniaPedidoProductoCatalogo->execute();
            $result = $stmtCheckCampaniaPedidoProductoCatalogo->fetchObject();
            if ($result->activo == 0) {

                return false;
            } else {

                return true;
            }


        } catch (PDOException $e) {
            throw  $e;

        } finally {
            $result = null;
            $sqlCheckCampaniaPedidoProductoCatalogo = null;
            $stmtCheckCampaniaActivaCampaniaActiva = null;
        }
        return false;
    }

    public function compararPedidoRemito()
    {


        $sqlPedido = "select producto.id as producto, sum(pedido_producto_catalogo.cantidad) as cantidad from herramientas.pedido_producto_catalogo 
inner join herramientas.producto_catalogo on pedido_producto_catalogo.producto_catalogo=producto_catalogo.id
inner join herramientas.producto on producto_catalogo.producto=producto.id
where pedido_producto_catalogo.pedido_avon=2 && producto.id=10
order by producto.id";

        $db = $this->connect();
        $stmt = $db->prepare($sqlPedido);
        $stmt->execute();
        $results = $stmt->fetchAll(PDO::FETCH_OBJ);
        $itemsPedido = Array();
        foreach ($results as $result) {
            $itemPedido = new ComparaPedidoRemito();
            $itemPedido->setCantidad((int)$result->cantidad);
            $itemPedido->setProductoId((int)$result->producto);
            array_push($itemsPedido, $itemPedido);
        }


        $sqlRemito = "select remito_producto.producto as producto, remito_producto.cantidad as cantidad from remito_producto			
			where remito_producto.remito=1";

        $db = $this->connect();
        $stmt = $db->prepare($sqlRemito);
        $stmt->execute();
        $results = $stmt->fetchAll(PDO::FETCH_OBJ);
        $itemsRemito = Array();
        foreach ($results as $result) {
            $itemRemito = new ComparaPedidoRemito();
            $itemRemito->setCantidad((int)$result->cantidad);
            $itemRemito->setProductoId((int)$result->producto);
            array_push($itemsRemito, $itemRemito);
        }


        die(print_r(Array($itemsPedido, $itemsRemito)));

        $this->disconnect();

    }


}