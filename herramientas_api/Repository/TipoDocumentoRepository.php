<?php

/**
 * Created by Nicolás Snider
 * Date: 01/07/2018
 * Time: 12:43 AM
 */
class TipoDocumentoRepository extends AbstractRepository {

    public function getAllSorted(): Array {
        $sql = "SELECT * 
                FROM tipo_documento 
                ORDER BY descripcion";
        $db = $this->connect();
        $result = $db->query($sql);
        $items = $result->fetchAll(PDO::FETCH_OBJ);

        if ($items == null) {
            return null;
        }

        $tiposDocumento = Array();
        foreach ($items as $item) {
            $tipoDocumento = new TipoDocumento();
            $tipoDocumento->setId($item->id);
            $tipoDocumento->setDescripcion($item->descripcion);
            array_push($tiposDocumento, $tipoDocumento);
        }

        $this->disconnect();
        return $tiposDocumento;
    }

    public function get(int $id): TipoDocumento {
        $sql = "SELECT * FROM tipo_documento WHERE id=:id";
        $db = $this->connect();
        $stmt = $db->prepare($sql);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        $result = $stmt->fetchObject();

        $item = null;
        if($result != null) {
            $item = new TipoDocumento();
            $item->setId((int)$result->id);
            $item->setDescripcion($result->descripcion);
        }

        $this->disconnect();
        return $item;
    }
}