<?php
/**
 * Created by PhpStorm.
 * User: nicol
 * Date: 18/05/2018
 * Time: 4:02 PM
 */

class DataTablesResponse implements JsonSerializable
{
    private $draw;
    private $recordsTotal;
    private $recordsFiltered;
    private $data;

    /**
     * @return mixed
     */
    public function getDraw()
    {
        return $this->draw;
    }

    /**
     * @param mixed $draw
     */
    public function setDraw($draw)
    {
        $this->draw = $draw;
    }

    /**
     * @return mixed
     */
    public function getRecordsTotal()
    {
        return $this->recordsTotal;
    }

    /**
     * @param mixed $recordsTotal
     */
    public function setRecordsTotal($recordsTotal)
    {
        $this->recordsTotal = $recordsTotal;
    }

    /**
     * @return mixed
     */
    public function getRecordsFiltered()
    {
        return $this->recordsFiltered;
    }

    /**
     * @param mixed $recordsFiltered
     */
    public function setRecordsFiltered($recordsFiltered)
    {
        $this->recordsFiltered = $recordsFiltered;
    }

    /**
     * @return mixed
     */
    public function getData()
    {
        return $this->data;
    }

    /**
     * @param mixed $data
     */
    public function setData($data)
    {
        $this->data = $data;
    }


    /**
     * Specify data which should be serialized to JSON
     * @link http://php.net/manual/en/jsonserializable.jsonserialize.php
     * @return mixed data which can be serialized by <b>json_encode</b>,
     * which is a value of any type other than a resource.
     * @since 5.4.0
     */
    public function jsonSerialize()
    {
        // TODO: Implement jsonSerialize() method.
        return
            [
                'draw' => $this->draw,
                'recordsTotal' => $this->recordsTotal,
                'recordsFiltered' => $this->recordsFiltered,
                'data' => $this->data
            ];
    }
}