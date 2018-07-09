<?php
/**
 * Created by Nicolás Snider
 * Date: 09/07/2018
 * Time: 12:33 PM
 */
require_once 'Db.php';
require_once '../Model/Persona.php';


class PersonaRepository extends AbstractRepository {
    public function get($id) {
        $consulta = "SELECT * FROM personas WHERE id=:id";

        $db = $this->connect();
        $stmt = $db->prepare($consulta);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();

        $resultado = $stmt->fetchObject();
        if ($resultado == null) {
            return null;
        }

        $persona = new Persona();
        $persona->setId((int)$resultado->id);
        $persona->setNombre($resultado->nombre);
        $persona->setApellido($resultado->apellido);
        $persona->setDocumentoTipo((new TipoDocumentoRepository($this->db))->get($resultado->documento_tipo));
        $persona->setDocumentoNumero($resultado->documento_numero);
        $persona->setNacionalidad((new PaisRepository($this->db))->get($resultado->nacionalidad));
        $persona->setSexo($resultado->sexo);
        $persona->setFechaNacimiento($resultado->fecha_nacimiento != null ? $resultado->fecha_nacimiento : null);
        $persona->setEsActivo((bool)$resultado->es_activo);
        $persona->setCalle($resultado->calle);
        $persona->setNumero((int)$resultado->numero);
        $persona->setPiso($resultado->piso);
        $persona->setDepartamento($resultado->departamento);
        $persona->setLocalidad((new LocalidadRepository($this->db))->get($resultado->localidad));
        if ($resultado->localidad == null) {
            $persona->setProvincia(null);
            $persona->setPais(null);
        } else {
            $persona->setProvincia((new ProvinciaRepository($this->db))->get($persona->getLocalidad()->getProvincia()->getId()));
            $persona->setPais((new PaisRepository($this->db))->get($persona->getProvincia()->getPais()->getId()));
        }
        $persona->setTelefonoCodArea((int)$resultado->telefono_codigo_area);
        $persona->setTelefonoNumero((int)$resultado->telefono_numero);
        $persona->setCelularCodArea((int)$resultado->celular_codigo_area);
        $persona->setCelularNumero((int)$resultado->celular_numero);
        $persona->setEmail($resultado->email);
        $persona->setObservaciones($resultado->observaciones);
        $persona->setLegajoNumero($resultado->legajo_numero);
        $persona->setFechaIngreso($resultado->fecha_ingreso);
        $persona->setFechaBaja($resultado->fecha_baja);
        $persona->setBase((new BasesRepository($this->db))->get($resultado->base));
        $persona->setCategoria((new PersonaCategoriaRepository($this->db))->get($resultado->categoria));
        $persona->setContrato($resultado->contrato);
        $persona->setYpfRuta($resultado->ypf_ruta);
        $persona->setComentariosLaborales($resultado->comentarios_laborales);
        $persona->setEsUsuario((bool)$resultado->es_usuario);
        if ($persona->getEsUsuario()) {
            $usuario = (new UsuarioRepository($this->db))->buscar($persona->getId());
            $persona->setUsuario($usuario);
        }
        $persona->setFoto($resultado->foto);
        $this->disconnect();
        return $persona;
    }

    public function getAll() {
        $personas = Array();
        $consulta = "SELECT p.* FROM personas p";
        try {

            //conexionBD
            $db = $this->connect();

            $stmt = $db->prepare($consulta);
            $stmt->execute();
            $items = $stmt->fetchAll(PDO::FETCH_OBJ);

            if ($items == null) {
                return null;
            }

            foreach ($items as $item) {
                $persona = new Persona();
                $persona->setId((int)$item->id);
                $persona->setNombre($item->nombre);
                $persona->setApellido($item->apellido);
                $persona->setDocumentoNumero($item->documento_numero);
                $persona->setSexo($item->sexo);
                $persona->setFechaNacimiento($item->fecha_nacimiento);
                $persona->setEsActivo($item->es_activo);
                $persona->setCalle($item->calle);
                $persona->setNumero((int)$item->numero);
                $persona->setPiso($item->piso);
                $persona->setDepartamento($item->departamento);
                $persona->setTelefonoCodArea((int)$item->telefono_codigo_area);
                $persona->setTelefonoNumero((int)$item->telefono_numero);
                $persona->setCelularCodArea((int)$item->celular_codigo_area);
                $persona->setCelularNumero((int)$item->celular_numero);
                $persona->setEmail($item->email);
                $persona->setObservaciones($item->observaciones);
                $persona->setLegajoNumero($item->legajo_numero);
                $persona->setFechaIngreso($item->fecha_ingreso);
                $persona->setFechaBaja($item->fecha_baja);
                $persona->setContrato($item->contrato);
                $persona->setYpfRuta($item->ypf_ruta);
                $persona->setComentariosLaborales($item->comentarios_laborales);
                $persona->setEsUsuario((bool)($item->es_usuario));
                $persona->setFoto($item->foto);

                array_push($personas, $persona);
            }
        } finally {
            $db = null;
            $items = null;
            $this->disconnect();
        }
        return $personas;
    }

    public function create(Persona $persona)
    {

        try {

            $consulta = "INSERT INTO personas(nombre, apellido, documento_tipo, documento_numero, nacionalidad, sexo, fecha_nacimiento, es_activo, calle, numero, piso, departamento, localidad, telefono_codigo_area, telefono_numero, celular_codigo_area, celular_numero, email, observaciones, legajo_numero, fecha_ingreso, fecha_baja, base, categoria, contrato, ypf_ruta, comentarios_laborales, es_usuario,foto) 
                        VALUES (:nombre, :apellido, :documento_tipo, :documento_numero, :nacionalidad, :sexo, :fecha_nacimiento, :es_activo, :calle, :numero, :piso, :departamento, :localidad, :telefono_codigo_area, :telefono_numero, :celular_codigo_area, :celular_numero, :email, :observaciones, :legajo_numero, :fecha_ingreso, :fecha_baja, :base, :categoria, :contrato, :ypf_ruta, :comentarios_laborales, :es_usuario,:foto)";
            $nombre = $persona->getNombre();
            $apellido = $persona->getApellido();
            $documentoTipo = $persona->getDocumentoTipo()->getId();
            $documentoNumero = $persona->getDocumentoNumero();
            $nacionalidad = $persona->getNacionalidad()->getId();
            $sexo = $persona->getSexo();
            $fechaNacimiento = $persona->getFechaNacimiento();
            $esActivo = $persona->getEsActivo();
            $calle = $persona->getCalle();
            $numero = $persona->getNumero();
            $piso = $persona->getPiso();
            $departamento = $persona->getDepartamento();
            $localidad = $persona->getLocalidad()->getId();
            $telefonoCodArea = $persona->getTelefonoCodArea();
            $telefonoNumero = $persona->getTelefonoNumero();
            $celularCodArea = $persona->getCelularCodArea();
            $celularNumero = $persona->getCelularNumero();
            $email = $persona->getEmail();
            $observaciones = $persona->getObservaciones();
            $legajoNumero = $persona->getLegajoNumero();
            $fechaIngreso = $persona->getFechaIngreso();
            $fechaBaja = $persona->getFechaBaja();
            $base = $persona->getBase()->getId();
            $categoria = $persona->getCategoria();
            $contrato = $persona->getContrato();
            $ypfRuta = $persona->getYpfRuta();
            $comentariosLaborales = $persona->getComentariosLaborales();
            $esUsuario = $persona->getEsUsuario();
            $foto = $persona->getFoto();


            //prepara inserción base de datos
            $db = $this->connect();
            $db->beginTransaction();

            $stmt = $db->prepare($consulta);

            $stmt->bindParam(':nombre', $nombre);
            $stmt->bindParam(':apellido', $apellido);
            $stmt->bindParam(':documento_tipo', $documentoTipo, PDO::PARAM_INT);
            $stmt->bindParam(':documento_numero', $documentoNumero);
            $stmt->bindParam(':nacionalidad', $nacionalidad, PDO::PARAM_INT);
            $stmt->bindParam(':sexo', $sexo);
            $stmt->bindParam(':fecha_nacimiento', $fechaNacimiento);
            $stmt->bindParam(':es_activo', $esActivo, PDO::PARAM_BOOL);
            $stmt->bindParam(':calle', $calle);
            $stmt->bindParam(':numero', $numero);
            $stmt->bindParam(':piso', $piso);
            $stmt->bindParam(':departamento', $departamento);
            $stmt->bindParam(':localidad', $localidad, PDO::PARAM_INT);
            $stmt->bindParam(':telefono_codigo_area', $telefonoCodArea);
            $stmt->bindParam(':telefono_numero', $telefonoNumero);
            $stmt->bindParam(':celular_codigo_area', $celularCodArea);
            $stmt->bindParam(':celular_numero', $celularNumero);
            $stmt->bindParam(':email', $email);
            $stmt->bindParam(':observaciones', $observaciones);
            $stmt->bindParam(':legajo_numero', $legajoNumero);
            $stmt->bindParam(':fecha_ingreso', $fechaIngreso);
            $stmt->bindParam(':fecha_baja', $fechaBaja);
            $stmt->bindParam(':base', $base);
            $stmt->bindParam(':categoria', $categoria, PDO::PARAM_INT);
            $stmt->bindParam(':contrato', $contrato);
            $stmt->bindParam(':ypf_ruta', $ypfRuta);
            $stmt->bindParam(':comentarios_laborales', $comentariosLaborales);
            $stmt->bindParam(':es_usuario', $esUsuario, PDO::PARAM_BOOL);
            $stmt->bindParam(':foto', $foto);
            $stmt->execute();
            $persona->setId($db->lastInsertId());

            if ($esUsuario) {
                $usuarioRepository = new UsuarioRepository($this->db);

                $usuarioRepository->create($persona->getId(), $persona->getUsuario());
            }
            $db->commit();


        } catch (Exception $e) {
            if ($db != null) $db->rollback();
            if ($e instanceof PDOException && $stmt->errorInfo()[0] == 23000 && $stmt->errorInfo()[1] == 1062) {
                $array = explode("'", $stmt->errorInfo()[2]);

                switch ($array[3]) {
                    case 'legajo_unico':
                        throw new BadRequestException("El legajo " . $array[1] . " ya existe.");
                        break;

                    case 'documento_unico':
                        $array2 = explode("-", $array[1]);
                        $TipoDocumentoRepository = new TipoDocumentoRepository($this->db);
                        $nombreDocumento = $TipoDocumentoRepository->get($array2[0])->getNombre();
                        throw new BadRequestException($nombreDocumento . ": " . $array2[1] . " ya existe");
                        break;


                }
                if ($db != null) $db->rollback();
            } else {
                throw $e;
            }
        } finally {
            $stmt = null;
            //$db = null;
            $this->disconnect();
        }

        return $persona;
    }

    public function update(Persona $persona)
    {
        try {
            $consulta = "UPDATE personas SET nombre=:nombre, apellido=:apellido, documento_tipo=:documentoTipo, documento_numero=:documentoNumero, nacionalidad=:nacionalidad, sexo=:sexo, fecha_nacimiento=:fechaNacimiento, es_activo=:esActivo, calle=:calle, numero=:numero, piso=:piso, departamento=:departamento, localidad=:localidad,telefono_codigo_area=:telefonoCodArea, telefono_numero=:telefonoNumero, celular_codigo_area=:celularCodArea, celular_numero=:celularNumero, email=:email, observaciones=:observaciones, legajo_numero=:legajoNumero, fecha_ingreso=:fechaIngreso, fecha_baja=:fechaBaja, base=:base, categoria=:categoria, contrato=:contrato, ypf_ruta=:ypfRuta, comentarios_laborales=:comentariosLaborales, es_usuario=:esUsuario, foto=:foto 
                            WHERE id=:id";

            $id = $persona->getId();
            $nombre = $persona->getNombre();
            $apellido = $persona->getApellido();
            $documentoTipo = $persona->getDocumentoTipo()->getId();
            $documentoNumero = $persona->getDocumentoNumero();
            $nacionalidad = $persona->getNacionalidad()->getId();
            $sexo = $persona->getSexo();
            $fechaNacimiento = $persona->getFechaNacimiento();
            $esActivo = $persona->getEsActivo();
            $calle = $persona->getCalle();
            $numero = $persona->getNumero();
            $piso = $persona->getPiso();
            $departamento = $persona->getDepartamento();
            $localidad = $persona->getLocalidad()->getId();
            $telefonoCodArea = $persona->getTelefonoCodArea();
            $telefonoNumero = $persona->getTelefonoNumero();
            $celularCodArea = $persona->getCelularCodArea();
            $celularNumero = $persona->getCelularNumero();
            $email = $persona->getEmail();
            $observaciones = $persona->getObservaciones();
            $legajoNumero = $persona->getLegajoNumero();
            $fechaIngreso = $persona->getFechaIngreso();
            $fechaBaja = $persona->getFechaBaja();
            $base = $persona->getBase()->getId();

            if ($persona->getCategoria() == null || $persona->getCategoria()->getId() == null) {

                $categoria = null;
            } else {
                $categoria = $persona->getCategoria()->getId();


            }
            $contrato = $persona->getContrato();
            $ypfRuta = $persona->getYpfRuta();
            $comentariosLaborales = $persona->getComentariosLaborales();
            $esUsuario = $persona->getEsUsuario();
            $usuario = $persona->getUsuario();
            $foto = $persona->getFoto();

            $db = $this->connect();
            $db->beginTransaction();

            $stmt = $db->prepare($consulta);

            $stmt->bindParam(':id', $id);
            $stmt->bindParam(':nombre', $nombre);
            $stmt->bindParam(':apellido', $apellido);
            $stmt->bindParam(':documentoTipo', $documentoTipo);
            $stmt->bindParam(':documentoNumero', $documentoNumero);
            $stmt->bindParam(':nacionalidad', $nacionalidad);
            $stmt->bindParam(':sexo', $sexo);
            $stmt->bindParam(':fechaNacimiento', $fechaNacimiento);
            $stmt->bindParam(':esActivo', $esActivo, PDO::PARAM_BOOL);
            $stmt->bindParam(':calle', $calle);
            $stmt->bindParam(':numero', $numero);
            $stmt->bindParam(':piso', $piso);
            $stmt->bindParam(':departamento', $departamento);
            $stmt->bindParam(':localidad', $localidad);
            $stmt->bindParam(':telefonoCodArea', $telefonoCodArea);
            $stmt->bindParam(':telefonoNumero', $telefonoNumero);
            $stmt->bindParam(':celularCodArea', $celularCodArea);
            $stmt->bindParam(':celularNumero', $celularNumero);
            $stmt->bindParam(':email', $email);
            $stmt->bindParam(':observaciones', $observaciones);
            $stmt->bindParam(':legajoNumero', $legajoNumero);
            $stmt->bindParam(':fechaIngreso', $fechaIngreso);
            $stmt->bindParam(':fechaBaja', $fechaBaja);
            $stmt->bindParam(':base', $base);
            $stmt->bindParam(':categoria', $categoria);
            $stmt->bindParam(':contrato', $contrato);
            $stmt->bindParam(':ypfRuta', $ypfRuta);
            $stmt->bindParam(':comentariosLaborales', $comentariosLaborales);
            $stmt->bindParam(':esUsuario', $esUsuario, PDO::PARAM_BOOL);
            $stmt->bindParam(':foto', $foto);
            $stmt->execute();

            if ($esUsuario) {
                $usuarioRepository = new UsuarioRepository($this->db);
                $usuarioRepository->update($id, $usuario);
            }

            $db->commit();
        } catch (Exception $e) {
            if ($db != null) $db->rollback();
            if ($e instanceof PDOException && $stmt->errorInfo()[0] == 23000 && $stmt->errorInfo()[1] == 1062) {
                $array = explode("'", $stmt->errorInfo()[2]);

                switch ($array[3]) {
                    case 'legajo_unico':
                        throw new BadRequestException("El legajo " . $array[1] . " ya existe.");
                        break;

                    case 'documento_unico':
                        $array2 = explode("-", $array[1]);
                        $TipoDocumentoRepository = new TipoDocumentoRepository($this->db);
                        $nombreDocumento = $TipoDocumentoRepository->get($array2[0])->getNombre();
                        throw new BadRequestException($nombreDocumento . ": " . $array2[1] . " ya existe");
                        break;


                }
                if ($db != null) $db->rollback();
            } else {
                throw $e;
            }
        } finally {
            $stmt = null;
            //$db = null;
            $this->disconnect();
        }

    }

    public function delete($id)
    {

        $persona = new Persona();
        $persona = $this->get($id);

        $consulta = "UPDATE personas SET es_activo=:esActivo WHERE id=:id";

        $db = $this->connect();
        $stmt = $db->prepare($consulta);

        if ($stmt == null) {
            return null;
        }

        $stmt->bindParam(':id', $id);

        /*if($persona->getEsUsuario()){
            $usuarioRepository = new UsuarioRepository();
            $usuarioRepository->eliminar($id);
        }*/

        $stmt->execute();

    }

    public function grid(DataTablesResponse $dataTablesResponse, DataTableRequest $dataTableRequest) {
        $db = $this->connect();

        $length = $dataTableRequest->getLength();
        $start = $dataTableRequest->getStart();
        $searchGeneral = $dataTableRequest->getSearch();
        $orderColumn = $dataTableRequest->getOrderColumn();
        $arrayColsFilter = $dataTableRequest->getArrayColsFilter();

        //RecordsTotal
        $consultaTotal = "SELECT COUNT(*) FROM personas";
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
                     FROM personas p
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
            $consulta .= " AND (p.nombre LIKE '%" . $searchGeneral . "%' OR apellido LIKE '%" . $searchGeneral . "%') ";
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


    public function getByUsuario(string $usuario): ?Persona
    {
        $sql = "SELECT p.*, u.id as usuarioId
               FROM personas p
                LEFT JOIN usuarios u on p.id = u.persona
                WHERE p.es_activo = '1' 
                AND u.usuario=:usuario";

        $db = $this->connect();
        $stmt = $db->prepare($sql);
        $stmt->bindParam(':usuario', $usuario);
        $stmt->execute();
        $result = $stmt->fetchObject();

        $item = null;
        if ($result != null) {
            $item = $this->createFromResultset($result, ['*'], $this->db);
        }

        $this->disconnect();
        return $item;
    }

    private function change_camel_case($input)
    {
        preg_match_all('!([A-Z][A-Z0-9]*(?=$|[A-Z][a-z0-9])|[A-Za-z][a-z0-9]+)!', $input, $matches);
        $ret = $matches[0];
        foreach ($ret as &$match) {
            $match = $match == strtoupper($match) ? strtolower($match) : lcfirst($match);
        }
        return implode('_', $ret);
    }

    public function getByToken(string $token): ?Persona
    {
        $sql = "SELECT p.*, ut.usuario as usuarioId, ut.expiracion as expiracion
                FROM usuarios_tokens ut
                LEFT JOIN usuarios u ON ut.usuario = u.id 
                LEFT JOIN personas p on u.persona = p.id 
                WHERE ut.expiracion >= :currentDatetime
                and p.es_activo = '1'
                and p.es_usuario = '1'
                and p.fecha_baja is null
                AND ut.token = :token";

        $db = $this->connect();
        $stmt = $db->prepare($sql);
        $currentDatetime = (new DateTime())->format('Y-m-d H:i:s');
        $stmt->bindParam(':currentDatetime', $currentDatetime);
        $stmt->bindParam(':token', $token);
        $stmt->execute();
        $result = $stmt->fetchObject();

        $item = null;
        if ($result != null) {
            $item = $this->createFromResultset($result, ['usuario'], $this->db);
            $item->getUsuario()->setToken($token);
            $tokenExpire = $result->expiracion;
            $item->getUsuario()->setTokenExpire($tokenExpire);
        }

        $this->disconnect();
        return $item;
    }

    public function getAllByPermiso($permiso): ?array
    {
        $personas = Array();
        $sql = "select personas.* from personas 

                    inner join usuarios as u on u.persona= personas.id 
                    inner join perfiles as p on u.perfil=p.id
                    inner join perfil_permisos as pp on p.id=pp.perfil
                    where pp.permiso='$permiso'";

        $db = $this->connect();
        $stmt = $db->prepare($sql);
        $stmt->execute();
        $items = $stmt->fetchAll(PDO::FETCH_OBJ);

        if ($items == null) {
            return null;
        }


        foreach ($items as $item) {


            $persona = new Persona();
            $persona->setId((int)$item->id);
            $persona->setNombre($item->nombre);
            $persona->setApellido($item->apellido);
            $persona->setDocumentoNumero($item->documento_numero);
            $persona->setSexo($item->sexo);
            $persona->setFechaNacimiento($item->fecha_nacimiento);
            $persona->setEsActivo((bool)$item->es_activo);
            $persona->setCalle($item->calle);
            $persona->setNumero((int)$item->numero);
            $persona->setPiso($item->piso);
            $persona->setDepartamento($item->departamento);
            $persona->setTelefonoCodArea((int)$item->telefono_codigo_area);
            $persona->setTelefonoNumero((int)$item->telefono_numero);
            $persona->setCelularCodArea((int)$item->celular_codigo_area);
            $persona->setCelularNumero((int)$item->celular_numero);
            $persona->setEmail($item->email);
            $persona->setObservaciones($item->observaciones);
            $persona->setLegajoNumero($item->legajo_numero);
            $persona->setFechaIngreso($item->fecha_ingreso);
            $persona->setFechaBaja($item->fecha_baja);
            $persona->setContrato($item->contrato);
            $persona->setYpfRuta($item->ypf_ruta);
            $persona->setComentariosLaborales($item->comentarios_laborales);
            $persona->setFoto($item->foto);
            $persona->setEsUsuario((bool)$item->es_usuario);

            $persona->setDocumentoTipo(null);
            $persona->setNacionalidad(null);
            $persona->setLocalidad(null);
            $persona->setProvincia(null);
            $persona->setPais(null);
            $persona->setCategoria(null);
            $persona->setBase(null);
            $persona->setUsuario(null);






            array_push($personas, $persona);

        }

        $this->disconnect();
        return $personas;
    }

    private function createFromResultset($result, array $fields, $db)
    {
        $item = new Persona();
        $item->setId((int)$result->id);
        $item->setNombre($result->nombre);
        $item->setApellido($result->apellido);
        $item->setDocumentoNumero($result->documento_numero);
        $item->setSexo($result->sexo);
        $item->setFechaNacimiento($result->fecha_nacimiento);
        $item->setEsActivo((bool)$result->es_activo);
        $item->setCalle($result->calle);
        $item->setNumero((int)$result->numero);
        $item->setPiso($result->piso);
        $item->setDepartamento($result->departamento);
        $item->setTelefonoCodArea((int)$result->telefono_codigo_area);
        $item->setTelefonoNumero((int)$result->telefono_numero);
        $item->setCelularCodArea((int)$result->celular_codigo_area);
        $item->setCelularNumero((int)$result->celular_numero);
        $item->setEmail($result->email);
        $item->setObservaciones($result->observaciones);
        $item->setLegajoNumero($result->legajo_numero);
        $item->setFechaIngreso($result->fecha_ingreso);
        $item->setFechaBaja($result->fecha_baja);
        $item->setContrato($result->contrato);
        $item->setYpfRuta($result->ypf_ruta);
        $item->setComentariosLaborales($result->comentarios_laborales);
        $item->setFoto($result->foto);
        $item->setEsUsuario((bool)$result->es_usuario);
        if (in_array('*', $fields) || in_array('documentoTipo', $fields))
            $item->setDocumentoTipo((new TipoDocumentoRepository($db))->get($result->documento_tipo));
        if (in_array('*', $fields) || in_array('nacionalidad', $fields))
            $item->setNacionalidad((new PaisRepository($db))->get($result->nacionalidad));
        if (in_array('*', $fields) || in_array('localidad', $fields))
            $item->setLocalidad((new LocalidadRepository($db))->get($result->localidad));
        if (in_array('*', $fields) || in_array('provincia', $fields))
            $item->setProvincia($item->getLocalidad()->getProvincia());
        if (in_array('*', $fields) || in_array('pais', $fields))
            $item->setPais($item->getLocalidad()->getProvincia()->getPais());
        if (in_array('*', $fields) || in_array('categoria', $fields))
            $item->setCategoria((new PersonaCategoriaRepository($db))->get($result->categoria));
        if (in_array('*', $fields) || in_array('base', $fields))
            $item->setBase(null);
        if ((in_array('*', $fields) || in_array('usuario', $fields)) && $item->getEsUsuario())
            $item->setUsuario((new UsuarioRepository($db))->get($result->usuarioId));
        return $item;
    }
}