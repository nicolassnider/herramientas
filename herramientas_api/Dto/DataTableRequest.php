<?php

class DataTableRequest implements JsonSerializable{

    private $length;
    private $start;
    private $search;
    private $orderColumn;
    private $arrayColsFilter;

    /**
     * @return mixed
     */
    public function getLength(){
        return $this->length;
    }

    /**
     * @param mixed $length
     */
    public function setLength($length){
        $this->length = $length;
    }

    /**
     * @return mixed
     */
    public function getSearch(){
        return $this->search;
    }

    /**
     * @param mixed $search
     */
    public function setSearch($search){
        $this->search = $search;
    }
    
    /**
     * @return mixed
     */
    public function getStart(){
        return $this->start;
    }

    /**
     * @param mixed $start
     */
    public function setStart($start){
        $this->start = $start;
    }

    /**
     * @return mixed
     */
    public function getOrderColumn(){
        return $this->orderColumn;
    }

    /**
     * @param mixed $start
     */
    public function setOrderColumn($orderColumn)
    {
        $this->orderColumn = $orderColumn;
    }

    /**
     * @return mixed
     */
    public function getArrayColsFilter(){
        return $this->arrayColsFilter;
    }

    /**
     * @param mixed $start
     */
    public function setArrayColsFilter($arrayColsFilter)
    {
        $this->arrayColsFilter = $arrayColsFilter;
    }

    public function jsonSerialize()
    {
        // TODO: Implement jsonSerialize() method.
        return
            [                
                'length'=>$this->length,
                'start'=>$this->start,
                'search'=>$this->search,
                'orderColumn'=>$this->orderColumn,
                'arrayColsFilter'=>$this->arrayColsFilter
            ];
    }
}