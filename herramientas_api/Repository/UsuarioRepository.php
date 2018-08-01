<?php
require_once 'AbstractRepository.php';
require_once '../Model/Usuario.php';
require_once '../Model/Perfil.php';
require_once '../Model/Gerenciador.php';
require_once '../Repository/GerenciadoresRepository.php';
require_once '../Repository/PerfilesRepository.php';

class UsuarioRepository extends AbstractRepository {
    public function get($id) {
        $sql = "SELECT * FROM usuarios WHERE id=:id";
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
            $item->setMovil(null);
            $item->setGerenciador(null);
            $item->setPerfil((new PerfilesRepository($this->db))->get($result->perfil));
        }

        $this->disconnect();
        return $item;
    }

    public function buscar($id) {
        $consulta = "SELECT * FROM usuarios WHERE persona=:id";
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
        $usuario->setMovil(null); //TODO: Completar
        $usuario->setGerenciador(
            $resultado->gerenciador != null ?
            (new GerenciadoresRepository($this->db))->get($resultado->gerenciador) :
            null
        );
        $usuario->setPerfil((new PerfilesRepository($this->db))->get($resultado->perfil));

        $this->disconnect();
        return $usuario;
    }

    public function delete($id){

        $consulta = "DELETE FROM usuarios WHERE persona=:id";

        $db = new Db();
        $db = $db->connect();
        $stmt = $db->prepare($consulta);

        $stmt->bindParam(":id", $id);
        $stmt->execute();
    }

    public function create(int $id, Usuario $usuario): Usuario {
        try {
            $consulta = "INSERT INTO usuarios (
                persona,
                usuario,
                clave_activacion_codigo,
                clave_activacion_expiracion,
                perfil,
                notificaciones_activas,
                movil,
                gerenciador
            ) VALUES (
                :persona,
                :usuario,
                :claveActivacionCodigo,
                :claveActivacionExpiracion,
                :perfil,
                :notificacionesActivas,
                :movil,
                :gerenciador
            )";

            $db = $this->connect();
            $stmt = $db->prepare($consulta);
            $nUsuario = $usuario->getUsuario();
            $perfil = $usuario->getPerfil()->getId();
            $notificacionesActivas = $usuario->getNotificacionesActivas();
            $movil = $usuario->getMovil();
            $gerenciador = $usuario->getGerenciador()->getId();
            $claveActivacionCodigo = $usuario->getClaveActivacionCodigo();
            $claveActivacionExpiracion = $usuario->getClaveActivacionExpiracion();

            $stmt->bindParam(':persona', $id, PDO::PARAM_INT);
            $stmt->bindParam(':usuario', $nUsuario);
            $stmt->bindParam(':claveActivacionCodigo', $claveActivacionCodigo);
            $stmt->bindParam(':claveActivacionExpiracion', $claveActivacionExpiracion);
            $stmt->bindParam(':perfil', $perfil, PDO::PARAM_INT);
            $stmt->bindParam(':notificacionesActivas', $notificacionesActivas, PDO::PARAM_BOOL);
            $stmt->bindParam(':movil', $movil, PDO::PARAM_INT);
            $stmt->bindParam(':gerenciador', $gerenciador, PDO::PARAM_INT);
            $stmt->execute();
            $usuario->setId($db->lastInsertId());
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
        return $usuario;
    }

    public function update($id, $usuario){

        try{
            $consulta = "UPDATE usuarios SET usuario=:usuario, perfil=:perfil, notificaciones_activas=:notificacionesActivas, movil=:movil, gerenciador=:gerenciador WHERE persona=:persona";

            $db = new Db();
            $db = $db->connect();
            $stmt = $db->prepare($consulta);

            $usuarioN = $usuario->getUsuario();
            $perfil = $usuario->getPerfil()->getId();
            $notificacionesActivas = $usuario->getNotificacionesActivas();
            $movil = $usuario->getMovil();
            $gerenciador = $usuario->getGerenciador()->getId();


            $stmt->bindParam(':persona', $id);
            $stmt->bindParam(':usuario', $usuarioN);
            $stmt->bindParam(':perfil', $perfil);
            $stmt->bindParam(':notificacionesActivas', $notificacionesActivas);
            $stmt->bindParam(':movil', $movil);
            $stmt->bindParam(':gerenciador', $gerenciador);

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

    public function getByToken(string $token): ?Usuario {
        $sql = "SELECT u.*, ut.token, ut.expiracion
                FROM usuarios_tokens ut
                LEFT JOIN usuarios u ON ut.usuario = u.id
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
            $item->setMovil(null);
            $item->setGerenciador(null);
            $item->setToken($result->token);
            $item->setTokenExpire($result->expiracion);
            $item->setPerfil((new PerfilesRepository())->get($result->perfil));
        }

        return $item;
    }
}