<?php
use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

require_once '../Service/PermisosService.php';

class PermisosController {
    private $app;
    private $service;

    public function __construct($app) {
        $this->app = $app;
    }

    public function init() {
        $this->app->group('/api', function () {
            $this->group('/permisos', function () {
                $this->get('', function (Request $request, Response $response) {
                    $service = new PermisosService();
                    $items = $service->getAll();
                    return $response->withJson($items, 200);
                })->add(new ValidatePermissionsMiddleware([
                    'PERMISOS_LISTAR',
                    'PERFILES_CREAR',                    
                    'PERFILES_MODIFICAR'
                ]));
            });
        });
    }
}