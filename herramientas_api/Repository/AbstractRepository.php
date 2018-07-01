<?php
/**
 * Created by Nicolás Snider
 * Date: 01/07/2018
 * Time: 1:16 AM
 */
require_once 'Db.php';

abstract class AbstractRepository
{
    protected $db;
    private $isNewConnection = true;

    public function __construct($db = null)
    {
        if ($db == null) {
            $this->db = new Db();
        } else {
            $this->db = $db;
            $this->isNewConnection = false;
        }
    }

    public function connect()
    {
        return $this->db->connect();
    }

    public function disconnect()
    {
        if ($this->isNewConnection) {
            $this->db->disconnect();
        }
    }
}