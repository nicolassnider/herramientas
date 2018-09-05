<?php
use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

require_once '../Service/ProvinciaService.php';
require_once '../Model/Provincia.php';

class ProvinciaController {
    private $app;

    public function __construct($app) {
        $this->app = $app;
    }

    public function init() {
        $this->app->group('/api', function () {
            $this->group('/provincias', function () {
                $this->get('/{pais}/select', function (Request $request, Response $response) {
                    $pais = $request->getAttribute('pais');
                    $items = (new ProvinciaService())->getAllSortedByPais($pais);
                    array_walk($items, function(&$item) {
                        $item = new SelectOption($item->getId(), $item->getNombre());
                    });
                    return $response->withJson($items, 200);
                })->add(new ValidatePermissionsMiddleware([
                    'PERSONAS_CREAR',
                    'PERSONAS_MODIFICAR'
                    // TODO: Agregar los permisos faltantes.
                ]));
            });
        });
    }
}