<?php
/**
 * Created by PhpStorm.
 * User: nicol
 * Date: 06/09/2018
 * Time: 11:15 PM
 */
require_once 'Db.php';
require_once 'AbstractRepository.php';
require_once '../Model/Revendedora.php';
require_once '../Repository/PersonaRepository.php';
require_once '../Repository/CategoriaRevendedoraRepository.php';

class RevendedoraRepository extends AbstractRepository
{

    public function create(Revendedora $revendedora): ?Revendedora
    {

        $db = $this->connect();
        $db->beginTransaction();
        $sqlCreate = "INSERT INTO herramientas.revendedora(categoria_revendedora, fecha_alta_revendedora, activo, persona, fecha_alta_revendedora_revendedora) 
                      VALUES (:categoria_revendedora,
                              :fecha_alta_revendedora,
                              :activo,
                              :persona)";
        $categoriaRevendedora=(int)$revendedora->getCategoriaRevendedora()->getId();
        $fechaAltaRevendedora=date('Y-m-d');
        $activo=(bool)$revendedora->getActivo();
        $persona=(int)$revendedora->getPersona()->getId();
        $stmtCreate = $db->prepare($sqlCreate);
        $stmtCreate->bindParam(':categoria_revendedora', $categoriaRevendedora);
        $stmtCreate->bindParam(':fecha_alta_revendedora', $fechaAltaRevendedora);
        $stmtCreate->bindParam(':persona', $persona,PDO::PARAM_INT);
        $stmtCreate->bindParam(':activo', $activo, PDO::PARAM_BOOL);
        $stmtCreate->execute();
        $revendedora->setId($db->lastInsertId());
        $db->commit();
        return $revendedora;
    }

    public function getAll(bool $full = true): Array {
        $sql = "SELECT *
                FROM revendedora";

        $db = $this->connect();
        $stmt = $db->prepare($sql);
        $stmt->execute();
        $items = $stmt->fetchAll(PDO::FETCH_OBJ);


        if ($items == null) {
            return Array();
        }

        $revendedoras = Array();
        foreach ($items as $item) {
            $item = $this->createFromResultset($item, $full ? ['*'] : [], $this->db);
            array_push($revendedoras, $item);
        }



        $this->disconnect();
        return $revendedoras;
    }

    public function getAllActiveSorted(): Array {
        $sql = "SELECT rev.id, per.nombre, per.apellido FROM revendedora rev
LEFT JOIN persona per on rev.persona = per.id
WHERE per.activo=1";

        $db = $this->connect();
        $stmt = $db->prepare($sql);
        $stmt->execute();
        $items = $stmt->fetchAll(PDO::FETCH_OBJ);

        if ($items == null) {
            return Array();
        }

        $revendedoras = Array();
        foreach ($items as $item) {
            $revendedora = $this->createFromResultset($item, [], $this->db);


            array_push($revendedoras, $revendedora);
        }

        $this->disconnect();
        return $revendedoras;
    }

    public function grid(DataTablesResponse $dataTablesResponse, DataTableRequest $dataTableRequest) {
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
                switch($columna['data']) {
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
        switch($columnaAOrdernar) {
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
            if($item->base != null) {
                $base = new Base();
                $base->setId((int)$item->base);
                $base->setDescripcion($item->base_descripcion);
            }

            $personaCategoria = null;
            if($item->categoria != null) {
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

    public function get(int $id, bool $full = true): ?Revendedora {
        $sqlGet = "SELECT * FROM revendedora WHERE id=:id";

        $db = $this->connect();
        $stmtGet = $db->prepare($sqlGet);
        $stmtGet->bindParam(':id', $id, PDO::PARAM_INT);
        $stmtGet->execute();
        $result = $stmtGet->fetchObject();

        if ($result == null) {
            return null;
        }

        $revendedora = $this->createFromResultset($result, $full ? ['*'] : [], $this->db);

        $this->disconnect();
        return $revendedora;
    }


    private function createFromResultset($result, array $fields, $db)
    {

        $item = new Revendedora();
        $item->setId((int)$result->id);
        $item->setFechaAltaRevendedora(DateTime::createFromFormat('Y-m-d', $result->fecha_alta_revendedora));
        if ($result->fecha_baja_revendedora){
        $item->setFechaBajaRevendedora(DateTime::createFromFormat('Y-m-d', $result->fecha_baja_revendedora));}
        $item->setActivo((bool)$result->activo);
        if (in_array('*', $fields) || in_array('categoriaRevendedora', $fields))
            $item->setCategoriaRevendedora((new CategoriaRevendedoraRepository($db))->get($result->categoria_revendedora));
        if (in_array('*', $fields) || in_array('persona', $fields))
            $item->setPersona((new PersonaRepository($db))->get($result->persona));


        return $item;
    }

}