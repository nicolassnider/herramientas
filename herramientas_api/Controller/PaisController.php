<?php
use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

require_once '../Service/PaisService.php';

class PaisController {
    private $app;

    public function __construct($app) {
        $this->app = $app;
    }

    public function init() {
        $this->app->group('/api', function () {
            $this->group('/paises', function () {
                $this->get('/select', function (Request $request, Response $response) {
                    $items = (new PaisService())->getAllSorted();
                    array_walk($items, function(&$item) {
                        $item = new SelectOption($item->getId(), $item->getNombre());
                    });
                    return $response->withJson($items, 200);
                })->add(new ValidatePermissionsMiddleware([
                    'PERSONAS_CREAR',
                    'PERSONAS_MODIFICAR'
                    // TODO: Agregar los permisos faltantes.
                ]));
                
                $this->get('', function (Request $request, Response $response) {

                    $paisService = new PaisService();
                    $paises = $paisService->getAllSorted();

                    return $response->withJson($paises, 200);
                });
            });
        });
    }
}
