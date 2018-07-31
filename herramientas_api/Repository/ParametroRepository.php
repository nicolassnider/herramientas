<?php
require_once '../Model/Parametro.php';
require_once 'AbstractRepository.php';

class ParametroRepository extends AbstractRepository
{
    public function getAll(): ?array
    {
        $parametros = Array();
        $consulta = "SELECT * FROM parametros order by descripcion asc";
        try {

            //conexionBD
            $db = $this->connect();
            $stmt = $db->prepare($consulta);
            $stmt->execute();
            $items = $stmt->fetchAll(PDO::FETCH_OBJ);

            if ($items==null)
            {
                return Array();
            }

            foreach ($items as $item) {
                $parametro = new Parametro();
                $parametro->setParametro($item->parametro);
                $parametro->setDescripcion($item->descripcion);
                $parametro->setValor($item->valor);

                //
                array_push($parametros, $parametro);
            }

        } finally {
            $db = null;
            $items = null;
            $this->disconnect();
        }
        return $parametros;

    }

    public function get($parametro):?Parametro
    {


        $sql = "SELECT * FROM parametros WHERE parametro=:parametro";
        $db = $this->connect();
        $stmt = $db->prepare($sql);
        $stmt->bindParam(':parametro', $parametro,PDO::PARAM_STR);
        $stmt->execute();
        $result = $stmt->fetchObject();


        if ($result==null)
        {
            return null;
        }

        $item = null;
        if ($result != null) {
            $item = new Parametro();
            $item->setParametro($result->parametro);
            $item->setDescripcion($result->descripcion);
            $item->setValor($result->valor);
        }


        $db = null;
        $this->disconnect();
        return $item;


    }


}