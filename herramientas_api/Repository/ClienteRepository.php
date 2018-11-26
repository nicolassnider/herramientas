<?php
/**
 * Created by PhpStorm.
 * User: nicol
 * Date: 06/09/2018
 * Time: 11:15 PM
 */
require_once 'Db.php';
require_once 'AbstractRepository.php';
require_once '../Model/Cliente.php';
require_once '../Model/Archivo.php';
require_once '../Model/ClientesMasDeudores.php';
require_once '../Model/ConsumoClientes.php';

require_once '../Repository/PersonaRepository.php';
require_once '../Repository/CategoriaClienteRepository.php';
require_once '../Repository/RevendedoraRepository.php';
require_once '../Commons/Exceptions/BadRequestException.php';


class ClienteRepository extends AbstractRepository
{

    public function getClientesporRevendedoraCsvFile(int $revendedoraId)
    {

        $datos = array();
        $datosPlanos = array();

        // Datos de presentaciones
        $clientesPorRevendedora = $this->getClientesporRevendedora($revendedoraId);
        foreach ($clientesPorRevendedora as $clientePorRevendedora) {
            $fila = [
                $clientePorRevendedora->getId(),
                $clientePorRevendedora->getPersona()->getNombre(),
                $clientePorRevendedora->getPersona()->getApellido(),
                $clientePorRevendedora->getPersona()->getTipoDocumento()->getDescripcion(),
                $clientePorRevendedora->getPersona()->getDocumento(),

            ];
            array_push($datosPlanos, $fila);

        }

        $delimiter = ",";
        $filename = "pedido.csv";

        $f = fopen('php://memory', 'r+');

        //set column headers
        $fields = array('Id', 'Nombre', 'Apellido', 'T.Doc', 'Doc');
        fputcsv($f, $fields, $delimiter);

        //output each row of the data, format line as csv and write to file pointer


        foreach ($datosPlanos as $filacsv) {
            fputcsv($f, $filacsv, $delimiter);

        }

        rewind($f);
        $contenido = rtrim(stream_get_contents($f));

        $archivo = new Archivo();
        $archivo->setNombre("Clientes.csv");
        $archivo->setTipo("text/csv");
        $archivo->setContenido($contenido);
        return $archivo;
    }

    public function getClientesPorRevendedora(int $revendedoraId, bool $full = true): Array
    {
        $sql = "SELECT *
                FROM cliente WHERE cliente.revendedora=:revendedora_id";

        $db = $this->connect();
        $stmt = $db->prepare($sql);
        $stmt->bindParam(':revendedora_id', $revendedoraId, PDO::PARAM_INT);
        $stmt->execute();
        $items = $stmt->fetchAll(PDO::FETCH_OBJ);

        if ($items == null) {
            return Array();
        }

        $clientes = Array();
        foreach ($items as $item) {
            $item = $this->createFromResultset($item, $full ? ['*'] : [], $this->db);
            array_push($clientes, $item);
        }


        $this->disconnect();
        return $clientes;
    }

    public function getClientesMasDeudoresCsvFile()
    {

        $datos = array();
        $datosPlanos = array();

        // Datos de presentaciones
        $clientesMasDeudores = $this->getClientesMasDeudores();
        foreach ($clientesMasDeudores as $clienteMasDeudor) {
            $fila = [
                $clienteMasDeudor->getNombre(),
                $clienteMasDeudor->getApellido(),
                $clienteMasDeudor->getDeuda()

            ];
            array_push($datosPlanos, $fila);

        }

        $delimiter = ",";
        $filename = "clientesMasDeudores.csv";

        $f = fopen('php://memory', 'r+');

        //set column headers
        $fields = array('Nombre', 'Apellido', 'Deuda');
        fputcsv($f, $fields, $delimiter);

        //output each row of the data, format line as csv and write to file pointer


        foreach ($datosPlanos as $filacsv) {
            fputcsv($f, $filacsv, $delimiter);

        }

        rewind($f);
        $contenido = rtrim(stream_get_contents($f));

        $archivo = new Archivo();
        $archivo->setNombre("ClientesMasDeudores.csv");
        $archivo->setTipo("text/csv");
        $archivo->setContenido($contenido);
        return $archivo;
    }

    public function getClientesMasDeudores(): Array
    {
        $sql = "Select persona.nombre, persona.apellido, sum(pedido_producto_catalogo.saldo) deuda from pedido_producto_catalogo 
inner join cliente on pedido_producto_catalogo.cliente=cliente.id 
inner join persona on cliente.persona=persona.id 
where cobrado=0 GROUP by cliente.id ORDER BY deuda DESC,persona.apellido";

        $db = $this->connect();
        $stmt = $db->prepare($sql);
        $stmt->execute();
        $items = $stmt->fetchAll(PDO::FETCH_OBJ);

        if ($items == null) {
            return Array();
        }
        $clientesMasDeudores = Array();
        foreach ($items as $item) {
            $clienteMasDeudor = new ClientesMasDeudores();
            $clienteMasDeudor->setNombre($item->nombre);
            $clienteMasDeudor->setApellido($item->apellido);
            $clienteMasDeudor->setDeuda((float)$item->deuda);
            array_push($clientesMasDeudores, $clienteMasDeudor);
        }
        $this->disconnect();
        return $clientesMasDeudores;
    }

    public function getConsumoClientesCsvFile(int $id)
    {

        $datos = array();
        $datosPlanos = array();

        // Datos de presentaciones
        $consumoClientes = $this->getConsumoClientes($id);
        foreach ($consumoClientes as $consumoCliente) {
            $fila = [
                $consumoCliente->getPedidoAvon(),
                $consumoCliente->getIdCliente(),
                $consumoCliente->getNombre(),
                $consumoCliente->getApellido(),
                $consumoCliente->getIdProducto(),
                $consumoCliente->getDescripcion(),
                $consumoCliente->getConsumo()
            ];
            array_push($datosPlanos, $fila);

        }

        $delimiter = ",";
        $filename = "consumoClientes.csv";

        $f = fopen('php://memory', 'r+');

        //set column headers
        $fields = array('Pedido', 'Id Cliente', 'Nombre', 'Apellido', 'Id Producto', 'Descripcion', 'Consumo');
        fputcsv($f, $fields, $delimiter);

        //output each row of the data, format line as csv and write to file pointer


        foreach ($datosPlanos as $filacsv) {
            fputcsv($f, $filacsv, $delimiter);

        }

        rewind($f);
        $contenido = rtrim(stream_get_contents($f));

        $archivo = new Archivo();
        $archivo->setNombre("consumoCliente_" . $id . ".csv");
        $archivo->setTipo("text/csv");
        $archivo->setContenido($contenido);
        return $archivo;
    }

    public function getConsumoClientes(int $id): Array
    {
        $sql = "SELECT pedido_avon, cliente.id cliente_id, persona.nombre, persona.apellido, producto.id producto_id,producto.descripcion, sum(cantidad) consumo  FROM herramientas.pedido_producto_catalogo
inner join cliente on pedido_producto_catalogo.cliente=cliente.id
inner join persona on cliente.persona=persona.id
inner join producto_catalogo on pedido_producto_catalogo.producto_catalogo=producto_catalogo.id
inner join producto on producto_catalogo.producto=producto.id
where cliente.id=:id
group by producto.id,pedido_producto_catalogo.pedido_avon
order by producto.id";

        $db = $this->connect();
        $stmt = $db->prepare($sql);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        $items = $stmt->fetchAll(PDO::FETCH_OBJ);

        if ($items == null) {
            return Array();
        }
        $consumoClientes = Array();
        foreach ($items as $item) {
            $consumoCliente = new ConsumoClientes();
            $consumoCliente->setPedidoAvon($item->pedido_avon);
            $consumoCliente->setIdCliente($item->cliente_id);
            $consumoCliente->setNombre($item->nombre);
            $consumoCliente->setApellido($item->apellido);
            $consumoCliente->setIdProducto($item->producto_id);
            $consumoCliente->setDescripcion($item->descripcion);
            $consumoCliente->setConsumo($item->consumo);
            array_push($consumoClientes, $consumoCliente);
        }
        $this->disconnect();
        return $consumoClientes;
    }


    /**
     * @param Cliente $cliente
     * @return null|Cliente
     * @throws BadRequestException
     */
    public function create(Cliente $cliente): ?Cliente
    {

        try {
            $db = $this->connect();
            $db->beginTransaction();
            $sqlCreate = "INSERT INTO herramientas.cliente(
                              categoria_cliente, 
                              direccion_entrega, 
                              ubicacion, 
                              fecha_alta_cliente, 
                              anio_nacimiento, 
                              madre, 
                              apodo, 
                              persona, 
                              activo, 
                              revendedora) 
                      VALUES (
                              :categoria_cliente, 
                              :direccion_entrega, 
                              :ubicacion, 
                              :fecha_alta_cliente, 
                              :anio_nacimiento, 
                              :madre, 
                              :apodo, 
                              :persona, 
                              :activo, 
                              :revendedora)";
            $categoriaCliente = (int)$cliente->getCategoriaCliente()->getId();
            $direccionEntrega = $cliente->getDireccionEntrega();
            //TODO: implementar ubicacion
            $ubicacion = null;
            $fechaAltaCliente = date('Y-m-d');
            $anioNacimiento = (string)$cliente->getAnioNacimiento()->format("Y-m-d");
            $madre = $cliente->getMadre();
            $apodo = $cliente->getApodo();
            $persona = (int)$cliente->getPersona()->getId();
            $activo = (bool)$cliente->getActivo();
            $revendedora = (int)$cliente->getRevendedora()->getId();
            $stmtCreate = $db->prepare($sqlCreate);
            $stmtCreate->bindParam(':categoria_cliente', $categoriaCliente, PDO::PARAM_INT);
            $stmtCreate->bindParam(':direccion_entrega', $direccionEntrega);
            $stmtCreate->bindParam(':ubicacion', $ubicacion);
            $stmtCreate->bindParam(':fecha_alta_cliente', $fechaAltaCliente);
            $stmtCreate->bindParam(':anio_nacimiento', $anioNacimiento);
            $stmtCreate->bindParam(':madre', $madre, PDO::PARAM_BOOL);
            $stmtCreate->bindParam(':apodo', $apodo);
            $stmtCreate->bindParam(':persona', $persona, PDO::PARAM_INT);
            $stmtCreate->bindParam(':activo', $activo, PDO::PARAM_BOOL);
            $stmtCreate->bindParam(':revendedora', $revendedora, PDO::PARAM_INT);
            $stmtCreate->execute();
            $cliente->setId($db->lastInsertId());
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
        return $cliente;
    }

    public function update(Cliente $cliente): void
    {
        $db = $this->connect();
        $db->beginTransaction();
        try {
            $sqlUpdate = "UPDATE herramientas.cliente 
                                SET 
                                  categoria_cliente=:categoria_cliente,
                                  direccion_entrega=:direccion_entrega,
                                  ubicacion=:ubicacion,
                                  anio_nacimiento=:anio_nacimiento,
                                  madre=:madre,
                                  apodo=:apodo,
                                  revendedora=:revendedora
                                WHERE
                                  (id =:id)
                                ";

            $categoriaCliente = (int)$cliente->getCategoriaCliente()->getId();
            $direccionEntrega = $cliente->getDireccionEntrega();
            //TODO: implementar ubicacion
            $ubicacion = null;
            $anioNacimiento = (string)$cliente->getAnioNacimiento()->format("Y-m-d");
            $madre = $cliente->getMadre();
            $apodo = $cliente->getApodo();
            $revendedora = (int)$cliente->getRevendedora()->getId();
            $id = $cliente->getId();
            $stmtUpdate = $db->prepare($sqlUpdate);
            $stmtUpdate->bindParam(':categoria_cliente', $categoriaCliente, PDO::PARAM_INT);
            $stmtUpdate->bindParam(':direccion_entrega', $direccionEntrega);
            $stmtUpdate->bindParam(':ubicacion', $ubicacion);
            $stmtUpdate->bindParam(':anio_nacimiento', $anioNacimiento);
            $stmtUpdate->bindParam(':madre', $madre, PDO::PARAM_BOOL);
            $stmtUpdate->bindParam(':apodo', $apodo);
            $stmtUpdate->bindParam(':revendedora', $revendedora, PDO::PARAM_INT);
            $stmtUpdate->bindParam(':id', $id, PDO::PARAM_INT);
            $stmtUpdate->execute();
            $db->commit();
        } catch (Exception $e) {
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
            $sqlDelete = "DELETE FROM herramientas.cliente WHERE id=:id";
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

    public function deactivate(int $id): void
    {
        $db = $this->connect();
        $db->beginTransaction();
        try {
            $sqlDeactivate = "UPDATE herramientas.cliente SET activo = :activo, fecha_baja_cliente = :fecha_baja_cliente WHERE (id = :id);";
            $fechaBajaCliente = date('Y-m-d');
            $activo = false;

            //prepara inserción base de datos
            $stmtDeactivate = $db->prepare($sqlDeactivate);
            $stmtDeactivate->bindParam(':id', $id, PDO::PARAM_INT);
            $stmtDeactivate->bindParam(':activo', $activo, PDO::PARAM_BOOL);
            $stmtDeactivate->bindParam(':fecha_baja_cliente', $fechaBajaCliente);
            $stmtDeactivate->execute();
            $db->commit();

        } catch (Exception $e) {
            //TODO: implementar ex
            if ($db != null) $db->rollback();

            if ($e instanceof PDOException && $stmtDeactivate->errorInfo()[0] == 23000 && $stmtDeactivate->errorInfo()[1] == 1062) {
                $array = explode("'", $stmtDeactivate->errorInfo()[2]);
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
            $stmtDeactivate = null;
            $this->disconnect();
        }
    }

    public function activate(int $id): void
    {
        $db = $this->connect();
        $db->beginTransaction();
        try {
            $sqlActivate = "UPDATE herramientas.cliente SET activo = :activo, fecha_baja_cliente=:fecha_baja_cliente WHERE (id = :id);";
            $activo = true;
            $fechaBajaCliente = null;
            //prepara inserción base de datos
            $stmtActivate = $db->prepare($sqlActivate);
            $stmtActivate->bindParam(':id', $id, PDO::PARAM_INT);
            $stmtActivate->bindParam(':activo', $activo, PDO::PARAM_BOOL);
            $stmtActivate->bindParam(':fecha_baja_cliente', $fechaBajaCliente);
            $stmtActivate->execute();
            $db->commit();
            $stmtActivate->errorInfo();
        } catch (Exception $e) {
            if ($db != null) $db->rollback();


            if ($e instanceof PDOException && $stmtActivate->errorInfo()[0] == 23000 && $stmtActivate->errorInfo()[1] == 1062) {
                $array = explode("'", $stmtActivate->errorInfo()[2]);
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
            $stmtActivate = null;
            $this->disconnect();

        }
    }

    public function getAll(bool $full = true): Array
    {
        $sql = "SELECT *
                FROM cliente";

        $db = $this->connect();
        $stmt = $db->prepare($sql);
        $stmt->execute();
        $items = $stmt->fetchAll(PDO::FETCH_OBJ);

        if ($items == null) {
            return Array();
        }

        $clientes = Array();
        foreach ($items as $item) {
            $item = $this->createFromResultset($item, $full ? ['*'] : [], $this->db);
            array_push($clientes, $item);
        }


        $this->disconnect();
        return $clientes;
    }

    public function getAllActiveSorted(): Array
    {
        $sql = "SELECT cli.id, per.nombre, per.apellido FROM cliente cli
LEFT JOIN persona per on cli.persona = per.id
WHERE cli.activo=1";

        $db = $this->connect();
        $stmt = $db->prepare($sql);
        $stmt->execute();
        $items = $stmt->fetchAll(PDO::FETCH_OBJ);


        if ($items == null) {
            return Array();
        }

        $clientes = Array();
        foreach ($items as $item) {
            $cliente = $this->get($item->id);


            array_push($clientes, $cliente);
        }

        $this->disconnect();
        return $clientes;
    }


    public function get(int $id, bool $full = true): ?Cliente
    {
        $sqlGet = "SELECT cli.*  FROM cliente cli                     
                    WHERE cli.id=:id
                    ";

        $db = $this->connect();
        $stmtGet = $db->prepare($sqlGet);
        $stmtGet->bindParam(':id', $id, PDO::PARAM_INT);
        $stmtGet->execute();
        $result = $stmtGet->fetchObject();

        if ($result == null) {
            return null;
        }

        $cliente = $this->createFromResultset($result, $full ? ['*'] : [], $this->db);
        $this->disconnect();
        return $cliente;
    }


    private function createFromResultset($result, array $fields, $db)
    {

        $item = new Cliente();
        $item->setId((int)$result->id);
        if (in_array('*', $fields) || in_array('categoriaCliente', $fields))
            $item->setCategoriaCliente((new CategoriaClienteRepository($db))->get($result->categoria_cliente));
        $item->setDireccionEntrega($result->direccion_entrega);
        //TODO: implementar ubicacion
        /*if (in_array('*', $fields) || in_array('ubicacion', $fields))
            $item->setUbicacion((new UbicacionRepository($db))->get($result->ubicacion));*/

        $item->setFechaAltaCliente(new DateTime($result->fecha_alta_cliente));
        $item->setFechaBajaCliente(new DateTime($result->fecha_baja_cliente));
        $item->setAnioNacimiento(new DateTIme($result->anio_nacimiento));
        $item->setMadre((bool)$result->madre);
        $item->setApodo($result->apodo);
        if (in_array('*', $fields) || in_array('persona', $fields))
            $item->setPersona((new PersonaRepository($db))->get($result->persona));
        $item->setActivo((bool)$result->activo);
        if (in_array('*', $fields) || in_array('revendedora', $fields))
            $item->setRevendedora((new RevendedoraRepository($db))->get($result->revendedora));

        return $item;
    }

}