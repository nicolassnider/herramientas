<?php
require_once 'AbstractRepository.php';
require_once '../Model/Usuario.php';
require_once '../Model/Perfil.php';
require_once '../Repository/PerfilRepository.php';

class UsuarioRepository extends AbstractRepository
{

    public function getAll(): Array
    {
        $sql = "SELECT usuario.*,revendedora.id as rev_id
                FROM usuario
                inner join revendedora on usuario.revendedora = revendedora.id";

        $db = $this->connect();
        $stmt = $db->prepare($sql);
        $stmt->execute();
        $items = $stmt->fetchAll(PDO::FETCH_OBJ);


        if ($items == null) {
            return Array();
        }

        $usuarios = Array();
        foreach ($items as $item) {
            $usuario = new Usuario();
            $usuario->setId((int)$item->id);
            $usuario->setUsuario($item->usuario);
            $usuario->setClave($item->clave);
            $usuario->setNotificacionesActivas($item->notificaciones_activas);
            $usuario->setPerfil((new PerfilRepository($this->db))->get($item->perfil));
            array_push($usuarios, $usuario);
        }


        $this->disconnect();
        return $usuarios;
    }
    
    public function get($id)
    {

        $sql = "SELECT * FROM usuario WHERE id=:id";
        $db = $this->connect();
        $stmt = $db->prepare($sql);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        $result = $stmt->fetchObject();


        $item = null;
        if ($result != null) {
            $item = new Usuario();
            $item->setId((int)$result->id);
            $item->setUsuario($result->usuario);
            $item->setClave($result->clave);
            $item->setNotificacionesActivas($result->notificaciones_activas);
            $item->setPerfil((new PerfilRepository($this->db))->get($result->perfil));
        }

        $this->disconnect();

        return $item;
    }

    public function buscar($id)
    {
        $consulta = "SELECT * FROM usuario WHERE persona=:id";
        $db = $this->connect();
        $stmt = $db->prepare($consulta);
        $stmt->bindParam(':id', $id);
        $stmt->execute();

        $resultado = $stmt->fetchObject();

        if ($resultado == null) {
            return null;
        }

        $usuario = new Usuario();
        $usuario->setId((int)$resultado->id);
        $usuario->setUsuario($resultado->usuario);
        $usuario->setNotificacionesActivas($resultado->notificaciones_activas);
        $usuario->setPerfil((new PerfilesRepository($this->db))->get($resultado->perfil));

        $this->disconnect();
        return $usuario;
    }

    public function delete($id)
    {

        $consulta = "DELETE FROM usuario WHERE persona=:id";

        $db = new Db();
        $db = $db->connect();
        $stmt = $db->prepare($consulta);

        $stmt->bindParam(":id", $id);
        $stmt->execute();
    }

    public function create(Revendedora $revendedora): Usuario
    {
        try {
            $persona= (new PersonaRepository($this->db))->get($revendedora->getPersona()->getId());
            $db = $this->connect();
            $sqlCreateUsuario = "INSERT INTO  herramientas.usuario  (
                                                              revendedora, 
                                                              usuario, 
                                                              clave, 
                                                              perfil, 
                                                              notificaciones_activas) 
                          VALUES (
                                                              :revendedora, 
                                                              :usuario, 
                                                              :clave, 
                                                              :perfil, 
                                                              :notificaciones_activas);";
            $stmtCreateUsuario = $db->prepare($sqlCreateUsuario);
            $idRevendedora = (int)$revendedora->getId();
            $usuarioN = UsuarioRepository::generaUsuario($persona->getNombre(), $persona->getApellido(), $persona->getDocumento());
            $clave = "password";
            $perfil = $revendedora->getUsuario()->getPerfil()->getId();
            $notificacionesActivas = (bool)$revendedora->getUsuario()->getNotificacionesActivas();
            $stmtCreateUsuario->bindParam(':revendedora', $idRevendedora, PDO::PARAM_INT);
            $stmtCreateUsuario->bindParam(':usuario', $usuarioN);
            $stmtCreateUsuario->bindParam(':clave', $clave);
            $stmtCreateUsuario->bindParam(':perfil', $perfil, PDO::PARAM_INT);
            $stmtCreateUsuario->bindParam(':notificaciones_activas', $notificacionesActivas, PDO::PARAM_BOOL);
            $stmtCreateUsuario->execute();
            $revendedora->getUsuario()->setId($db->lastInsertId());
            $revendedora->getUsuario()->setUsuario($usuarioN);

        } catch (Exception $e) {
            $array = $stmtCreateUsuario->errorInfo();
            die(print_r($array));
            if ($e instanceof PDOException && $stmtCreateUsuario->errorInfo()[0] == 23000 && $stmtCreateUsuario->errorInfo()[1] == 1062) {
                $array = explode("'", $stmtCreateUsuario->errorInfo()[2]);
                switch ($array[3]) {
                    case 'usuario_unico':
                        throw new BadRequestException("El usuario " . $array[1] . " ya existe.");
                        break;
                }
            } else {
                throw $e;
            }
        } finally {
            $this->disconnect();
            return $revendedora->getUsuario();
        }

    }

    public function update(Usuario $usuario)
    {

        try {
            $consulta = "UPDATE usuario SET clave=:clave, perfil=:perfil WHERE id=:id";



            $db = new Db();
            $db = $db->connect();
            $stmt = $db->prepare($consulta);

            $usuarioTemp = $this->get($usuario->getId());


            $usuario->getClave() ? $clave = $usuario->getClave() : $clave = $usuarioTemp->getClave();
            $id = $usuario->getId();
            $usuario->getPerfil() ? $perfil = $usuario->getPerfil()->getId() : $clave = $usuarioTemp->getPerfil()->getId();
            $id = $usuario->getId();

            $stmt->bindParam(':clave', $clave);
            $stmt->bindParam(':perfil', $perfil, PDO::PARAM_INT);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);

            $stmt->execute();
        } catch (Exception $e) {
            if ($e instanceof PDOException && $stmt->errorInfo()[0] == 23000 && $stmt->errorInfo()[1] == 1062) {
                $array = explode("'", $stmt->errorInfo()[2]);
                switch ($array[3]) {
                    case 'usuario_unico':
                        throw new BadRequestException("El usuario " . $array[1] . " ya existe.");
                        break;
                }
            } else {
                throw $e;
            }
        } finally {
            $this->disconnect();
        }
    }

    public function getByToken(string $token): ?Usuario
    {
        $sql = "SELECT u.*, ut.token, ut.expiracion
                FROM usuarios_tokens ut
                LEFT JOIN usuario u ON ut.usuario = u.id
                WHERE ut.token = :token";

        $db = $this->connect();
        $stmt = $db->prepare($sql);
        $stmt->bindParam(':token', $token);
        $stmt->execute();
        $result = $stmt->fetchObject();

        $item = null;
        if ($result != null) {
            $item = new Usuario();
            $item->setId((int)$result->id);
            $item->setUsuario($result->usuario);
            $item->setClave($result->clave);
            $item->setNotificacionesActivas($result->notificaciones_activas);
            $item->setToken($result->token);
            $item->setTokenExpire($result->expiracion);
            $item->setPerfil((new PerfilesRepository())->get($result->perfil));
        }

        return $item;
    }

    public function generaUsuario($nombre, $apellido, $documento): ?string
    {
        $nombreUsuario = strtolower(substr($nombre, 0, 3) . substr($apellido, 0, 3) . substr($documento, 4, 10));
        return $nombreUsuario;
    }
}