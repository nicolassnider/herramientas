<?php
/**
 * Created by Nicolás Snider
 * Date: 01/07/2018
 * Time: 1:10 AM
 */

require_once '../Commons/Config/Config.php';
require_once '../Commons/Exceptions/BadRequestException.php';
class Db
{
    private $host;
    private $port;
    private $database;
    private $username;
    private $password;

    private $cx = null;

    public function __construct()
    {
        $this->host = Config::get('database.host');
        $this->port = Config::get('database.port');
        $this->database = Config::get('database.database');
        $this->username = Config::get('database.username');
        $this->password = Config::get('database.password');
    }

    public function connect()
    {
        if ($this->cx == null) {
            $conexion_mysql = "mysql:host=$this->host;port=$this->port;dbname=$this->database;charset=utf8";
            $this->cx = new PDO($conexion_mysql, $this->username, $this->password);
            $this->cx->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        }
        return $this->cx;
    }

    public function disconnect()
    {
        $this->cx = null;
    }
}


