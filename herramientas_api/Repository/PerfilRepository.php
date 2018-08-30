<?php
require_once 'AbstractRepository.php';
require_once '../Model/Perfil.php';
require_once '../Commons/Exceptions/BadRequestException.php';

class PerfilRepository  extends AbstractRepository {
    public function getAll(): array {
        $sql = "SELECT *
                FROM perfiles p
                LEFT JOIN perfil_permisos pp
                ON p.id = pp.perfil
                ORDER BY p.nombre ASC";

        $db = $this->connect();
        $result = $db->query($sql);
        $items = $result->fetchAll(PDO::FETCH_OBJ);

        if ($items==null) {
            return null;
        }

        $perfiles = Array();
        $id = 0;
        foreach ($items as $item) {
            if ($id != $item->id) {
                $permisos = array();
                $perfil = new Perfil();
                $perfil->setId((int)$item->id);
                $perfil->setNombre($item->nombre);
                array_push($perfiles, $perfil);
            }
            if ($item->permiso != null) array_push($permisos, $item->permiso);
            $perfil->setPermisos($permisos);
            $id = $item->id;
        }

        $this->disconnect();
        return $perfiles;
    }


    public function getAllByPermiso($permiso):array {
        $sql = "SELECT *
                FROM perfiles p
                LEFT JOIN perfil_permisos pp
                ON p.id = pp.perfil
                where pp.permiso like '$permiso'
                ORDER BY p.nombre ASC";

        $db = $this->connect();
        $result = $db->query($sql);
        $items = $result->fetchAll(PDO::FETCH_OBJ);


        if ($items==null) {
            return null;
        }

        $perfiles = Array();
        $id = 0;
        foreach ($items as $item) {
            if ($id != $item->id) {
                $permisos = array();
                $perfil = new Perfil();
                $perfil->setId((int)$item->perfil);
                $perfil->setNombre($item->nombre);
                array_push($perfiles, $perfil);
            }

            if ($item->permiso != null) array_push($permisos, $item->permiso);
            $perfil->setPermisos($permisos);
            $id = $item->id;

        }


        $this->disconnect();
        return $perfiles;
    }

    public function get($id): ?Perfil {
        $sql = "SELECT *
                FROM perfiles p
                LEFT JOIN perfil_permisos pp
                ON p.id = pp.perfil
                WHERE p.id=:id";

        $db = $this->connect();
        $stmt = $db->prepare($sql);

        $stmt->bindParam(':id', $id);
        $stmt->execute();
        $items = $stmt->fetchAll(PDO::FETCH_OBJ);

        if ($items==null)
        {
            return null;
        }

        $perfil = null;
        $id = 0;
        foreach ($items as $item) {
            if ($id != $item->id) {
                $permisos = array();
                $perfil = new Perfil();
                $perfil->setId((int)$item->id);
                $perfil->setNombre($item->nombre);
            }
            if ($item->permiso != null) array_push($permisos, $item->permiso);
            $perfil->setPermisos($permisos);
            $id = $item->id;
        }
        $this->disconnect();
        return $perfil;
    }

    public function create(Perfil $perfil): Perfil {
        $db = null;
        $stmt = null;
        $nombre = $perfil->getNombre();
        try {
            $db = $this->connect();
            $db->beginTransaction();

            $sql = "INSERT INTO perfiles (nombre) 
                    VALUES (:nombre)";

            $stmt = $db->prepare($sql);
            $stmt->bindParam(':nombre', $nombre);
            $stmt->execute();
            $perfil->setId((int)$db->lastInsertId());

            $sql = "INSERT INTO perfil_permisos (perfil,permiso) 
                    VALUES (:perfil,:permiso)";

            $stmt = $db->prepare($sql);
            $id = $perfil->getId();
            foreach ($perfil->getPermisos() as $permiso) {
                if (in_array($permiso, Permisos::permisos)) {
                    $stmt->bindParam(':perfil', $id);
                    $stmt->bindParam(':permiso', $permiso);
                    $stmt->execute();
                } else {
                    throw new BadRequestException("No existe el permiso " . $permiso . ".");
                }
            }
            $db->commit();
        } catch (Exception $e) {
            if ($db != null) $db->rollback();
            if($e instanceof PDOException && $stmt->errorInfo()[0] == 23000 && $stmt->errorInfo()[1] == 1062) {
                throw new BadRequestException("Ya existe un perfil con el nombre " . $nombre . ".");
            } else {
                throw $e;
            }
        } finally {
            $stmt = null;
            $db = null;
            $this->disconnect();
        }
        return $perfil;
    }

    public function update(Perfil $perfil): void {
        $db = null;
        $stmt = null;

        $id = $perfil->getId();
        $nombre = $perfil->getNombre();
        try {
            $db = $this->connect();
            $db->beginTransaction();

            $sql = "UPDATE perfiles 
                    SET nombre=:nombre 
                    WHERE id=:id";

            $stmt = $db->prepare($sql);
            $stmt->bindParam(':id', $id);
            $stmt->bindParam(':nombre', $nombre);
            $stmt->execute();

            $sql = "DELETE FROM perfil_permisos
                    WHERE perfil=:perfil";

            $stmt = $db->prepare($sql);
            $stmt->bindParam(':perfil', $id);
            $stmt->execute();

            $sql = "INSERT INTO perfil_permisos (perfil,permiso) 
                    VALUES (:perfil,:permiso)";

            $stmt = $db->prepare($sql);
            foreach ($perfil->getPermisos() as $permiso) {
                if (in_array($permiso, Permisos::permisos)) {
                    $stmt->bindParam(':perfil', $id);
                    $stmt->bindParam(':permiso', $permiso);
                    $stmt->execute();
                } else {
                    throw new BadRequestException("No existe el permiso " . $permiso . ".");
                }
            }
            $db->commit();
        } catch (Exception $e) {
            if ($db != null) $db->rollback();
            if($e instanceof PDOException && $stmt->errorInfo()[0] == 23000 && $stmt->errorInfo()[1] == 1062) {
                throw new BadRequestException("Ya existe un perfil con el nombre " . $nombre . ".");
            } else {
                throw $e;
            }
        } finally {
            $stmt = null;
            $db = null;
            $this->disconnect();
        }
    }

    public function delete($id): void {
        $db = null;
        $stmt = null;
        try {
            $db = $this->connect();
            $db->beginTransaction();

            $sql = "DELETE FROM perfil_permisos
                        WHERE perfil=:perfil";

            $stmt = $db->prepare($sql);
            $stmt->bindParam(':perfil', $id);
            $stmt->execute();

            $sql = "DELETE FROM perfiles 
                    WHERE id=:id";

            $stmt = $db->prepare($sql);
            $stmt->bindParam(':id', $id);
            $stmt->execute();

            $db->commit();
        } catch (Exception $e) {
            if ($db != null) $db->rollback();
            throw $e;
        } finally {
            $stmt = null;
            $db = null;
            $this->disconnect();
        }
    }
}