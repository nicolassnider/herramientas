<?php
require_once 'AbstractRepository.php';
require_once 'PersonaRepository.php';

class UsuarioTokensRepository extends AbstractRepository {
    public function create(string $token, Usuario $usuario, string $tokenExpire): void {
        $db = null;
        $stmt = null;
        try {
            $db = $this->connect();
            $db->beginTransaction();

            $sql = "DELETE
                    FROM usuarios_tokens
                    WHERE expiracion < :currentDatetime";

            $usuarioId = $usuario->getId();
            $currentDatetime = (new DateTime())->format('Y-m-d H:i:s');
            $stmt = $db->prepare($sql);
            $stmt->bindParam(':currentDatetime', $currentDatetime);
            $stmt->execute();

            $sql = "INSERT INTO usuarios_tokens (token, usuario, expiracion) 
                    VALUES (:token, :usuario, :expiracion)";

            $stmt = $db->prepare($sql);
            $stmt->bindParam(':token', $token);
            $stmt->bindParam(':usuario', $usuarioId);
            $stmt->bindParam(':expiracion', $tokenExpire);
            $stmt->execute();
            $db->commit();
        } catch (Exception $e) {
            if ($db != null) $db->rollback();
            throw $e;
        } finally {
            $this->disconnect();
        }
    }

    public function updateTokenExpire(string $token, string $tokenExpire): void {
        $sql = "UPDATE usuarios_tokens 
                SET expiracion = :expiracion
                WHERE token=:token";

        $db = $this->connect();
        $stmt = $db->prepare($sql);
        $stmt->bindParam(':token', $token);
        $stmt->bindParam(':expiracion', $tokenExpire);
        $stmt->execute();
        $this->disconnect();
    }

    public function removeToken(string $token): void {
        $sql = "DELETE FROM usuarios_tokens
                WHERE token=:token";

        $db = $this->connect();
        $stmt = $db->prepare($sql);
        $stmt->bindParam(':token', $token);
        $stmt->execute();
        $this->disconnect();
    }
}