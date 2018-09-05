<?php
use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

require_once '../Commons/Config/ConfigBusiness.php';

class CommonsController {
    private $app;

    public function __construct($app) {
        $this->app = $app;
    }

    public function init() {
        $this->app->group('/api', function () {
            $this->group('/commons', function () {
                $this->get('/datetime', function(Request $request, Response $response) {
                    $fecha = date("Y-m-d H:i:s");
                    return $response->withJson($fecha, 200);
                });

                $this->get('/config-business', function(Request $request, Response $response) {
                    $config = ConfigBusiness::getAll();
                    return $response->withJson($config, 200);
                });
            });
        });
    }
}