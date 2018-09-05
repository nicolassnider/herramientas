<?php
use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

require_once '../Service/LocalidadService.php';
require_once '../Model/Localidad.php';

class LocalidadController {
    private $app;

    public function __construct($app) {
        $this->app = $app;
    }

    public function init() {
        $this->app->group('/api', function () {
            $this->group('/localidades', function () {
                $this->get('/{provincia}/select', function (Request $request, Response $response) {
                    $provincia = $request->getAttribute('provincia');
                    $items = (new LocalidadService())->getAllSortedByProvincia($provincia);
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
