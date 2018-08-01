<?php

/**
 * Created by Nicolás Snider
 * Date: 01/07/2018
 * Time: 12:43 AM
 */
class TipoDocumentoRepository extends AbstractRepository

{

    public function getAllSorted(): Array
    {
        $sql = "SELECT * 
                FROM tipo_documento 
                ORDER BY descripcion ASC";

        $db = $this->connect();
        $result = $db->query($sql);
        $items = $result->fetchAll(PDO::FETCH_OBJ);

        if ($items == null) {
            return Array();
        }

        $tiposDocumento = Array();
        foreach ($items as $item) {
            $tipoDocumento=$this->createFromResultset($item, [], $this->db);
            array_push($tiposDocumento, $tipoDocumento);
        }
        $this->disconnect();
        return $tiposDocumento;
    }

    /**
     * Usar esta función para crear una entidad a partir del resultado
     * obtenido de la consulta a la base de datos.
     * Parámetros:
     *  $result: Resultado obtenido de la consulta a la base de datos.
     *  $fields: Array que especifica qué entidades relacionadas se deben obtener.
     *          Si se quieren obtener todas las entidades relacionadas se debe enviar ['*'].
     *  $db: Conexión a la base de datos.
     */
    private function createFromResultset($result, array $fields, $db)
    {
        $item = new TipoDocumento();
        $item->setId($result->id);
        $item->setDescripcion($result->descripcion);
        return $item;
    }

}