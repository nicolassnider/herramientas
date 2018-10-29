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

require_once '../Repository/CatalogoRepository.php';
require_once '../Repository/ProductoRepository.php';


require_once '../Commons/Exceptions/BadRequestException.php';

class PedidoProductoCatalogoRepository extends AbstractRepository
{

    /**
     * @param PedidoProductoCatalogo $pedidoProductoCatalogo
     * @return null
     * @throws BadRequestException
     */
    public function create(PedidoProductoCatalogo $pedidoProductoCatalogo): ?PedidoProductoCatalogo
    {

        try {
            $db = $this->connect();
            $db->beginTransaction();
            $sqlCreate = "INSERT INTO herramientas.pedido_producto_catalogo
                          (pedido_avon, producto_catalogo, cantidad, cliente, revendedora) 
                      VALUES 
                          (:pedido_avon, :producto_catalogo, :cantidad,:cliente, :revendedora)";

            $pedidoAvon = (int)$pedidoProductoCatalogo->getPedidoAvon()->getId();
            $productoCatalogo = (int)$pedidoProductoCatalogo->getProductoCatalogo()->getId();
            $cantidad = (int)$pedidoProductoCatalogo->getCantidad();
            $cliente = $pedidoProductoCatalogo->getCliente() ? (int)$pedidoProductoCatalogo->getCliente()->getId() : null;
            $revendedora = $pedidoProductoCatalogo->getRevendedora() ? (int)$pedidoProductoCatalogo->getRevendedora()->getId() : null;

            $stmtCreate = $db->prepare($sqlCreate);
            $stmtCreate->bindParam(':pedido_avon', $pedidoAvon, PDO::PARAM_INT);
            $stmtCreate->bindParam(':producto_catalogo', $productoCatalogo, PDO::PARAM_INT);
            $stmtCreate->bindParam(':cantidad', $cantidad, PDO::PARAM_INT);
            $stmtCreate->bindParam(':cliente', $cliente, PDO::PARAM_INT);
            $stmtCreate->bindParam(':revendedora', $revendedora, PDO::PARAM_INT);
            $stmtCreate->execute();
            $pedidoProductoCatalogo->setId($db->lastInsertId());
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
        return $pedidoProductoCatalogo;
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
                            revendedora = :revendedora 
                          WHERE 
                            (id = :id);";

            $productoCatalogo = (int)$pedidoProductoCatalogo->getProductoCatalogo()->getId();
            $cantidad = (int)$pedidoProductoCatalogo->getCantidad();
            $cliente = $pedidoProductoCatalogo->getCliente() ? (int)$pedidoProductoCatalogo->getCliente()->getId() : null;
            $revendedora = $pedidoProductoCatalogo->getRevendedora() ? (int)$pedidoProductoCatalogo->getRevendedora()->getId() : null;
            $id = (int)$pedidoProductoCatalogo->getId();
            $stmtCreate = $db->prepare($sqlCreate);
            $stmtCreate->bindParam(':producto_catalogo', $productoCatalogo, PDO::PARAM_INT);
            $stmtCreate->bindParam(':cantidad', $cantidad, PDO::PARAM_INT);
            $stmtCreate->bindParam(':cliente', $cliente, PDO::PARAM_INT);
            $stmtCreate->bindParam(':revendedora', $revendedora, PDO::PARAM_INT);
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

    public function getCsvFile(int $pedidoId): ?Archivo
    {

        $datos = array();
        $datosPlanos = array();
        $cabecera = array('Id', 'ProductoN', 'Descripcion', 'Precio', 'Cantidad', 'Cliente');

        // Datos de presentaciones
        $pedidoProductoCatalogosPorPedidos = $this->getAllProductosPorPedido($pedidoId);
        foreach ($pedidoProductoCatalogosPorPedidos as $pedidoProductoCatalogoPorPedido) {
            $fila = [
                $pedidoProductoCatalogoPorPedido->getId(),
                $pedidoProductoCatalogoPorPedido->getProductoCatalogo()->getProducto()->getId(),
                $pedidoProductoCatalogoPorPedido->getProductoCatalogo()->getProducto()->getDescripcion(),
                $pedidoProductoCatalogoPorPedido->getProductoCatalogo()->getPrecio(),
                $pedidoProductoCatalogoPorPedido->getCantidad(),
                $pedidoProductoCatalogoPorPedido->getCliente() ?
                    $pedidoProductoCatalogoPorPedido->getCliente()->getPersona()->getNombre() . ' ' . $pedidoProductoCatalogoPorPedido->getCliente()->getPersona()->getApellido() :
                    $pedidoProductoCatalogoPorPedido->getRevendedora()->getPersona()->getNombre() . ' ' . $pedidoProductoCatalogoPorPedido->getRevendedora()->getPersona()->getApellido()


            ];
            array_push($datosPlanos, $fila);

        }


        $archivo = new Archivo;

        $filename = 'pedido.csv';
        $archivo->setNombre($filename);
        $archivo->setTipo("tex/csv");
        header("Content-type: text/csv");
        header("Content-Disposition: attachment; filename=$filename");
        $output = fopen("php://output", "w");
        fputcsv($output, $cabecera);
        foreach ($datosPlanos as $row) {
            fputcsv($output, $row);
        }
        fclose($output);
        $archivo->setContenido($output);

        return $archivo;

    }

    private function createFromResultset($result, array $fields, $db)
    {

        $item = new PedidoProductoCatalogo();
        $item->setId((int)$result->id);
        $item->setPedidoAvon((new PedidoAvonRepository($db))->get($result->pedido_avon));
        $item->setProductoCatalogo((new ProductoCatalogoRepository($db))->get($result->producto_catalogo));
        $item->setCantidad((int)$result->cantidad);
        $item->setRecibido((bool)$result->recibido);
        if ($result->cliente) $item->setCliente((new ClienteRepository())->get($result->cliente));
        if ($result->revendedora) $item->setRevendedora((new RevendedoraRepository())->get($result->revendedora));

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


}