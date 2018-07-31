<?php
use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

require_once '../Service/ParametrosService.php';
require_once '../Model/Parametro.php';

class ParametroController {
    private $app;

    public function __construct($app) {
        $this->app = $app;
    }

    public function init() {
        $this->app->group('/api', function () {
            $this->group('/parametros', function () {
                $this->get('', function (Request $request, Response $response) {
                    $service = new ParametrosService();
                    $items = $service->getAll();
                    return $response->withJson($items, 200);
                });

                $this->get('/{parametro}', function(Request $request, Response $response) {
                    $parametro = $request->getAttribute('parametro');
                    $service = new ParametrosService();
                    $parametro = $service->get($parametro);
                    if ($parametro == null) {
                        return $response->withStatus(204);
                    }
                    return $response->withJson($parametro, 200);
                });
            });
        });
    }
}