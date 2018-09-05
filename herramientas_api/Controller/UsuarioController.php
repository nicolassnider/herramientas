<?php
use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

class UsuarioController{
    private $app;

    public function __construct($app){
        $this->app=$app;
    }

    public function init(){
        $this->app->group('/api', function(){
            
        });
    }
}